import React from 'react';
import SlaCountdown from './SlaCountdown';

export default function CustomerSlaProgress({ customerSla, activeTaskId }) {
  if (!customerSla) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mb-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase">Customer SLA Promise</span>
          <h2 className="text-sm font-semibold text-slate-800">{customerSla.title} • {customerSla.customer}</h2>
        </div>
        <SlaCountdown remainingSlaHours={customerSla.remaining_sla_hours} slaHours={customerSla.total_sla_hours} />
      </div>

      <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-2">
        {customerSla.internal_tasks.map((task, idx) => {
          const isActive = task.id === activeTaskId;
          
          return (
            <React.Fragment key={task.id}>
              <div className={`shrink-0 flex flex-col gap-1 p-3 rounded-lg border w-48 ${
                isActive ? 'border-indigo-400 bg-indigo-50/30 shadow-sm' : 'border-slate-200 bg-slate-50'
              }`}>
                <span className="text-[9px] font-bold text-slate-500">{task.id}</span>
                <span className={`text-xs font-semibold truncate ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>
                  {task.title}
                </span>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-[10px] text-slate-500">{task.owner}</span>
                  <span className="text-[10px] font-bold text-slate-600">{task.duration_hours}h</span>
                </div>
              </div>
              
              {idx < customerSla.internal_tasks.length - 1 && (
                <div className="shrink-0 text-slate-300 px-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
