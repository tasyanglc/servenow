import { mockTasks, mockCustomerSlas } from '../lib/mockData';
import { calculateTaskStatus } from '../lib/taskUtils';

// In-Memory Sales Database
let mockDeals = [
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

// In-Memory Customer Zero Frictions Database
let mockFrictions = [
  {
    id: "FRIC-201",
    friction: "Downstream Support engineers are manually checking SLA remaining timers in Excel.",
    feedback: "Timers need to be visual on every task card.",
    improvement: "Implemented SlaCountdown component directly inside TaskCard.",
    status: "Completed"
  },
  {
    id: "FRIC-202",
    friction: "Cross-department tasks bounce between teams without a clear chronological handover history.",
    feedback: "Add Activity timeline in task details page.",
    improvement: "Built ActivityHistory timeline component mapped from task database.",
    status: "Completed"
  },
  {
    id: "FRIC-203",
    friction: "Managers cannot easily spot which upstream task is blocking a Customer SLA delivery.",
    feedback: "Add a master Customer SLA timeline tracker in the UI.",
    improvement: "Create CustomerSlaProgress component sequencing all sibling tasks.",
    status: "Product Improvement"
  }
];

export const apiClient = {
  /**
   * Simulates fetching tasks from a backend database.
   * Returns a promise to enforce asynchronous data flow architecture.
   */
  fetchTasks: async (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let tasks = [...mockTasks];
        if (filters.ownerInitials) {
          tasks = tasks.filter(t => t.owner?.initials === filters.ownerInitials);
        }
        if (filters.department) {
          tasks = tasks.filter(t => t.department === filters.department);
        }
        resolve(tasks);
      }, 500); // simulate network latency
    });
  },

  /**
   * Fetch a single task by ID
   */
  getTaskById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const task = mockTasks.find(t => t.id === id);
        if (task) resolve(task);
        else reject(new Error("Task not found"));
      }, 300);
    });
  },

  /**
   * Fetch a Customer SLA context, including full task details for its sequence
   */
  getCustomerSlaContext: async (taskId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const task = mockTasks.find(t => t.id === taskId);
        if (!task || !task.parent_customer_sla_id) {
          return resolve(null);
        }
        
        // This requires importing mockCustomerSlas from mockData
        // Due to the mock nature, we'll import it at the top or dynamically
        const customerSla = mockCustomerSlas.find(s => s.id === task.parent_customer_sla_id);
        resolve(customerSla || null);
      }, 300);
    });
  },

  /**
   * Update a task's fields (simulated)
   */
  updateTask: async (id, updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app this makes a PUT/PATCH to backend
        console.log(`Task ${id} updated with`, updates);
        resolve({ success: true });
      }, 400);
    });
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
    return new Promise((resolve) => {
      setTimeout(() => {
        let overdueCount = 0;
        let atRiskCount = 0;
        let blockedCount = 0;
        const exceptions = [];
        const escalations = [];
        const workload = {};
        
        let completedSla = 0;
        let totalSlaMeasured = 0;

        mockTasks.forEach(task => {
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

        resolve({
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
        });
      }, 400);
    });
  },

  /**
   * Fetch company-wide aggregate metrics for the Director's Executive Overview
   */
  getExecutiveOverviewData: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
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

        mockTasks.forEach(task => {
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

        resolve({
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
        });
      }, 400);
    });
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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          slaAchievement: 94,
          tasksManaged: 248,
          atRiskResolutionSpeedHours: 1.2,
          directorEscalations: 2,
          efficiencyGain: "+14%",
          frictions: [...mockFrictions]
        });
      }, 300);
    });
  },

  /**
   * Capture a new internal operational friction point
   */
  submitFriction: async (frictionText) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFriction = {
          id: `FRIC-${200 + mockFrictions.length + 1}`,
          friction: frictionText,
          feedback: "Awaiting staff review",
          improvement: "Under Validation",
          status: "Validation"
        };
        mockFrictions.unshift(newFriction);
        resolve(newFriction);
      }, 400);
    });
  }
};
