import { calculateTaskStatus } from '../lib/taskUtils';

const request = async (path, options) => {
  const response = await fetch(path, options);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Database tidak dapat memproses perubahan.');
  }
  return response.json();
};

const fetchDomain = (domain) => request(`/api/operational/${domain}`);
const saveDomain = (domain, item) => request(`/api/operational/${domain}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
const updateDomain = (domain, item) => request(`/api/operational/${domain}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
const fetchTasks = () => request('/api/tasks');
const fetchProjects = () => request('/api/projects');
const newId = (prefix) => `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
const taskDone = (task) => ['Resolved', 'Completed', 'Done'].includes(task.status);
const workload = (employee) => Math.round(((Number(employee.allocatedHours) || 0) / Math.max(1, Number(employee.capacityHours) || 40)) * 100);

const buildProjectView = (project, data) => {
  const tasks = data.tasks.filter((task) => task.projectId === project.id || (project.taskIds || []).includes(task.id));
  const completed = tasks.filter(taskDone).length;
  return {
    ...project,
    taskIds: project.taskIds?.length ? project.taskIds : tasks.map((task) => task.id),
    customer: data.customers.find((item) => item.id === project.customerId),
    package: data.packages.find((item) => item.id === project.packageId),
    workflows: (project.workflowIds || []).map((id) => data.workflows.find((item) => item.id === id)).filter(Boolean),
    tasks,
    sla: data.customerSlas.find((item) => item.id === project.slaId),
    progress: tasks.length ? Math.round((completed / tasks.length) * 100) : (project.status === 'In progress' ? 50 : 0),
    outcome: data.outcomes.find((item) => item.id === project.outcomeId || item.projectId === project.id),
    learnings: data.knowledge.filter((item) => (project.learningIds || []).includes(item.id) || item.sourceProjectId === project.id),
  };
};

async function getProjectData() {
  const [projects, tasks, customers, packages, workflows, customerSlas, outcomes, knowledge] = await Promise.all([
    fetchProjects(), fetchTasks(), fetchDomain('customers'), fetchDomain('servicePackages'), fetchDomain('workflows'),
    fetchDomain('customerSlas'), fetchDomain('outcomes'), fetchDomain('knowledge'),
  ]);
  return { projects, tasks, customers, packages, workflows, customerSlas, outcomes, knowledge };
}

export const operationsService = {
  async listCustomers() {
    const [customers, projects, customerSlas] = await Promise.all([fetchDomain('customers'), fetchProjects(), fetchDomain('customerSlas')]);
    return customers.map((customer) => ({ ...customer, projects: projects.filter((project) => project.customerId === customer.id), slas: customerSlas.filter((sla) => sla.customerId === customer.id || (customer.slaIds || []).includes(sla.id)) }));
  },

  async getCustomer(id) {
    const [customers, projects, customerSlas] = await Promise.all([this.listCustomers(), this.listProjects(), fetchDomain('customerSlas')]);
    const customer = customers.find((item) => item.id === id);
    if (!customer) throw new Error('Pelanggan tidak ditemukan.');
    return { ...customer, projects: projects.filter((project) => project.customerId === id), slas: customerSlas.filter((sla) => sla.customerId === id || (customer.slaIds || []).includes(sla.id)) };
  },

  async listProjects() {
    const data = await getProjectData();
    return data.projects.map((project) => buildProjectView(project, data));
  },

  async getProject(id) {
    const project = (await this.listProjects()).find((item) => item.id === id);
    if (!project) throw new Error('Proyek tidak ditemukan.');
    return project;
  },

  async listServicePackages() {
    const [packages, workflows] = await Promise.all([fetchDomain('servicePackages'), fetchDomain('workflows')]);
    return packages.filter((item) => item.active !== false).map((item) => ({ ...item, workflows: (item.workflowIds || []).map((id) => workflows.find((workflow) => workflow.id === id)).filter(Boolean) }));
  },

  async createProject({ customerId, packageId, name, scope }) {
    const [customers, packages, workflows, employees, rules] = await Promise.all([fetchDomain('customers'), fetchDomain('servicePackages'), fetchDomain('workflows'), fetchDomain('employees'), fetchDomain('slaRules')]);
    const customer = customers.find((item) => item.id === customerId);
    const servicePackage = packages.find((item) => item.id === packageId);
    if (!customer || !servicePackage) throw new Error('Pelanggan dan paket layanan wajib dipilih.');
    const projectId = newId('PRJ');
    const stages = (servicePackage.workflowIds || []).flatMap((workflowId) => {
      const workflow = workflows.find((item) => item.id === workflowId);
      return (workflow?.stages || []).map((stage) => ({ ...stage, workflow }));
    });
    const available = employees.filter((employee) => employee.availability !== 'Unavailable').sort((a, b) => workload(a) - workload(b));
    const projectTasks = stages.map((stage, index) => {
      const owner = available[index % Math.max(1, available.length)] || { name: 'Belum ditugaskan', initials: 'UN', department: 'Operasional' };
      const type = stage.workflow?.id === 'WF-INCIDENT' ? 'Support' : 'Implementation';
      const policy = rules.find((rule) => rule.type === type) || { defaultSla: stage.slaHours || 48 };
      return { id: newId('TSK'), projectId, task_type: type, task_priority: index === 0 ? 'High' : 'Medium', task_complexity: Math.min(8, 3 + index * 2), estimated_task_hours: Math.max(2, Math.round((stage.slaHours || policy.defaultSla) / 2)), sla_hours: stage.slaHours || policy.defaultSla, remaining_sla_hours: stage.slaHours || policy.defaultSla, task_queue_age_hours: 0, dependency_count: index ? 1 : 0, dependency_delay_hours: 0, reassignment_count: 0, cross_department_required: (stage.workflow?.requiredSkills || []).length > 1, peak_workload_flag: false, owner: { name: owner.name, initials: owner.initials }, department: owner.department, customer: customer.name, title: `${stage.name}: ${name || `${customer.name} ${servicePackage.name}`}`, responsibility: `${owner.name} bertanggung jawab atas ${stage.name.toLowerCase()}.`, expected_output: stage.gate, parent_customer_sla_id: (customer.slaIds || [])[0] || null, workflowId: stage.workflow?.id, stageId: stage.id, gate: stage.gate, status: 'Open', dependencies: index ? [{ id: newId('DEP'), task_id: null, status: 'Pending', owner: available[(index - 1) % Math.max(1, available.length)]?.name || 'Belum ditugaskan' }] : [], escalation_history: [], intervention_history: [], activity_history: [{ timestamp: new Date().toISOString(), action: `Tugas dibuat untuk ${stage.gate}`, user: 'Sistem' }] };
    });
    projectTasks.forEach((task, index) => { if (index) task.dependencies[0].task_id = projectTasks[index - 1].id; });
    const project = { id: projectId, name: name || `${customer.name} ${servicePackage.name}`, customerId, packageId, workflowIds: servicePackage.workflowIds || [], taskIds: projectTasks.map((task) => task.id), scope: scope || servicePackage.description, milestones: stages.map((stage, index) => ({ name: stage.name, status: index === 0 ? 'Ready' : 'Waiting', gate: stage.gate })), slaId: (customer.slaIds || [])[0] || null, status: 'In progress', learningIds: [] };
    await request('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...project, generatedTasks: projectTasks }) });
    await Promise.all(projectTasks.map((task) => request('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(task) })));
    return this.getProject(projectId);
  },

  async listWorkflows() {
    const [workflows, packages, knowledge] = await Promise.all([fetchDomain('workflows'), fetchDomain('servicePackages'), fetchDomain('knowledge')]);
    return workflows.map((workflow) => ({ ...workflow, packages: packages.filter((item) => (item.workflowIds || []).includes(workflow.id)), playbooks: knowledge.filter((item) => (workflow.linkedPlaybookIds || []).includes(item.playbookId)) }));
  },

  async listKnowledge() {
    const [knowledge, projects] = await Promise.all([fetchDomain('knowledge'), fetchProjects()]);
    return knowledge.map((item) => ({ ...item, sourceProject: projects.find((project) => project.id === item.sourceProjectId) }));
  },

  async listPilots() {
    const [pilots, customers, workflows, packages] = await Promise.all([fetchDomain('pilots'), fetchDomain('customers'), fetchDomain('workflows'), fetchDomain('servicePackages')]);
    return pilots.map((pilot) => ({ ...pilot, customer: customers.find((item) => item.id === pilot.customerId), workflow: workflows.find((item) => item.id === pilot.workflowId), package: packages.find((item) => item.id === pilot.packageId) }));
  },

  async listOutcomes() {
    const [outcomes, customers, projects] = await Promise.all([fetchDomain('outcomes'), fetchDomain('customers'), fetchProjects()]);
    return outcomes.map((outcome) => ({ ...outcome, customer: customers.find((item) => item.id === outcome.customerId), project: projects.find((item) => item.id === outcome.projectId) }));
  },

  async getOrganization() {
    const [leadership, employees] = await Promise.all([fetchDomain('leadership'), fetchDomain('employees')]);
    const departments = ['Teknologi', 'Implementasi', 'Support', 'Sales', 'Administrasi'];
    return { leadership, employees, divisions: departments.map((department) => ({ department, manager: leadership.find((person) => person.level === 'Manager' && person.department === department), employees: employees.filter((employee) => employee.department === department) })) };
  },

  async listBlueprints() {
    const [blueprints, packages, workflows, knowledge] = await Promise.all([fetchDomain('blueprints'), fetchDomain('servicePackages'), fetchDomain('workflows'), fetchDomain('knowledge')]);
    return blueprints.map((blueprint) => ({ ...blueprint, package: packages.find((item) => item.id === blueprint.packageId), workflows: (blueprint.workflowIds || []).map((id) => workflows.find((item) => item.id === id)).filter(Boolean), playbooks: knowledge.filter((item) => (blueprint.playbookIds || []).includes(item.playbookId)) }));
  },

  async getTaskContext(taskId) {
    const [task, data, customerSlas, knowledge] = await Promise.all([request(`/api/tasks/${taskId}`), getProjectData(), fetchDomain('customerSlas'), fetchDomain('knowledge')]);
    const project = data.projects.find((item) => item.id === task.projectId || (item.taskIds || []).includes(task.id));
    const customer = data.customers.find((item) => item.name === task.customer || item.id === project?.customerId);
    const workflow = data.workflows.find((item) => item.id === task.workflowId || (project?.workflowIds || []).includes(item.id));
    return { task, customer, project: project ? buildProjectView(project, data) : null, workflow, sla: customerSlas.find((item) => item.id === task.parent_customer_sla_id), dependencies: (task.dependencies || []).map((dependency) => ({ ...dependency, downstreamImpact: dependency.status === 'Delayed' ? `${task.title} berisiko terlambat karena ketergantungan ini.` : 'Belum ada dampak hilir.' })), knowledge: knowledge.filter((item) => item.workflowId === workflow?.id) };
  },

  async getCapacityRecommendations(taskId) {
    const [task, employees, tasks] = await Promise.all([request(`/api/tasks/${taskId}`), fetchDomain('employees'), fetchTasks()]);
    return employees.map((employee) => ({ ...employee, workloadRatio: workload(employee), activeTasks: tasks.filter((item) => item.owner?.initials === employee.initials && !taskDone(item)), skillMatch: (task.required_skills || [task.department]).filter((skill) => (employee.skills || []).includes(skill)).length, suitable: employee.availability === 'Available' && workload(employee) < 90 })).sort((a, b) => Number(b.suitable) - Number(a.suitable) || b.skillMatch - a.skillMatch || a.workloadRatio - b.workloadRatio);
  },

  async getMonitoring() {
    const [tasks, organization, projects, workflows, interventions] = await Promise.all([fetchTasks(), this.getOrganization(), this.listProjects(), this.listWorkflows(), request('/api/interventions')]);
    const taskStates = tasks.map((task) => ({ ...task, slaState: calculateTaskStatus(task.remaining_sla_hours, task.sla_hours), blocked: (task.dependencies || []).some((dependency) => dependency.status !== 'Resolved') }));
    return { projects, workflows: workflows.map((workflow) => ({ name: workflow.name, progress: projects.filter((project) => (project.workflowIds || []).includes(workflow.id)).reduce((sum, project) => sum + project.progress, 0) / Math.max(1, projects.filter((project) => (project.workflowIds || []).includes(workflow.id)).length) })), capacity: organization.employees.map((employee) => ({ ...employee, workloadRatio: workload(employee), activeTasks: tasks.filter((task) => task.owner?.initials === employee.initials && !taskDone(task)) })), blockedTasks: taskStates.filter((task) => task.blocked), bottlenecks: taskStates.filter((task) => (task.dependencies || []).some((dependency) => dependency.status === 'Delayed')), interventions, escalations: taskStates.flatMap((task) => (task.escalation_history || []).map((item) => ({ ...item, task }))) };
  },

  getSlaRules: () => fetchDomain('slaRules'),
  updateSlaRule: (id, patch) => updateDomain('slaRules', { ...patch, id }),
  getEscalationRules: () => fetchDomain('escalationRules'),
  saveEscalationRule: (rule) => saveDomain('escalationRules', { ...rule, id: rule.id || newId('ESC') }),

  async decide({ riskBand, slaState, dependencyDelayed, workloadRatio, priority, complexity }) {
    const [rules, escalationRules] = await Promise.all([fetchDomain('decisionMatrixRules'), fetchDomain('escalationRules')]);
    let action = 'Monitor';
    if (slaState === 'OVERDUE') action = 'Immediate Intervention';
    else if (riskBand === 'High' && dependencyDelayed) action = 'Escalate Dependency';
    else if (riskBand === 'High' && workloadRatio >= 90) action = 'Reassign Resource';
    else if (riskBand === 'High' && priority === 'Low' && complexity >= 7) action = 'Adjust Priority';
    const trigger = slaState === 'OVERDUE' ? 'overdue' : dependencyDelayed ? 'dependency' : slaState === 'AT RISK' ? 'at-risk' : null;
    return { action, advisory: true, escalation: escalationRules.find((rule) => rule.trigger === trigger), reason: `Matriks keputusan: risiko ${riskBand || 'tidak diketahui'}, SLA ${slaState}, dependensi ${dependencyDelayed ? 'terlambat' : 'aman'}, beban kerja ${workloadRatio || 0}%.`, rules };
  },

  async confirmIntervention({ taskId, action, reason, actor = 'Budi Santoso', changes = {} }) {
    const task = await request(`/api/tasks/${taskId}`);
    const timestamp = new Date().toISOString();
    const record = { id: newId('INT'), taskId, action, reason, actor, timestamp, source: 'Manager-confirmed', status: 'Monitoring' };
    const escalation = action.includes('Escalate') || calculateTaskStatus(task.remaining_sla_hours, task.sla_hours) === 'OVERDUE';
    const updatedTask = await request(`/api/tasks/${taskId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...changes, intervention_history: [record, ...(task.intervention_history || [])], activity_history: [{ timestamp, action: `Intervensi: ${action}`, user: actor, reason }, ...(task.activity_history || [])], escalation_history: escalation ? [{ timestamp, action: `${action} — eskalasi diaktifkan`, reason, user: actor, status: 'Open' }, ...(task.escalation_history || [])] : task.escalation_history || [] }) });
    await request('/api/interventions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record) });
    return { task: updatedTask, record };
  },
};
