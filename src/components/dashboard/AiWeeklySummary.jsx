import React from 'react';

export default function AiWeeklySummary({ weeklySummary }) {
  if (!weeklySummary) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-stretch justify-between">
        
        {/* Left Side: Summary Insights */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h2 className="text-[10px] font-bold tracking-widest text-indigo-200 uppercase">AI Weekly Summary</h2>
            </div>
            
            <div className="grid grid-cols-4 gap-2 max-w-md my-3 bg-white/5 p-2 rounded border border-white/10">
              <div className="flex flex-col">
                <span className="text-[9px] text-indigo-200 uppercase">At Risk</span>
                <span className="text-base font-bold font-mono text-amber-300">{weeklySummary.atRisk}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-indigo-200 uppercase">Overdue</span>
                <span className="text-base font-bold font-mono text-rose-400">{weeklySummary.overdue}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-indigo-200 uppercase">Blocked</span>
                <span className="text-base font-bold font-mono text-slate-300">{weeklySummary.blocked}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-indigo-200 uppercase">Imbalance</span>
                <span className="text-base font-bold font-mono text-indigo-300">{weeklySummary.workloadImbalances}</span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-[10px] text-slate-300">
            * Generated from active task and model state context. Strictly for manager guidance.
          </div>
        </div>

        {/* Right Side: Operational Recommendations */}
        <div className="flex-1 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
          <div>
            <span className="block text-[9px] uppercase font-bold text-indigo-300 tracking-wider">Dominant Root Cause</span>
            <span className="text-xs font-semibold text-white mt-0.5 block">{weeklySummary.dominantRootCause}</span>
            
            <span className="block text-[9px] uppercase font-bold text-indigo-300 tracking-wider mt-3">Recommended Focus</span>
            <p className="text-xs text-slate-100/90 leading-relaxed mt-0.5">{weeklySummary.recommendedFocus}</p>
          </div>
          
          <div className="mt-4 flex gap-2 justify-end">
            <button className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded text-[10px] font-semibold transition-colors">
              Operational Report
            </button>
            <button className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 rounded text-[10px] font-semibold transition-colors">
              Execute Focus Plan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
