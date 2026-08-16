import React from 'react';

export default function ActivityHistory({ activities = [], escalations = [] }) {
  // Combine and sort chronologically
  const allEvents = [
    ...activities.map(a => ({ ...a, type: 'activity' })),
    ...escalations.map(e => ({ ...e, type: 'escalation' }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Newest first

  if (allEvents.length === 0) {
    return <div className="text-xs text-slate-500 italic">No activity recorded.</div>;
  }

  return (
    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:ml-2.5 md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
      {allEvents.map((event, idx) => (
        <div key={idx} className="relative flex items-start gap-4">
          <div className={`absolute left-0 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center
            ${event.type === 'escalation' ? 'bg-orange-500' : 'bg-slate-300'}
          `}>
            {event.type === 'escalation' && <span className="text-[8px] text-white font-bold">!</span>}
          </div>
          <div className="pl-8 pt-0.5">
            <div className="flex items-baseline gap-2">
              <span className={`text-xs font-semibold ${event.type === 'escalation' ? 'text-orange-700' : 'text-slate-700'}`}>
                {event.action}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(event.timestamp).toLocaleString()}
              </span>
            </div>
            {event.user && (
              <div className="text-[10px] text-slate-500 mt-0.5">
                by {event.user}
              </div>
            )}
            {event.reason && (
              <div className="text-[11px] text-slate-600 mt-1 bg-slate-50 p-2 rounded border border-slate-100">
                {event.reason}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
