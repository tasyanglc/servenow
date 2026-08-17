import 'server-only';
import { mockCustomerSlas, mockTasks } from './mockData';
import { customerFrictions, customers, decisionMatrixRules, employees, escalationRules, knowledgeItems, leadership, outcomes, pilots, projects, sectorBlueprints, servicePackages, slaRules, workflowTemplates } from './operationalData';

const domains = {
  customers,
  employees,
  leadership,
  workflows: workflowTemplates,
  knowledge: knowledgeItems,
  servicePackages,
  slaRules,
  escalationRules,
  customerSlas: mockCustomerSlas,
  pilots,
  outcomes,
  blueprints: sectorBlueprints,
  decisionMatrixRules,
  customerFrictions,
  users: [
    ...leadership.map((person) => ({ id: `USR-${person.id}`, name: person.name, email: `${person.name.toLowerCase().replaceAll(' ', '.')}@servenow.io`, role: person.title.replace(' & Product', ''), title: person.title, initials: person.name.split(' ').map((part) => part[0]).join('').slice(0, 2), department: person.department, status: 'Active' })),
    ...employees.map((person) => ({ id: `USR-${person.id}`, name: person.name, email: `${person.name.toLowerCase().replaceAll(' ', '.')}@servenow.io`, role: `Karyawan ${person.department}`, title: person.department === 'Teknologi' ? 'Software Engineer' : person.department === 'Implementasi' ? 'Implementation Specialist' : person.department === 'Support' ? 'Support Specialist' : person.department === 'Sales' ? 'Sales Executive' : 'Administration Officer', initials: person.initials, department: person.department, status: 'Active' })),
  ],
};

const projectIdForTask = (taskId) => ({ 'TSK-1042': 'PRJ-ACME', 'TSK-1045': 'PRJ-DELTA', 'TSK-1050': 'PRJ-OMEGA' }[taskId] || null);

export async function ensureTaskSeed(db) {
  for (const task of mockTasks) {
    const deadline = /^\d{4}-\d{2}-\d{2}$/.test(task.deadline || '') ? task.deadline : null;
    await db.query(`INSERT INTO tasks (id, project_id, owner_initials, status, deadline, data)
      VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (id) DO NOTHING`, [task.id, projectIdForTask(task.id), task.owner?.initials || null, task.status || 'Open', deadline, JSON.stringify(task)]);
  }
}

export async function ensureProjectSeed(db) {
  for (const project of projects) {
    await db.query(`INSERT INTO projects (id, customer_id, package_id, name, scope, workflow_ids, task_ids, milestones, generated_tasks, sla_id, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      ON CONFLICT (id) DO NOTHING`, [
      project.id, project.customerId, project.packageId, project.name, project.scope || null,
      JSON.stringify(project.workflowIds || []), JSON.stringify(project.taskIds || []), JSON.stringify(project.milestones || []),
      JSON.stringify(project.generatedTasks || []), project.slaId || null, project.status || 'In progress',
    ]);
  }
}

export async function ensureOperationalSeed(db, domain) {
  const records = domains[domain];
  if (!records) throw new Error('Domain data tidak dikenal.');
  for (const record of records) {
    await db.query(`INSERT INTO operational_records (domain, id, data) VALUES ($1,$2,$3) ON CONFLICT (domain, id) DO NOTHING`, [domain, record.id, JSON.stringify(record)]);
  }
}

export const supportedDomains = Object.keys(domains);
