'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { apiClient } from '../../services/apiClient';

const Metric = ({ label, value, change }) => <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm"><p className="text-xs font-semibold text-slate-600">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p><p className="mt-2 text-xs font-medium text-emerald-600">▲ {change} vs bulan lalu</p></article>;

export default function ReportsPage() {
  const [data, setData] = useState();
  useEffect(() => { apiClient.getExecutiveOverviewData().then(setData); }, []);
  if (!data) return <DashboardLayout><div className="grid h-48 place-items-center text-sm text-slate-500">Memuat laporan…</div></DashboardLayout>;
  return <DashboardLayout><section className="mx-auto max-w-7xl space-y-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-semibold tracking-tight text-slate-950">Reports</h1><p className="mt-1 text-sm text-slate-500">Analitik operasional untuk menilai SLA, risiko, dan ketergantungan keputusan.</p></div><button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">This Month</button></div><div className="grid gap-4 md:grid-cols-3"><Metric label="SLA Achievement" value={`${data.slaAchievement}%`} change="4.1%" /><Metric label="Operational Exceptions" value={data.weeklyExceptions} change="12 handled" /><Metric label="Director Dependency" value={data.directorDependency} change="7% lower" /></div><article className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm"><h2 className="text-base font-semibold text-slate-900">SLA Performance</h2><p className="mt-1 text-sm text-slate-500">Pencapaian SLA per fungsi operasional.</p><div className="mt-6 space-y-5">{data.deptSummary.map((item, index) => <div key={item.name}><div className="mb-2 flex justify-between text-sm"><span className="font-medium text-slate-700">{item.name}</span><span className="text-slate-500">{item.slaAchievement}% · {item.openTasks} tasks</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-500" style={{ width: `${item.slaAchievement}%`, opacity: 1 - index * 0.12 }} /></div></div>)}</div></article></section></DashboardLayout>;
}
