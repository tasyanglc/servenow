// Mock repository. Replace these exports with authenticated API repositories when persistence is available.
export const workflowTemplates = [
  { id: 'WF-ONBOARD', name: 'Customer Onboarding', description: 'Standard implementation journey from discovery to go-live.', standardSlaHours: 120, requiredSkills: ['Implementation', 'Security'], expectedOutputs: ['Live workspace', 'Acceptance sign-off'], linkedPlaybookIds: ['PB-ONBOARD'], stages: [{ id: 'STG-DISC', name: 'Discovery', gate: 'Scope approved', slaHours: 16 }, { id: 'STG-SETUP', name: 'Setup', gate: 'Security cleared', slaHours: 32 }, { id: 'STG-GO', name: 'Go-live', gate: 'Customer acceptance', slaHours: 72 }] },
  { id: 'WF-INCIDENT', name: 'Critical Incident Resolution', description: 'Cross-functional response for customer-impacting incidents.', standardSlaHours: 24, requiredSkills: ['Support', 'Engineering'], expectedOutputs: ['Resolution', 'Customer update'], linkedPlaybookIds: ['PB-INCIDENT'], stages: [{ id: 'STG-TRIAGE', name: 'Triage', gate: 'Severity confirmed', slaHours: 2 }, { id: 'STG-RCA', name: 'Root Cause', gate: 'Fix approved', slaHours: 8 }, { id: 'STG-RESOLVE', name: 'Resolution', gate: 'Customer confirmed', slaHours: 14 }] },
  { id: 'WF-REPORT', name: 'Operational Reporting', description: 'Monthly operational report preparation and review.', standardSlaHours: 72, requiredSkills: ['Data Operations'], expectedOutputs: ['Reviewed report'], linkedPlaybookIds: ['PB-REPORT'], stages: [{ id: 'STG-PREP', name: 'Prepare', gate: 'Data quality checked', slaHours: 40 }, { id: 'STG-REVIEW', name: 'Review', gate: 'Published', slaHours: 32 }] }
];

export const servicePackages = [
  { id: 'PKG-ENTERPRISE', name: 'Enterprise Launch', description: 'Implementation and adoption for enterprise customers.', workflowIds: ['WF-ONBOARD'], slaExpectation: '120 hours to accepted go-live', targetSector: 'SaaS', active: true },
  { id: 'PKG-CARE', name: 'Priority Care', description: 'Priority incident response and customer communications.', workflowIds: ['WF-INCIDENT'], slaExpectation: '24-hour critical response', targetSector: 'Technology', active: true },
  { id: 'PKG-OPS', name: 'Managed Operations', description: 'Recurring reporting and operational reviews.', workflowIds: ['WF-REPORT'], slaExpectation: '72-hour reporting cycle', targetSector: 'Professional Services', active: true }
];

export const sectorBlueprints = [
  { id: 'BP-SAAS', sector: 'SaaS', packageId: 'PKG-ENTERPRISE', workflowIds: ['WF-ONBOARD', 'WF-INCIDENT'], slaDefaults: '120h onboarding / 24h critical incident', gates: ['Security cleared', 'Customer acceptance'], playbookIds: ['PB-ONBOARD', 'PB-INCIDENT'] },
  { id: 'BP-TECH', sector: 'Technology', packageId: 'PKG-CARE', workflowIds: ['WF-INCIDENT'], slaDefaults: '24h critical incident', gates: ['Severity confirmed', 'Customer confirmed'], playbookIds: ['PB-INCIDENT'] }
];

export const customers = [
  { id: 'CUS-ACME', name: 'Acme Corp', sector: 'SaaS', tier: 'Enterprise', contract: 'CTR-ACME-2026', packageId: 'PKG-ENTERPRISE', slaIds: ['CSLA-101'] },
  { id: 'CUS-DELTA', name: 'Delta Co', sector: 'Technology', tier: 'Priority', contract: 'CTR-DELTA-2026', packageId: 'PKG-CARE', slaIds: ['CSLA-102'] },
  { id: 'CUS-OMEGA', name: 'Omega Inc', sector: 'Technology', tier: 'Enterprise', contract: 'CTR-OMEGA-2026', packageId: 'PKG-CARE', slaIds: ['CSLA-103'] }
];

