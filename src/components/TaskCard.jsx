import React from 'react';
import Link from 'next/link';
import { calculateTaskStatus } from '../lib/taskUtils';
import SlaCountdown from './ui/SlaCountdown';

const TaskCard = ({ task }) => {
  const status = calculateTaskStatus(task.remaining_sla_hours, task.sla_hours);
  
  // Status Colors Mapping
  const statusConfig = {
    "ON TRACK": { bg: "bg-emerald-50/20", border: "border-emerald-200" },
    "AT RISK": { bg: "bg-amber-50/40", border: "border-amber-400" },
    "OVERDUE": { bg: "bg-rose-50/40", border: "border-rose-500" }
  };
  
  const typeConfig = {
    "Implementation": "text-blue-600 bg-blue-50 border-blue-100",
    "Support": "text-amber-600 bg-amber-50 border-amber-100",
    "Data Ops": "text-rose-600 bg-rose-50 border-rose-100",
    "Technical Issue": "text-purple-600 bg-purple-50 border-purple-100",
    "Configuration": "text-slate-600 bg-slate-100 border-slate-200"
  };

  const conf = statusConfig[status];
  const typeStyle = typeConfig[task.task_type] || "text-slate-600 bg-slate-50 border-slate-200";

  return (
    <Link href={`/tasks/${task.id}`} className={`block p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col gap-2 ${conf.bg} border-l-4 ${conf.border} border-t border-r border-b border-t-slate-200 border-r-slate-200 border-b-slate-200 bg-white`}>
      
      {/* Top badges */}
      <div className="flex justify-between items-start">
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border w-fit ${typeStyle}`}>
          {task.task_type}
        </span>
        {task.task_priority === "Critical" && (
          <span className="text-[9px] font-bold text-rose-600 uppercase bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">Critical</span>
        )}
      </div>

      {/* Task Title */}
      <p className="text-xs font-semibold text-slate-800 leading-tight pr-4">
        {task.title}
      </p>

      {/* Warning Flags */}
      {(task.cross_department_required || task.reassignment_count > 1 || (task.dependencies && task.dependencies.length > 0)) && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {task.dependencies && task.dependencies.length > 0 && (
            <span className="text-[9px] text-slate-500 bg-slate-100 border border-slate-200 px-1 rounded flex items-center gap-1" title={`${task.dependencies.length} dependencies`}>
               🔗 {task.dependencies.length} Deps
            </span>
          )}
          {task.cross_department_required && (
            <span className="text-[9px] text-slate-500 bg-slate-100 border border-slate-200 px-1 rounded flex items-center gap-1" title="Cross-department required">
               🤝 Cross-dept
            </span>
          )}
          {task.reassignment_count > 1 && (
            <span className="text-[9px] text-amber-700 bg-amber-50 border border-amber-200 px-1 rounded flex items-center gap-1" title={`${task.reassignment_count} reassignments`}>
               🔄 Bounced
            </span>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex justify-between items-end mt-2 pt-2 border-t border-slate-100">
        
        {/* Owner */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-700">
              {task.owner?.initials || "??"}
            </div>
            <span className="text-[10px] font-medium text-slate-700 truncate max-w-[80px]" title={task.owner?.name}>
              {task.owner?.name || "Unassigned"}
            </span>
          </div>
          {task.department && (
            <span className="text-[9px] text-slate-400 pl-6">{task.department}</span>
          )}
        </div>
        
        {/* SLA Status */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
            {status}
          </span>
          <SlaCountdown remainingSlaHours={task.remaining_sla_hours} slaHours={task.sla_hours} showLabel={false} />
        </div>
      </div>
    </Link>
  );
};

export default TaskCard;

