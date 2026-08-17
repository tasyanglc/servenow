'use client';
import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import PageHeader from '../../../components/ui/PageHeader';

export default function AdminAuditLogPage() {
  const logs = [
    { timestamp: "2026-08-17T07:15:30Z", actor: "Budi Santoso", action: "Confirm AI Action", object: "TSK-1045", oldValue: "Pending Review", newValue: "Escalate Dependency" },
    { timestamp: "2026-08-17T06:50:11Z", actor: "System", action: "Auto-Escalation Trigger", object: "TSK-1043", oldValue: "At Risk", newValue: "Overdue" },
    { timestamp: "2026-08-17T06:26:24Z", actor: "Sarah Lee", action: "Update Deal Stage", object: "DEAL-101", oldValue: "Demo", newValue: "Proposal" },
    { timestamp: "2026-08-17T05:30:10Z", actor: "System Admin", action: "Update User Role", object: "Sarah Lee", oldValue: "Employee", newValue: "Sales Executive" },
    { timestamp: "2026-08-17T04:12:45Z", actor: "Budi Santoso", action: "Reassign Task Owner", object: "TSK-1044", oldValue: "Unassigned", newValue: "Andi Pratama" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <PageHeader 
          title="Security Audit Logs" 
          subtitle="Chronological register of configuration changes, user assignments, and intervention confirmations."
        />

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/20">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Object</th>
                <th className="p-4">Old Value</th>
                <th className="p-4">New Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-4 text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4 font-semibold text-slate-700">{log.actor}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-150 text-slate-600 font-medium">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700 font-medium font-mono">{log.object}</td>
                  <td className="p-4 text-slate-500 line-through truncate max-w-[150px]">{log.oldValue}</td>
                  <td className="p-4 text-emerald-700 font-semibold truncate max-w-[150px]">{log.newValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
