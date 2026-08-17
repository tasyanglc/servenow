'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import PageHeader from '../../components/ui/PageHeader';
import KpiCard from '../../components/ui/KpiCard';
import Link from 'next/link';

export default function OverviewPage() {
  const { activeRole } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getExecutiveOverviewData().then(overviewData => {
      setData(overviewData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-slate-500">Loading Executive Overview...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <PageHeader 
          title="Executive Overview" 
          subtitle="Corporate performance, scaling velocity, and operational self-sufficiency indicators."
        />

        {/* Executive Key Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard 
            title="SLA Achievement" 
            value={`${data.slaAchievement}%`} 
            trend="up" 
            status={data.slaAchievement > 85 ? "ON TRACK" : "AT RISK"} 
          />
          <KpiCard 
            title="Weekly Exceptions" 
            value={data.weeklyExceptions} 
            status={data.weeklyExceptions > 5 ? "AT RISK" : "ON TRACK"} 
          />
          <KpiCard 
            title="Pipeline Value" 
            value={data.pipelineValue} 
            trend="up"
            status="ON TRACK"
          />
          <KpiCard 
            title="Director Dependency" 
            value={data.directorDependency} 
            status={parseInt(data.directorDependency) > 10 ? "AT RISK" : "ON TRACK"} 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Department SLA & Operations - Left Col (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Department Summary */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-semibold text-slate-800 font-sans">Operations by Department</h3>
              </div>
              <div className="p-4">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-400 font-semibold border-b border-slate-100">
                      <th className="pb-2">Department</th>
                      <th className="pb-2">SLA Achievement</th>
                      <th className="pb-2">Active Tasks</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.deptSummary.map(dept => (
                      <tr key={dept.name} className="hover:bg-slate-50">
                        <td className="py-2.5 font-medium text-slate-800">{dept.name}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            dept.slaAchievement > 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {dept.slaAchievement}%
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-600 font-mono">{dept.openTasks} tasks</td>
                        <td className="py-2.5 text-right">
                          <Link href="/team-tasks" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                            Manage →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Critical Operational Exceptions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-800">Critical Operational Exceptions</h3>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">Requires Executive Review</span>
              </div>
              <div className="p-4">
                {data.criticalExceptions.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-4">No critical exceptions logged.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {data.criticalExceptions.map(exc => (
                      <div key={exc.id} className="flex justify-between items-center py-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-400">{exc.id}</span>
                            <span className="text-xs font-semibold text-slate-800">{exc.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">Client: {exc.customer} • Assigned to: {exc.owner}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                            exc.status === 'OVERDUE' ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-amber-700 bg-amber-50 border-amber-200'
                          }`}>
                            {exc.status}
                          </span>
                          <Link href={`/tasks/${exc.id}`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                            Drill Down →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sales & Adoption Summary - Right Col (1/3) */}
          <div className="space-y-6">

            {/* Director Dependency Meter */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Director Dependency</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Ratio of open operations requiring direct founder intervention.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-150 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-indigo-900">{data.directorDependency}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Founder Dependency Rate</span>
                
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: data.directorDependency }}></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
                  {parseInt(data.directorDependency) > 10 
                    ? "⚠️ Higher than target (<5%). Director intervention is acting as a blocker to scaling." 
                    : "✓ On Track. Operations are successfully decentralized."}
                </p>
              </div>
            </div>

            {/* Customer Zero Health */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-semibold text-slate-800">Customer Zero Adoption</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Internal adoption and execution health scores.</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <span className="block text-[8px] uppercase font-bold text-slate-400">Health</span>
                  <span className="text-xs font-bold text-slate-800">{data.customerZero.healthScore}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <span className="block text-[8px] uppercase font-bold text-slate-400">NPS score</span>
                  <span className="text-xs font-bold text-slate-800">+{data.customerZero.nps}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <span className="block text-[8px] uppercase font-bold text-slate-400">Active</span>
                  <span className="text-xs font-bold text-slate-800">{data.customerZero.activeUsers}</span>
                </div>
              </div>
            </div>

            {/* Sales Pipeline Summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-semibold text-slate-800">Sales Pipeline Value</h3>
              </div>
              <div className="space-y-2">
                {data.salesSummary.map(deal => (
                  <div key={deal.id} className="flex justify-between items-center text-xs p-2 rounded bg-slate-50 border border-slate-100">
                    <div>
                      <span className="font-semibold text-slate-800">{deal.customer}</span>
                      <span className="block text-[9px] text-slate-400">{deal.stage} • Prob: {deal.probability}</span>
                    </div>
                    <span className="font-mono font-bold text-indigo-700">{deal.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
