'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import PageHeader from '../../components/ui/PageHeader';
import KpiCard from '../../components/ui/KpiCard';

export default function TeamStatusPage() {
  const { userConfig } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch high level executive metrics which includes department level summaries
    apiClient.getExecutiveOverviewData().then(data => {
      setDepartments(data.deptSummary);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-slate-500">Loading team status...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <PageHeader 
          title="Department Operational Status" 
          subtitle="Department SLA compliance rates and backlog queue size summaries."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departments.map(dept => (
            <div key={dept.name} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-800">{dept.name} Department</h3>
                <span className="text-[10px] font-mono text-slate-400">Aggregated Status</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 border border-slate-150 rounded text-center">
                  <span className="block text-[8px] uppercase font-bold text-slate-400">Compliance Rate</span>
                  <span className="text-xl font-black text-indigo-900 mt-1 block">{dept.slaAchievement}%</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-150 rounded text-center">
                  <span className="block text-[8px] uppercase font-bold text-slate-400">Active Queue</span>
                  <span className="text-xl font-black text-slate-700 mt-1 block">{dept.openTasks} Tasks</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 leading-normal bg-indigo-50/50 p-2.5 rounded border border-indigo-100/50">
                Performance is calculated across all active SLA parameters in the department registry. This view does not expose individual employee records.
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
