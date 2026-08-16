import React from 'react';

export default function EmptyState({ title, description, icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-8">
      {icon || (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )}
      <h2 className="text-sm font-semibold text-slate-600 mb-1">{title || "No data available"}</h2>
      <p className="text-xs text-center max-w-sm mb-4">{description || "There is nothing to show here at the moment."}</p>
      {action}
    </div>
  );
}
