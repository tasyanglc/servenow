import React from 'react';

export default function KpiCard({ title, value, icon, trend, subtext, color = "indigo" }) {
  const colorMap = {
    indigo: "border-indigo-100 text-indigo-700 bg-indigo-50",
    emerald: "border-emerald-200 text-emerald-700 bg-emerald-50",
    amber: "border-amber-200 text-amber-700 bg-amber-50",
    rose: "border-rose-200 text-rose-700 bg-rose-50",
    blue: "border-blue-200 text-blue-700 bg-blue-50"
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-4 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow`}>
      <div className={`absolute top-0 left-0 w-full h-1 bg-${color}-500`}></div>
      <div className="flex justify-between items-start">
        <h3 className={`text-xs font-semibold text-${color}-600`}>{title}</h3>
        {icon && (
          <div className={`w-6 h-6 rounded-full ${colorMap[color]} flex items-center justify-center`}>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-2">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {subtext && <p className="text-[10px] text-slate-500 mt-1">{subtext}</p>}
      </div>
      {trend && (
        <div className="mt-3 relative">
          <div className={`text-[10px] font-medium flex items-center gap-1 text-${trend.isPositive ? 'emerald' : 'rose'}-600`}>
             {trend.label}
          </div>
        </div>
      )}
    </div>
  );
}
