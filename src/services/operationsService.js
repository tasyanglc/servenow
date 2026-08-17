import { mockTasks, mockCustomerSlas } from '../lib/mockData';
import { customers, decisionMatrixRules, employees, escalationRules, knowledgeItems, leadership, outcomes, pilots, projects, sectorBlueprints, servicePackages, slaRules, workflowTemplates } from '../lib/operationalData';
import { calculateTaskStatus } from '../lib/taskUtils';

const delay = (value) => new Promise(resolve => setTimeout(() => resolve(value), 120));
const fetchDomain = async (domain) => {
  const response = await fetch(`/api/operational/${domain}`);
  if (!response.ok) throw new Error('Data operasional tidak dapat dimuat dari database.');
  return response.json();
};
const persist = async (path, payload) => {
  const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Database tidak dapat menyimpan perubahan.');
  }
  return response.json();
};
const fetchPersistedProjects = async () => {
  const response = await fetch('/api/projects');
  if (!response.ok) throw new Error('Database tidak dapat memuat daftar proyek.');
  return response.json();
};
const taskById = (id) => mockTasks.find(task => task.id === id);
const customerByName = (name) => customers.find(customer => customer.name === name);
const workload = (employee) => Math.round((employee.allocatedHours / employee.capacityHours) * 100);

function projectView(project) {
  const tasks = project.taskIds.map(taskById).filter(Boolean);
  const completed = tasks.filter(task => task.status === 'Resolved').length;
  return { ...project, customer: customers.find(c => c.id === project.customerId), package: servicePackages.find(p => p.id === project.packageId), workflows: project.workflowIds.map(id => workflowTemplates.find(w => w.id === id)), tasks, sla: mockCustomerSlas.find(s => s.id === project.slaId), progress: tasks.length ? Math.round((completed / tasks.length) * 100) : project.status === 'In progress' ? 50 : 0, outcome: outcomes.find(o => o.id === project.outcomeId), learnings: knowledgeItems.filter(item => project.learningIds.includes(item.id)) };
}

const nextId = (prefix, collection) => `${prefix}-${String(collection.length + 1).padStart(3, '0')}`;
const ownerFor = (skills) => employees
  .filter(employee => employee.availability === 'Available')
  .sort((a, b) => Number(!(skills || []).some(skill => a.skills.includes(skill))) - Number(!(skills || []).some(skill => b.skills.includes(skill))) || workload(a) - workload(b))[0];
const taskTypeForWorkflow = (workflow) => workflow.id === 'WF-INCIDENT' ? 'Support' : workflow.id === 'WF-REPORT' ? 'Data Ops' : workflow.id === 'WF-RENEWAL' ? 'Sales' : 'Implementation';
const taskPolicy = (type) => slaRules.find(rule => rule.type === type) || { defaultSla: 48, threshold: 25 };