export const projects = [
  { id: 'PRJ-ACME', name: 'Acme CS Module Launch', customerId: 'CUS-ACME', packageId: 'PKG-ENTERPRISE', workflowIds: ['WF-ONBOARD'], taskIds: ['TSK-1042'], scope: 'Implement and deploy CS module.', milestones: [{ name: 'Discovery', status: 'Complete' }, { name: 'Go-live', status: 'In progress' }], slaId: 'CSLA-101', status: 'In progress', outcomeId: null, learningIds: ['KN-001'] },
  { id: 'PRJ-DELTA', name: 'Delta Critical Incident', customerId: 'CUS-DELTA', packageId: 'PKG-CARE', workflowIds: ['WF-INCIDENT'], taskIds: ['TSK-1045'], scope: 'Restore customer confidence after an incident.', milestones: [{ name: 'Triage', status: 'Complete' }, { name: 'Resolution', status: 'At risk' }], slaId: 'CSLA-102', status: 'At risk', outcomeId: null, learningIds: ['KN-002'] },
  { id: 'PRJ-OMEGA', name: 'Omega API Recovery', customerId: 'CUS-OMEGA', packageId: 'PKG-CARE', workflowIds: ['WF-INCIDENT'], taskIds: ['TSK-1050'], scope: 'Recover API performance.', milestones: [{ name: 'Root cause', status: 'Complete' }, { name: 'Resolution', status: 'Overdue' }], slaId: 'CSLA-103', status: 'Overdue', outcomeId: 'OUT-OMEGA', learningIds: ['KN-003'] }
];

export const employees = [
  { id: 'EMP-ANDI', name: 'Andi Pratama', initials: 'AP', department: 'Implementation', skills: ['Implementation', 'Security'], experienceYears: 5, availability: 'Available', capacityHours: 40, allocatedHours: 28 },
  { id: 'EMP-MAYA', name: 'Maya Lestari', initials: 'ML', department: 'Support', skills: ['Support', 'Incident Management'], experienceYears: 6, availability: 'Available', capacityHours: 40, allocatedHours: 36 },
  { id: 'EMP-RIAN', name: 'Rian Pratama', initials: 'RP', department: 'Operations', skills: ['Data Operations', 'Reporting'], experienceYears: 3, availability: 'Available', capacityHours: 40, allocatedHours: 18 },
  { id: 'EMP-SITI', name: 'Siti Aisyah', initials: 'SA', department: 'Support', skills: ['Support', 'Configuration'], experienceYears: 2, availability: 'Limited', capacityHours: 32, allocatedHours: 14 }
];

export const knowledgeItems = [
  { id: 'KN-001', title: 'Security review handoff checklist', type: 'Playbook', description: 'Use a named owner and decision deadline before the security gate.', sourceProjectId: 'PRJ-ACME', tags: ['handoff', 'security'], sector: 'SaaS', workflowId: 'WF-ONBOARD', gate: 'Security cleared', playbookId: 'PB-ONBOARD', lesson: 'Explicit owner avoids setup delay.', status: 'Approved' },
  { id: 'KN-002', title: 'Critical incident customer communications', type: 'Playbook', description: 'Send cadence updates during critical incident response.', sourceProjectId: 'PRJ-DELTA', tags: ['incident', 'communication'], sector: 'Technology', workflowId: 'WF-INCIDENT', gate: 'Severity confirmed', playbookId: 'PB-INCIDENT', lesson: 'Customer updates reduce escalation pressure.', status: 'Approved' },
  { id: 'KN-003', title: 'API timeout dependency pattern', type: 'Lesson Learned', description: 'Cloud capacity delays can turn an API incident overdue.', sourceProjectId: 'PRJ-OMEGA', tags: ['dependency', 'capacity'], sector: 'Technology', workflowId: 'WF-INCIDENT', gate: 'Fix approved', playbookId: null, lesson: 'Escalate cloud dependencies at first delayed status.', status: 'Published' }
];

export const pilots = [{ id: 'PIL-001', customerId: 'CUS-ACME', workflowId: 'WF-ONBOARD', packageId: 'PKG-ENTERPRISE', status: 'Active', implementationProgress: 68, slaResult: 'Tracking', friction: 'Security handoff needs a named approver.', feedback: 'Customer wants a shared go-live checklist.', improvementOpportunity: 'Add security gate owner field.' }];
export const outcomes = [{ id: 'OUT-OMEGA', customerId: 'CUS-OMEGA', projectId: 'PRJ-OMEGA', slaAchieved: false, deliveryCompleted: false, resolutionStatus: 'Resolved after breach', notes: 'API restored; post-incident review scheduled.', completionDate: '2026-08-15' }];
export const decisionMatrixRules = [{ id: 'DM-OVERDUE', when: 'overdue', action: 'Immediate Intervention' }, { id: 'DM-DEP', when: 'high risk + delayed dependency', action: 'Escalate Dependency' }, { id: 'DM-CAP', when: 'high risk + overloaded owner', action: 'Reassign Resource' }, { id: 'DM-MON', when: 'medium risk + capacity', action: 'Monitor' }];
