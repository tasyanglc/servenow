import { calculateTaskStatus } from '../lib/taskUtils';

// Legacy sales examples retained only as development fixtures; the UI reads /api/deals.
const legacyDeals = [
  {
    id: "DEAL-101",
    account: "Acme Corporation",
    owner: "Rian Pratama",
    stage: "Proposal",
    value: 500000,
    probability: 0.90,
    expectedRevenue: 450000,
    nextAction: "Deliver SLA terms document",
    nextActionDeadline: "2026-08-20",
    lastActivity: "Call with CTO regarding system trust",
    founderInvolvement: false,
    progressiveOwnership: "Lead"
  },
  {
    id: "DEAL-102",
    account: "Delta Co",
    owner: "Andi Pratama",
    stage: "Negotiation",
    value: 340000,
    probability: 0.70,
    expectedRevenue: 238000,
    nextAction: "Founder join co-lead meeting",
    nextActionDeadline: "2026-08-18",
    lastActivity: "Email proposal confirmation",
    founderInvolvement: true,
    progressiveOwnership: "Co-lead"
  },
  {
    id: "DEAL-103",
    account: "Omega Inc",
    owner: "Siti Aisyah",
    stage: "Demo",
    value: 400000,
    probability: 0.50,
    expectedRevenue: 200000,
    nextAction: "Prepare CS Module sandbox demo",
    nextActionDeadline: "2026-08-22",
    lastActivity: "First discovery call completed",
    founderInvolvement: true,
    progressiveOwnership: "Contribute"
  },
  {
    id: "DEAL-104",
    account: "GigaTech Solutions",
    owner: "Budi Santoso",
    stage: "Lead",
    value: 150000,
    probability: 0.10,
    expectedRevenue: 15000,
    nextAction: "Qualify lead fit",
    nextActionDeadline: "2026-08-25",
    lastActivity: "Inbound contact form submitted",
    founderInvolvement: false,
    progressiveOwnership: "Observe"
  }
];

