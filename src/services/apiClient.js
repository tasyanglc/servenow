import { mockTasks, mockCustomerSlas } from '../lib/mockData';
import { calculateTaskStatus } from '../lib/taskUtils';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
      // Map frontend task object to backend TaskInput schema
      const payload = {
        task_type: task.task_type || "Support",
        task_priority: task.task_priority || "Medium",
        customer_tier: "Standard", // Defaulting as it might not be in basic task info
        employee_department: "Support", // Defaulting
        employee_experience_years: 3.0,
        employee_historical_sla_rate: 0.95,
        current_open_tasks: 5,
        current_workload_ratio: 0.8,
        task_complexity: task.task_complexity || 5,
        estimated_task_hours: task.estimated_task_hours || 10,
        sla_hours: task.sla_hours || 24,
        remaining_sla_hours: task.remaining_sla_hours || 12,
        dependency_count: task.dependency_count || 0,
        dependency_delay_hours: task.dependency_delay_hours || 0,
        reassignment_count: task.reassignment_count || 0,
        similar_task_avg_hours: 8.5,
        employee_avg_completion_hours: 8.0,
        task_queue_age_hours: task.task_queue_age_hours || 2,
        customer_escalation_history: 0,
        cross_department_required: task.cross_department_required ? 1.0 : 0.0,
        peak_workload_flag: task.peak_workload_flag ? 1.0 : 0.0,
        estimated_vs_sla_ratio: (task.estimated_task_hours || 10) / (task.sla_hours || 24),
        workload_pressure_score: 0.8 * 5, // workload_ratio * open_tasks
        dependency_pressure_score: (task.dependency_count || 0) * (task.dependency_delay_hours || 0),
        employee_speed_ratio: 8.0 / 8.5, // avg_completion / similar_avg
        sla_buffer_ratio: (task.remaining_sla_hours || 12) / (task.sla_hours || 24),
        queue_pressure: (task.task_queue_age_hours || 2) * (task.task_priority === "Critical" ? 2 : 1),
        employee_historical_sla_rate_missing: 0,
        similar_task_avg_hours_missing: 0
      };

      const response = await fetch(`${BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO (Backend Auth): 
          // 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
          // The backend FastAPI MUST validate this token, extract the user's role, 
          // and reject the request (403) if an Employee tries to call an endpoint meant for a Manager.
        },
        body: JSON.stringify(payload),
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
  }
};
