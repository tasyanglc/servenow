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
import { operationsService } from '../../services/operationsService';
import Link from 'next/link';

export default function TeamDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monitoring, setMonitoring] = useState(null);

  useEffect(() => {
    apiClient.getTeamDashboardData().then(dashboardData => {
      setData(dashboardData);
      setLoading(false);
    });
    operationsService.getMonitoring().then(setMonitoring);
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

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Link href="/tasks" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-300"><span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Detect</span><span className="text-sm font-semibold">Task Risk Queue</span></Link>
          <Link href="/tasks" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-300"><span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Analyze</span><span className="text-sm font-semibold">Task Risk Drivers</span></Link>
          <Link href="/interventions" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-300"><span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Decide</span><span className="text-sm font-semibold">Interventions</span></Link>
          <Link href="/escalations" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-300"><span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Monitor</span><span className="text-sm font-semibold">Escalations</span></Link>
        </div>

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

        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"><span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Projects</span><p className="mt-1 text-2xl font-bold">{monitoring.projects.length}</p><p className="text-xs text-slate-500">progress aggregated from tasks</p></div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"><span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Workflow progress</span><p className="mt-1 text-2xl font-bold">{monitoring.workflows.length}</p><p className="text-xs text-slate-500">active standardized workflows</p></div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"><span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Capacity watch</span><p className="mt-1 text-2xl font-bold">{monitoring.capacity.filter(employee => employee.workloadRatio >= 90).length}</p><p className="text-xs text-slate-500">employees at 90%+ load</p></div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"><span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Bottlenecks</span><p className="mt-1 text-2xl font-bold">{monitoring.bottlenecks.length}</p><p className="text-xs text-slate-500">delayed dependency chains</p></div>
          </div>
        )}

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