export const operationsService = {
  listCustomers: async () => { const databaseCustomers = await fetchDomain('customers'); return databaseCustomers.map(customer => ({ ...customer, projects: projects.filter(project => project.customerId === customer.id), slas: mockCustomerSlas.filter(sla => customer.slaIds.includes(sla.id)) })); },
  getCustomer: (id) => delay({ ...customers.find(customer => customer.id === id), projects: projects.filter(project => project.customerId === id).map(projectView), slas: mockCustomerSlas.filter(sla => customers.find(customer => customer.id === id)?.slaIds.includes(sla.id)) }),
  listProjects: () => Promise.all([fetchPersistedProjects(), fetch('/api/tasks').then(response => response.ok ? response.json() : [])]).then(([saved, databaseTasks]) => {
    if (databaseTasks.length) mockTasks.splice(0, mockTasks.length, ...databaseTasks);
    saved.forEach(project => {
      (project.generatedTasks || []).forEach(task => { if (!taskById(task.id)) mockTasks.push(task); });
      if (!projects.some(item => item.id === project.id)) projects.push({ id: project.id, name: project.name, customerId: project.customerId, packageId: project.packageId, workflowIds: project.workflowIds || [], taskIds: project.taskIds || [], scope: project.scope, milestones: project.milestones || [], slaId: project.slaId, status: project.status, outcomeId: null, learningIds: [] });
    });
    return delay(projects.map(projectView));
  }),
  getProject: (id) => delay(projectView(projects.find(project => project.id === id))),
  listServicePackages: async () => { const packages = await fetchDomain('servicePackages'); const workflows = await fetchDomain('workflows'); return packages.filter(item => item.active).map(item => ({ ...item, workflows: item.workflowIds.map(id => workflows.find(workflow => workflow.id === id)) })); },
  createProject: ({ customerId, packageId, name, scope }) => {
    const customer = customers.find(item => item.id === customerId);
    const servicePackage = servicePackages.find(item => item.id === packageId);
    if (!customer || !servicePackage) return Promise.reject(new Error('Pelanggan dan paket layanan wajib dipilih.'));
    const projectId = nextId('PRJ', projects);
    const projectTasks = [];
    const milestones = [];
    servicePackage.workflowIds.forEach(workflowId => {
      const workflow = workflowTemplates.find(item => item.id === workflowId);
      let predecessor;
      workflow.stages.forEach((stage, index) => {
        const policy = taskPolicy(taskTypeForWorkflow(workflow));
        const owner = ownerFor(workflow.requiredSkills);
        const task = { id: `TSK-${1100 + mockTasks.length}`, task_type: taskTypeForWorkflow(workflow), task_priority: index === 0 ? 'High' : 'Medium', task_complexity: Math.min(8, 3 + index * 2), estimated_task_hours: Math.max(2, Math.round(stage.slaHours / 2)), sla_hours: stage.slaHours || policy.defaultSla, remaining_sla_hours: stage.slaHours || policy.defaultSla, task_queue_age_hours: 0, dependency_count: predecessor ? 1 : 0, dependency_delay_hours: 0, reassignment_count: 0, cross_department_required: workflow.requiredSkills.length > 1, peak_workload_flag: false, owner: { name: owner.name, initials: owner.initials }, department: owner.department, customer: customer.name, deadline: 'Direncanakan sejak proyek dimulai', title: `${stage.name}: ${name}`, responsibility: `${owner.name} bertanggung jawab atas tahap ${stage.name.toLowerCase()}.`, expected_output: stage.gate, parent_customer_sla_id: customer.slaIds[0], workflowId, stageId: stage.id, gate: stage.gate, status: 'Open', dependencies: predecessor ? [{ id: `DEP-${mockTasks.length + 1}`, task_id: predecessor.id, status: 'Pending', owner: predecessor.owner.name }] : [], escalation_history: [], intervention_history: [], activity_history: [{ timestamp: 'Proyek dibuat', action: `Tugas dibuat untuk ${stage.gate}`, user: 'Sistem' }] };
        mockTasks.push(task); projectTasks.push(task.id); predecessor = task; milestones.push({ name: stage.name, status: index === 0 ? 'Ready' : 'Waiting', gate: stage.gate });
      });
    });
    const project = { id: projectId, name: name || `${customer.name} ${servicePackage.name}`, customerId, packageId, workflowIds: servicePackage.workflowIds, taskIds: projectTasks, scope: scope || servicePackage.description, milestones, slaId: customer.slaIds[0], status: 'In progress', outcomeId: null, learningIds: knowledgeItems.filter(item => servicePackage.workflowIds.includes(item.workflowId)).map(item => item.id) };
    projects.push(project);
    return persist('/api/projects', { ...project, generatedTasks: projectTasks.map(taskById).filter(Boolean) })
      .then(async () => {
        await Promise.all(projectTasks.map(taskId => persist('/api/tasks', { ...taskById(taskId), projectId })));
        return delay(projectView(project));
      })
      .catch(error => {
        const projectIndex = projects.findIndex(item => item.id === project.id);
        if (projectIndex >= 0) projects.splice(projectIndex, 1);
        projectTasks.forEach(taskId => {
          const taskIndex = mockTasks.findIndex(task => task.id === taskId);
          if (taskIndex >= 0) mockTasks.splice(taskIndex, 1);
        });
        throw error;
      });
  },
  listWorkflows: async () => { const [workflows, packages, knowledge] = await Promise.all([fetchDomain('workflows'), fetchDomain('servicePackages'), fetchDomain('knowledge')]); return workflows.map(workflow => ({ ...workflow, packages: packages.filter(pkg => pkg.workflowIds.includes(workflow.id)), playbooks: knowledge.filter(item => workflow.linkedPlaybookIds.includes(item.playbookId)) })); },
  listKnowledge: async () => { const items = await fetchDomain('knowledge'); return items.map(item => ({ ...item, sourceProject: projects.find(project => project.id === item.sourceProjectId) })); },
  listPilots: () => delay(pilots.map(pilot => ({ ...pilot, customer: customers.find(c => c.id === pilot.customerId), workflow: workflowTemplates.find(w => w.id === pilot.workflowId), package: servicePackages.find(p => p.id === pilot.packageId) }))),
  listOutcomes: () => delay(outcomes.map(outcome => ({ ...outcome, customer: customers.find(c => c.id === outcome.customerId), project: projects.find(p => p.id === outcome.projectId) }))),
  getOrganization: async () => { const [databaseLeadership, databaseEmployees] = await Promise.all([fetchDomain('leadership'), fetchDomain('employees')]); return { leadership: databaseLeadership, employees: databaseEmployees, divisions: ['Teknologi', 'Implementasi', 'Support', 'Sales', 'Administrasi'].map(department => ({ department, manager: databaseLeadership.find(person => person.level === 'Manager' && person.department === department), employees: databaseEmployees.filter(employee => employee.department === department) })) }; },
  listBlueprints: () => delay(sectorBlueprints.map(blueprint => ({ ...blueprint, package: servicePackages.find(pkg => pkg.id === blueprint.packageId), workflows: blueprint.workflowIds.map(id => workflowTemplates.find(w => w.id === id)), playbooks: knowledgeItems.filter(item => blueprint.playbookIds.includes(item.playbookId)) }))),
  getTaskContext: (taskId) => { const task = taskById(taskId); const customer = customerByName(task?.customer); const project = projects.find(p => p.taskIds.includes(taskId)); return delay({ task, customer, project: project && projectView(project), workflow: project && workflowTemplates.find(w => w.id === project.workflowIds[0]), sla: mockCustomerSlas.find(s => s.id === task?.parent_customer_sla_id), dependencies: task?.dependencies?.map(dep => ({ ...dep, downstreamImpact: dep.status === 'Delayed' ? `${task.title} is blocked and its project SLA is at risk.` : 'No current downstream impact.' })) || [], knowledge: project ? knowledgeItems.filter(item => item.workflowId === project.workflowIds[0]) : [] }); },
  getCapacityRecommendations: (taskId) => { const task = taskById(taskId); return delay(employees.map(employee => ({ ...employee, workloadRatio: workload(employee), activeTasks: mockTasks.filter(t => t.owner?.initials === employee.initials), skillMatch: (task.required_skills || [task.department]).filter(skill => employee.skills.includes(skill)).length, suitable: employee.availability === 'Available' && workload(employee) < 90 })).sort((a, b) => Number(b.suitable) - Number(a.suitable) || b.skillMatch - a.skillMatch || a.workloadRatio - b.workloadRatio)); },
  getMonitoring: async () => { const [tasks, organization, monitoredProjects, workflows] = await Promise.all([fetch('/api/tasks').then(response => response.ok ? response.json() : []), operationsService.getOrganization(), operationsService.listProjects(), operationsService.listWorkflows()]); const taskStates = tasks.map(task => ({ ...task, slaState: calculateTaskStatus(task.remaining_sla_hours, task.sla_hours), blocked: task.dependencies?.some(dep => dep.status !== 'Resolved') })); return { projects: monitoredProjects, workflows: workflows.map(workflow => ({ name: workflow.name, progress: monitoredProjects.filter(project => project.workflowIds.includes(workflow.id)).length ? 50 : 0 })), capacity: organization.employees.map(employee => ({ ...employee, workloadRatio: workload(employee), activeTasks: tasks.filter(task => task.owner?.initials === employee.initials) })), blockedTasks: taskStates.filter(task => task.blocked), bottlenecks: taskStates.filter(task => task.dependencies?.some(dep => dep.status === 'Delayed')), interventions: tasks.flatMap(task => task.intervention_history || []), escalations: tasks.flatMap(task => task.escalation_history || []) }; },
  getSlaRules: () => delay([...slaRules]),
  updateSlaRule: (id, patch) => { const rule = slaRules.find(item => item.id === id); if (!rule) return Promise.reject(new Error('SLA rule not found')); Object.assign(rule, patch); return delay({ ...rule }); },
  getEscalationRules: () => delay([...escalationRules]),
  saveEscalationRule: (rule) => { const existing = rule.id && escalationRules.find(item => item.id === rule.id); if (existing) Object.assign(existing, rule); else escalationRules.push({ ...rule, id: nextId('ESC', escalationRules) }); return delay(rule); },
  decide: ({ riskBand, slaState, dependencyDelayed, workloadRatio, priority, complexity }) => { let action = 'Monitor'; if (slaState === 'OVERDUE') action = 'Immediate Intervention'; else if (riskBand === 'High' && dependencyDelayed) action = 'Escalate Dependency'; else if (riskBand === 'High' && workloadRatio >= 90) action = 'Reassign Resource'; else if (riskBand === 'High' && priority === 'Low' && complexity >= 7) action = 'Adjust Priority'; const matchedEscalation = slaState === 'OVERDUE' ? escalationRules.find(rule => rule.trigger === 'overdue') : dependencyDelayed ? escalationRules.find(rule => rule.trigger === 'dependency') : slaState === 'AT RISK' ? escalationRules.find(rule => rule.trigger === 'at-risk') : null; return { action, advisory: true, escalation: matchedEscalation, reason: `Decision matrix: ${riskBand || 'Unknown'} risk, ${slaState}, dependency ${dependencyDelayed ? 'delayed' : 'clear'}, workload ${workloadRatio || 0}%.`, rules: decisionMatrixRules }; },
  confirmIntervention: ({ taskId, action, reason, actor = 'Budi Santoso', changes = {} }) => { const task = taskById(taskId); if (!task) return Promise.reject(new Error('Task not found')); const record = { id: nextId('INT', task.intervention_history || []), taskId, action, reason, actor, timestamp: new Date().toISOString(), source: 'Manager-confirmed', status: 'Monitoring' }; task.intervention_history = [record, ...(task.intervention_history || [])]; task.activity_history = [{ timestamp: record.timestamp, action: `Intervention: ${action}`, user: actor, reason }, ...(task.activity_history || [])]; const escalation = action.includes('Escalate') || calculateTaskStatus(task.remaining_sla_hours, task.sla_hours) === 'OVERDUE'; if (escalation) task.escalation_history = [{ timestamp: record.timestamp, action: `${action} — escalation activated`, reason, user: actor, status: 'Open' }, ...(task.escalation_history || [])]; Object.assign(task, changes); return persist('/api/interventions', record).then(() => delay({ task, record })); }
};