export const apiClient = {
  /**
   * Simulates fetching tasks from a backend database.
   * Returns a promise to enforce asynchronous data flow architecture.
   */
  fetchTasks: async (filters = {}) => {
    const search = new URLSearchParams();
    if (filters.ownerInitials) search.set('ownerInitials', filters.ownerInitials);
    const response = await fetch(`/api/tasks${search.size ? `?${search}` : ''}`);
    if (!response.ok) throw new Error('Tugas tidak dapat dimuat dari database.');
    let tasks = await response.json();
    if (filters.department) tasks = tasks.filter(task => task.department === filters.department);
    return tasks;
  },

  /**
   * Fetch a single task by ID
   */
  getTaskById: async (id) => {
    const response = await fetch(`/api/tasks/${id}`);
    if (!response.ok) throw new Error('Task not found');
    return response.json();
  },

  /**
   * Fetch a Customer SLA context, including full task details for its sequence
   */
  getCustomerSlaContext: async (taskId) => {
    const [task, tasks] = await Promise.all([apiClient.getTaskById(taskId), apiClient.fetchTasks()]);
    if (!task.parent_customer_sla_id) return null;
    const internalTasks = tasks.filter(item => item.parent_customer_sla_id === task.parent_customer_sla_id).map(item => ({ id: item.id, title: item.title, owner: item.owner?.name || 'Unassigned', duration_hours: item.estimated_task_hours || 0 }));
    return { id: task.parent_customer_sla_id, title: 'Customer delivery commitment', customer: task.customer, total_sla_hours: task.sla_hours, remaining_sla_hours: task.remaining_sla_hours, internal_tasks: internalTasks };
  },

  /**
   * Update a task's fields (simulated)
   */
  updateTask: async (id, updates) => {
    const response = await fetch(`/api/tasks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    if (!response.ok) throw new Error('Task tidak dapat diperbarui.');
    return response.json();
  },

  /**
   * Escalate a task (simulated)
   */
  escalateTask: async (id, reason) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Task ${id} escalated for reason:`, reason);
        resolve({ success: true });
      }, 400);
    });
  },

  /**
   * Sends a task object to the ML Backend API to get the Risk Prediction
   * including probability, risk band, root causes, and recommended action.
   */
  predictTaskRisk: async (task) => {
    try {
      const response = await fetch('/api/risk-predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to predict task risk:", error);
      // Fallback response for UI resilience if backend is down
      return {
        sla_breach_probability: null,
        risk_band: "Unknown (API Offline)",
        root_causes: [],
        recommended_action: "Check Backend Connection",
        error: error.message
      };
    }
  },

  /**
   * Fetch aggregated data for the Manager Dashboard
   */
  getTeamDashboardData: async () => {
        const tasks = await apiClient.fetchTasks();
        let overdueCount = 0;
        let atRiskCount = 0;
        let blockedCount = 0;
        const exceptions = [];
        const escalations = [];
        const workload = {};
        
        let completedSla = 0;
        let totalSlaMeasured = 0;

        tasks.forEach(task => {
          const status = calculateTaskStatus(task.remaining_sla_hours, task.sla_hours);
          const isBlocked = task.dependencies && task.dependencies.some(d => d.status !== 'Resolved');
          
          if (status === 'OVERDUE') overdueCount++;
          if (status === 'AT RISK') atRiskCount++;
          if (isBlocked) blockedCount++;
          
          if (status === 'OVERDUE' || status === 'AT RISK' || isBlocked) {
            exceptions.push({ ...task, computedStatus: status, isBlocked });
          }
          
          if (status === 'ON TRACK' || task.status === 'Resolved') {
            completedSla++;
          }
          totalSlaMeasured++;

          const ownerName = task.owner?.name || 'Unassigned';
          if (!workload[ownerName]) {
            workload[ownerName] = { name: ownerName, initials: task.owner?.initials || '??', count: 0 };
          }
          workload[ownerName].count++;

          if (task.escalation_history && task.escalation_history.length > 0) {
            task.escalation_history.forEach(esc => {
              escalations.push({
                taskId: task.id,
                taskTitle: task.title,
                ...esc
              });
            });
          }
        });

        escalations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Calculate workload imbalances (owners with more than 1 task)
        const workloadImbalances = Object.values(workload).filter(w => w.count > 1).length;

        // Determine dominant root cause from exceptions
        const causeCounts = {};
        exceptions.forEach(task => {
          let cause = "Queue Backlog";
          if (task.isBlocked) {
            cause = "Dependency Delay";
          } else if (task.owner && workload[task.owner.name]?.count > 1) {
            cause = "Workload Pressure";
          } else if (task.estimated_task_hours > 20) {
            cause = "Task Complexity";
          }
          causeCounts[cause] = (causeCounts[cause] || 0) + 1;
        });

        let dominantRootCause = "Dependency Delay"; // Default fallback
        let maxCauseCount = 0;
        Object.entries(causeCounts).forEach(([cause, count]) => {
          if (count > maxCauseCount) {
            maxCauseCount = count;
            dominantRootCause = cause;
          }
        });

        // Recommended Management Focus based on dominant cause
        const focusMap = {
          "Dependency Delay": "Review cross-department dependencies and expedite blocking items.",
          "Workload Pressure": "Rebalance active task assignments to offload overloaded team members.",
          "Task Complexity": "Conduct technical reviews and assign senior co-owners to complex tasks.",
          "Queue Backlog": "Prioritize inbox zero and expedite task triage routines."
        };
        const recommendedFocus = focusMap[dominantRootCause] || "Conduct operational review.";

        return {
          kpis: {
            slaAchievement: Math.round((completedSla / totalSlaMeasured) * 100) || 100,
            overdue: overdueCount,
            atRisk: atRiskCount,
            blocked: blockedCount,
            workloadImbalances
          },
          weeklySummary: {
            overdue: overdueCount,
            atRisk: atRiskCount,
            blocked: blockedCount,
            workloadImbalances,
            dominantRootCause,
            recommendedFocus
          },
          exceptions: exceptions.sort((a, b) => a.remaining_sla_hours - b.remaining_sla_hours),
          workload: Object.values(workload).sort((a, b) => a.name.localeCompare(b.name)),
          escalations: escalations.slice(0, 5)
        };
  },

  /**
   * Fetch company-wide aggregate metrics for the Director's Executive Overview
   */
  getExecutiveOverviewData: async () => {
        const tasks = await apiClient.fetchTasks();
        let overdueCount = 0;
        let atRiskCount = 0;
        let blockedCount = 0;
        let totalOpen = 0;
        let directorInvolvedCount = 0;
        
        const criticalExceptions = [];
        const departments = {
          "Support": { total: 0, onTrack: 0 },
          "Implementation": { total: 0, onTrack: 0 },
          "Data Ops": { total: 0, onTrack: 0 }
        };

        tasks.forEach(task => {
          const status = calculateTaskStatus(task.remaining_sla_hours, task.sla_hours);
          const isBlocked = task.dependencies && task.dependencies.some(d => d.status !== 'Resolved');
          
          if (status === 'OVERDUE') overdueCount++;
          if (status === 'AT RISK') atRiskCount++;
          if (isBlocked) blockedCount++;
          totalOpen++;

          // Check if Director is involved (either task owner is Director or it has an escalation involving Director)
          const hasDirectorEscalation = task.escalation_history && task.escalation_history.some(e => e.action.includes("Director") || e.user === "Director");
          if (task.owner?.name === "Director" || hasDirectorEscalation) {
            directorInvolvedCount++;
          }

          // Department metrics
          const dept = task.department;
          if (departments[dept]) {
            departments[dept].total++;
            if (status === 'ON TRACK' || task.status === 'Resolved') {
              departments[dept].onTrack++;
            }
          }

          // Critical operational exceptions
          if (task.task_priority === "Critical" && (status === 'OVERDUE' || status === 'AT RISK' || isBlocked)) {
            criticalExceptions.push({
              id: task.id,
              title: task.title,
              customer: task.customer,
              status,
              owner: task.owner?.name || "Unassigned"
            });
          }
        });

        const deptSummary = Object.entries(departments).map(([name, stats]) => ({
          name,
          slaAchievement: stats.total > 0 ? Math.round((stats.onTrack / stats.total) * 100) : 100,
          openTasks: stats.total
        }));

        const totalEscalated = overdueCount + atRiskCount;
        const directorDependencyRate = totalOpen > 0 ? Math.round((directorInvolvedCount / totalOpen) * 100) : 0;

        return {
          slaAchievement: 88, // Overall SLA target
          weeklyExceptions: overdueCount + atRiskCount,
          pipelineValue: "$1,240,000",
          directorDependency: `${directorDependencyRate}%`,
          deptSummary,
          criticalExceptions: criticalExceptions.slice(0, 5),
          salesSummary: [
            { id: "deal-1", customer: "Acme Corp", value: "$500,000", probability: "90%", stage: "Proposal" },
            { id: "deal-2", customer: "Delta Co", value: "$340,000", probability: "70%", stage: "Negotiation" },
            { id: "deal-3", customer: "Omega Inc", value: "$400,000", probability: "50%", stage: "Discovery" }
          ],
          customerZero: {
            activeUsers: 48,
            nps: 9,
            healthScore: "92%"
          }
        };
  },

  /**
   * Fetch active deals for sales pipeline
   */
  fetchDeals: async () => {
    const response = await fetch('/api/deals');
    if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.error || 'Opportunity tidak dapat dimuat.'); }
    return response.json();
  },

  /**
   * Update deal stage, next action, etc.
   */
  updateDeal: async (dealId, updates) => {
    const response = await fetch(`/api/deals/${dealId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.error || 'Opportunity tidak dapat diperbarui.'); }
    return response.json();
  },

  getDealById: async (dealId) => {
    const response = await fetch(`/api/deals/${dealId}`);
    if (!response.ok) throw new Error('Opportunity tidak ditemukan.');
    return response.json();
  },

  createDeal: async (deal) => {
    const response = await fetch('/api/deals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(deal) });
    if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.error || 'Opportunity tidak dapat dibuat.'); }
    return response.json();
  },

  /**
   * Fetch Customer Zero execution stats & friction feed
   */
  fetchCustomerZeroData: async () => {
    const [tasks, frictions] = await Promise.all([apiClient.fetchTasks(), fetch('/api/operational/customerFrictions').then(response => response.ok ? response.json() : [])]);
    const historical = tasks.filter(task => task.source === 'historical-csv');
    const achieved = historical.filter(task => task.historical_actual_breached === false).length;
    const atRisk = tasks.filter(task => calculateTaskStatus(task.remaining_sla_hours, task.sla_hours) !== 'ON TRACK');
    return { slaAchievement: Math.round(achieved / Math.max(historical.length, 1) * 100), tasksManaged: tasks.length, atRiskResolutionSpeedHours: atRisk.length ? Math.round(atRisk.reduce((sum, task) => sum + Math.max(0, Number(task.remaining_sla_hours) || 0), 0) / atRisk.length * 10) / 10 : 0, directorEscalations: tasks.filter(task => (task.escalation_history || []).length).length, efficiencyGain: 'Live data', frictions };
  },

  /**
   * Capture a new internal operational friction point
   */
  submitFriction: async (frictionText) => {
    const newFriction = { id: `FRIC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, friction: frictionText, feedback: 'Menunggu tinjauan staf', improvement: 'Dalam validasi', status: 'Validation' };
    const response = await fetch('/api/operational/customerFrictions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newFriction) });
    if (!response.ok) throw new Error('Masukan Customer Zero tidak dapat disimpan.');
    return response.json();
  }
};
