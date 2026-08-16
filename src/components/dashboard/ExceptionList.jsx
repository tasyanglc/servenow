import React from 'react';
import Link from 'next/link';

export default function ExceptionList({ exceptions }) {
  if (!exceptions || exceptions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center text-center">
        <span className="text-2xl mb-2">🎉</span>
        <h3 className="text-sm font-semibold text-slate-700">All Clear</h3>
        <p className="text-xs text-slate-500 mt-1">No overdue, at risk, or blocked tasks.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Exceptions Requiring Attention</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Tasks that are Overdue, At Risk, or Blocked.</p>
        </div>
        <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
          {exceptions.length} Issues
        </span>
      </div>

      <div className="divide-y divide-slate-100 overflow-y-auto custom-scrollbar flex-1 max-h-[400px]">
        {exceptions.map(task => (
          <Link href={`/tasks/${task.id}`} key={task.id} className="block p-4 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-semibold text-slate-800">{task.title}</span>
              <div className="flex gap-1.5 ml-2 shrink-0">
                {task.computedStatus === 'OVERDUE' && (
                  <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">OVERDUE</span>
                )}
                {task.computedStatus === 'AT RISK' && (
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">AT RISK</span>
                )}
                {task.isBlocked && (
                  <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                    🛑 BLOCKED
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-end mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[7px] font-bold text-slate-600">
                  {task.owner?.initials || "??"}
                </div>
                <span className="text-[10px] text-slate-500">{task.owner?.name || "Unassigned"}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {task.remaining_sla_hours}h left
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
