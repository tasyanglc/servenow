'use client';
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';
import PageHeader from '../../components/ui/PageHeader';
import KpiCard from '../../components/ui/KpiCard';
import WorkloadDistribution from '../../components/dashboard/WorkloadDistribution';
import ExceptionList from '../../components/dashboard/ExceptionList';
import RecentEscalations from '../../components/dashboard/RecentEscalations';
import AiWeeklySummary from '../../components/dashboard/AiWeeklySummary';

import DashboardLayout from '../../components/DashboardLayout';

export default function TeamDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getTeamDashboardData().then(dashboardData => {
      setData(dashboardData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-slate-500">Loading dashboard...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <PageHeader 
          title="Manager Dashboard" 
          subtitle="Manage by Exception: Focus on what needs your attention right now."
        />

        <AiWeeklySummary weeklySummary={data.weeklySummary} />

        {/* KPI Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard 
            title="Team SLA Achievement" 
            value={`${data.kpis.slaAchievement}%`} 
            trend="up" 
            status={data.kpis.slaAchievement > 80 ? "ON TRACK" : "AT RISK"} 
          />
          <KpiCard 
            title="Exceptions (At Risk)" 
            value={data.kpis.atRisk} 
            status={data.kpis.atRisk > 5 ? "AT RISK" : "ON TRACK"} 
          />
          <KpiCard 
            title="Exceptions (Overdue)" 
            value={data.kpis.overdue} 
            status={data.kpis.overdue > 0 ? "OVERDUE" : "ON TRACK"} 
          />
          <KpiCard 
            title="Blocked Tasks" 
            value={data.kpis.blocked} 
            status={data.kpis.blocked > 0 ? "AT RISK" : "ON TRACK"} 
          />
        </div>

        {/* Main Operational Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Manage By Exception - Takes up 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
              <ExceptionList exceptions={data.exceptions} />
              <RecentEscalations escalations={data.escalations} />
            </div>
          </div>

          {/* Workload - Takes up 1 column */}
          <div className="lg:col-span-1 h-[400px]">
            <WorkloadDistribution workload={data.workload} />
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
