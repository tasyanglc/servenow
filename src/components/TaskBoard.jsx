import React from 'react';
import TaskCard from './TaskCard';
import { calculateTaskStatus, statusLabel } from '../lib/taskUtils';

export default function TaskBoard({ tasks }) {
  // Group tasks strictly by SLA status
  const columns = {
    "ON TRACK": tasks.filter(t => calculateTaskStatus(t.remaining_sla_hours, t.sla_hours) === "ON TRACK"),
    "AT RISK": tasks.filter(t => calculateTaskStatus(t.remaining_sla_hours, t.sla_hours) === "AT RISK"),
    "OVERDUE": tasks.filter(t => calculateTaskStatus(t.remaining_sla_hours, t.sla_hours) === "OVERDUE")
  };

  const columnConfig = {
    "ON TRACK": { border: "border-emerald-200", bg: "bg-emerald-50/50", text: "text-emerald-700", countBg: "bg-emerald-200" },
    "AT RISK": { border: "border-amber-200", bg: "bg-amber-50/50", text: "text-amber-700", countBg: "bg-amber-200" },
    "OVERDUE": { border: "border-rose-200", bg: "bg-rose-50/50", text: "text-rose-700", countBg: "bg-rose-200" }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {Object.entries(columns).map(([status, statusTasks]) => {
        const conf = columnConfig[status];
        return (
          <div key={status} className={`flex flex-col gap-3 rounded-xl border ${conf.border} ${conf.bg} p-3 min-h-[500px]`}>
            <div className="flex justify-between items-center px-1 pb-2 border-b border-white/50">
              <h3 className={`text-xs font-bold tracking-widest uppercase ${conf.text}`}>
                {statusLabel(status)}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${conf.countBg} ${conf.text}`}>
                {statusTasks.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1 pb-4">
              {statusTasks.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 italic">Belum ada tugas pada status ini</div>
              ) : (
                statusTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
