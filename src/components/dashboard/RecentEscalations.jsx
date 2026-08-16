import React from 'react';
import Link from 'next/link';

export default function RecentEscalations({ escalations }) {
  if (!escalations || escalations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-center">
        <p className="text-xs text-slate-500 italic">No recent escalations.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-800">Recent Escalations</h3>
      </div>

      <div className="divide-y divide-slate-100 overflow-y-auto custom-scrollbar flex-1">
        {escalations.map((esc, idx) => (
          <div key={idx} className="p-4 relative">
            <div className="flex gap-3">
              <div className="mt-1 shrink-0">
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-[10px]">
                  !
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-semibold text-orange-700">{esc.action}</span>
                    <span className="text-[10px] text-slate-400 ml-2">{new Date(esc.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                <Link href={`/tasks/${esc.taskId}`} className="text-xs font-semibold text-slate-800 hover:text-indigo-600 mt-0.5 block truncate max-w-[200px]">
                  {esc.taskTitle}
                </Link>
                <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="font-semibold text-slate-700">{esc.user}:</span> {esc.reason}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
