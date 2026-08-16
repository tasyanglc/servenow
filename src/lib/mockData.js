export const mockTasks = [
  {
    id: "TSK-1042",
    task_type: "Implementation",
    task_priority: "High",
    task_complexity: 8,
    estimated_task_hours: 40,
    sla_hours: 48,
    remaining_sla_hours: 28,
    task_queue_age_hours: 4,
    dependency_count: 2,
    dependency_delay_hours: 0,
    reassignment_count: 0,
    cross_department_required: true,
    peak_workload_flag: false,
    owner: { name: "Andi Pratama", initials: "AP" },
    department: "Implementation",
    customer: "Acme Corp",
    deadline: "2025-05-22",
    title: "Deploy CS Module for Acme Corp",
    responsibility: "Lead implementation and testing of the CS Module.",
    expected_output: "Fully functional CS module deployed to production environment.",
    parent_customer_sla_id: "CSLA-101",
    dependencies: [
      { id: "DEP-1", task_id: "TSK-1040", status: "Resolved", owner: "DevOps" },
      { id: "DEP-2", task_id: "TSK-1041", status: "Pending", owner: "Security" }
    ],
    escalation_history: [],
    activity_history: [
      { timestamp: "2025-05-18T09:00:00Z", action: "Task Created", user: "System" },
      { timestamp: "2025-05-18T09:15:00Z", action: "Assigned to Andi Pratama", user: "Budi Santoso" }
    ]
  },
  {
    id: "TSK-1045",
    task_type: "Support",
    task_priority: "Critical",
    task_complexity: 5,
    estimated_task_hours: 4,
    sla_hours: 8,
    remaining_sla_hours: 1.5,
    task_queue_age_hours: 2,
    dependency_count: 1,
    dependency_delay_hours: 2,
    reassignment_count: 1,
    cross_department_required: false,
    peak_workload_flag: true,
    owner: { name: "Maya Lestari", initials: "ML" },
    department: "Support",
    customer: "Delta Co",
    deadline: "2025-05-20",
    title: "Churn Prevention - Delta Co",
    responsibility: "Address critical bugs causing customer dissatisfaction.",
    expected_output: "Root cause identified and patch deployed.",
    parent_customer_sla_id: "CSLA-102",
    dependencies: [
      { id: "DEP-3", task_id: "TSK-1044", status: "Delayed", owner: "Engineering" }
    ],
    escalation_history: [
      { timestamp: "2025-05-19T14:00:00Z", action: "Escalated to Engineering", reason: "Blocked by backend bug", user: "Maya Lestari" }
    ],
    activity_history: [
      { timestamp: "2025-05-19T10:00:00Z", action: "Task Created", user: "Sarah Lee" },
      { timestamp: "2025-05-19T10:30:00Z", action: "Assigned to Rian Pratama", user: "System" },
      { timestamp: "2025-05-19T13:00:00Z", action: "Reassigned to Maya Lestari", user: "Budi Santoso" }
    ]
  },
  {
    id: "TSK-1050",
    task_type: "Technical Issue",
    task_priority: "High",
    task_complexity: 7,
    estimated_task_hours: 12,
    sla_hours: 24,
    remaining_sla_hours: -2.25,
    task_queue_age_hours: 26,
    dependency_count: 3,
    dependency_delay_hours: 8,
    reassignment_count: 2,
    cross_department_required: true,
    peak_workload_flag: true,
    owner: { name: "Budi Santoso", initials: "BS" },
    department: "Operations",
    customer: "Omega Inc",
    deadline: "2025-05-19",
    title: "API Response Timeout - Omega Inc",
    responsibility: "Investigate and resolve API timeouts affecting Omega's integration.",
    expected_output: "API response times restored to under 200ms.",
    parent_customer_sla_id: "CSLA-103",
    dependencies: [
      { id: "DEP-4", task_id: "TSK-1048", status: "Resolved", owner: "DBA" },
      { id: "DEP-5", task_id: "TSK-1049", status: "Pending", owner: "Cloud Infra" }
    ],
    escalation_history: [
      { timestamp: "2025-05-19T16:00:00Z", action: "SLA Breached - Auto Escalated to Director", reason: "SLA timer expired", user: "System" }
    ],
    activity_history: [
      { timestamp: "2025-05-18T08:00:00Z", action: "Task Created", user: "System" },
      { timestamp: "2025-05-19T16:00:00Z", action: "SLA Breached", user: "System" }
    ]
  },
  {
    id: "TSK-1051",
    task_type: "Data Ops",
    task_priority: "Medium",
    task_complexity: 3,
    estimated_task_hours: 16,
    sla_hours: 72,
    remaining_sla_hours: 60,
    task_queue_age_hours: 1,
    dependency_count: 0,
    dependency_delay_hours: 0,
    reassignment_count: 0,
    cross_department_required: false,
    peak_workload_flag: false,
    owner: { name: "Rian Pratama", initials: "RP" },
    department: "Operations",
    customer: "Internal",
    deadline: "2025-05-25",
    title: "Monthly Usage Report - May",
    responsibility: "Compile and distribute the monthly platform usage report.",
    expected_output: "PDF and CSV report sent to all department heads.",
    dependencies: [],
    escalation_history: [],
    activity_history: [
      { timestamp: "2025-05-20T08:00:00Z", action: "Task Created", user: "System" },
      { timestamp: "2025-05-20T08:05:00Z", action: "Assigned to Rian Pratama", user: "Budi Santoso" }
    ]
  },
  {
    id: "TSK-1055",
    task_type: "Configuration",
    task_priority: "Low",
    task_complexity: 2,
    estimated_task_hours: 2,
    sla_hours: 16,
    remaining_sla_hours: 14.5,
    task_queue_age_hours: 1.5,
    dependency_count: 0,
    dependency_delay_hours: 0,
    reassignment_count: 0,
    cross_department_required: false,
    peak_workload_flag: false,
    owner: { name: "Siti Aisyah", initials: "SA" },
    department: "Support",
    customer: "Beta Agency",
    deadline: "2025-05-23",
    title: "Resolve Login Issue - Beta Agency",
    responsibility: "Reset user credentials and verify SSO config.",
    expected_output: "User successfully logged in.",
    dependencies: [],
    escalation_history: [],
    activity_history: [
      { timestamp: "2025-05-20T09:00:00Z", action: "Task Created", user: "System" }
    ]
  }
];

