import React from 'react';

export default function AiWeeklySummary() {
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-sm font-bold tracking-widest text-indigo-200 uppercase">AI Weekly Summary</h2>
          </div>
          <h3 className="text-lg font-semibold mb-2">Operational Health is Stable</h3>
          <p className="text-sm text-indigo-100/80 leading-relaxed max-w-2xl">
            Team SLA achievement remains high at 83%. However, we're seeing an increase in delayed escalations from the Engineering tier causing downstream churn risk. Recommend reviewing active support queues for cross-department bottlenecks.
          </p>
        </div>
        
        <div className="shrink-0 flex gap-3">
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-xs font-semibold transition-colors">
            View Full Report
          </button>
          <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded text-xs font-semibold transition-colors shadow-sm">
            Configure Insights
          </button>
        </div>
      </div>
    </div>
  );
}
