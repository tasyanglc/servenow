'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import PageHeader from '../../components/ui/PageHeader';
import KpiCard from '../../components/ui/KpiCard';

export default function MyPerformancePage() {
  const { userConfig } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tasks owned by the current employee
    apiClient.fetchTasks({ ownerInitials: userConfig.initials }).then(data => {
      setTasks(data);
      setLoading(false);
    });
  }, [userConfig]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-slate-500">Loading performance data...</div>
      </DashboardLayout>
    );
  }

  // Calculate personal metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Resolved').length;
  
  // Historical completion logs (mocked for Employee clarity of execution evidence)
  const completionLogs = [
    { id: "LOG-01", task: "Setup initial customer integration schema", completedDate: "2026-08-10", slaHours: 24, completedInHours: 14, result: "On Track" },
    { id: "LOG-02", task: "Investigate database query timeout bottlenecks", completedDate: "2026-08-12", slaHours: 8, completedInHours: 5, result: "On Track" },
    { id: "LOG-03", task: "Configure customer custom dashboard widgets", completedDate: "2026-08-15", slaHours: 48, completedInHours: 46, result: "On Track" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <PageHeader 
          title="My Performance Evidence" 
          subtitle="Review your SLA compliance rates and task completion logs."
        />

        {/* Personal KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard title="Personal SLA Rate" value="96.2%" status="ON TRACK" />
          <KpiCard title="Active Assignments" value={totalTasks - completedTasks} status="ON TRACK" />
          <KpiCard title="Completions (SLA Met)" value={completionLogs.length} status="ON TRACK" />
        </div>

        {/* Completion Evidence Logs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-800">Historical SLA Log</h3>
          </div>
          <div className="p-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 font-semibold border-b border-slate-100">
                  <th className="pb-2">Task</th>
                  <th className="pb-2">SLA Limit</th>
                  <th className="pb-2">Time taken</th>
                  <th className="pb-2">Completion Date</th>
                  <th className="pb-2 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completionLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 font-medium text-slate-800">{log.task}</td>
                    <td className="py-3 font-mono text-slate-650">{log.slaHours}h</td>
                    <td className="py-3 font-mono text-emerald-700 font-semibold">{log.completedInHours}h</td>
                    <td className="py-3 text-slate-550 font-mono">{log.completedDate}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold">
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