export const mockCustomerSlas = [
  {
    id: "CSLA-101",
    customer: "Acme Corp",
    title: "Onboarding & Implementation",
    total_sla_hours: 120,
    remaining_sla_hours: 60,
    status: "ON TRACK",
    internal_tasks: [
      { id: "TSK-1040", title: "Infrastructure Setup", owner: "DevOps", duration_hours: 16, order: 1 },
      { id: "TSK-1041", title: "Security Review", owner: "Security", duration_hours: 24, order: 2 },
      { id: "TSK-1042", title: "Deploy CS Module", owner: "Andi Pratama", duration_hours: 40, order: 3 }
    ]
  },
  {
    id: "CSLA-102",
    customer: "Delta Co",
    title: "Critical Issue Resolution",
    total_sla_hours: 24,
    remaining_sla_hours: 4,
    status: "AT RISK",
    internal_tasks: [
      { id: "TSK-1043", title: "Initial Triage", owner: "Support L1", duration_hours: 2, order: 1 },
      { id: "TSK-1044", title: "Root Cause Analysis", owner: "Engineering", duration_hours: 8, order: 2 },
      { id: "TSK-1045", title: "Churn Prevention Patch", owner: "Maya Lestari", duration_hours: 4, order: 3 }
    ]
  },
  {
    id: "CSLA-103",
    customer: "Omega Inc",
    title: "Outage Resolution",
    total_sla_hours: 12,
    remaining_sla_hours: -1,
    status: "OVERDUE",
    internal_tasks: [
      { id: "TSK-1048", title: "Database Restart", owner: "DBA", duration_hours: 2, order: 1 },
      { id: "TSK-1049", title: "Cluster Provisioning", owner: "Cloud Infra", duration_hours: 4, order: 2 },
      { id: "TSK-1050", title: "API Response Timeout Fix", owner: "Budi Santoso", duration_hours: 12, order: 3 }
    ]
  }
];
