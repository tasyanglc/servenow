import React from 'react';

export default function WorkloadDistribution({ workload }) {
  if (!workload || workload.length === 0) {
    return <div className="text-sm text-slate-500 italic p-4 text-center">No workload data available.</div>;
  }

  // Find max count to scale the bars relative to the highest workload
  const maxCount = Math.max(...workload.map(w => w.count));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-full">
      <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-800">Workload Distribution</h3>
        <span className="text-[10px] uppercase font-bold text-slate-400">Alphabetical</span>
      </div>
      
      <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
        {workload.map(user => {
          // Rule: Neutral visual for workload (blue/slate) - never Red/Green for performance
          const widthPercent = (user.count / maxCount) * 100;
          return (
            <div key={user.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600">
                    {user.initials}
                  </div>
                  <span className="text-xs font-medium text-slate-700">{user.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-600">{user.count} tasks</span>
              </div>
              
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-400 rounded-full" 
                  style={{ width: `${widthPercent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
