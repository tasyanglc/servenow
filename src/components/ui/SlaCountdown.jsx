import React from 'react';
import { formatHours, calculateTaskStatus } from '../../lib/taskUtils';

export default function SlaCountdown({ remainingSlaHours, slaHours, showLabel = true }) {
  const status = calculateTaskStatus(remainingSlaHours, slaHours);
  
  const statusConfig = {
    "ON TRACK": "text-emerald-600 bg-emerald-50 border-emerald-200",
    "AT RISK": "text-amber-600 bg-amber-50 border-amber-300",
    "OVERDUE": "text-rose-600 bg-rose-50 border-rose-300 font-bold"
  };

  const style = statusConfig[status] || "text-slate-600 bg-slate-50 border-slate-200";

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border ${style}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="font-mono text-[11px] tracking-tight">
        {formatHours(remainingSlaHours)} {showLabel && "tersisa"}
      </span>
    </div>
  );
}
