'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { operationsService } from '../../services/operationsService';

export default function TaskOperationalContext({ taskId }) {
  const [data, setData] = useState(); const [candidates, setCandidates] = useState();
  useEffect(() => { operationsService.getTaskContext(taskId).then(setData); operationsService.getCapacityRecommendations(taskId).then(setCandidates); }, [taskId]);
  if (!data) return null;
  return <div className="grid gap-6 lg:grid-cols-2">
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="border-b border-slate-100 pb-2 text-sm font-semibold">Customer → Project → Workflow</h3><div className="mt-3 space-y-2 text-sm">{data.customer && <Link className="block text-indigo-600" href={`/customers/${data.customer.id}`}>{data.customer.name} · {data.customer.contract}</Link>}{data.project && <Link className="block text-indigo-600" href={`/projects/${data.project.id}`}>{data.project.name}</Link>}<p>{data.workflow?.name} · gates available in the Workflow Library.</p><p className="text-xs text-slate-500">SLA: {data.sla?.status} · {data.sla?.remaining_sla_hours}h remaining · <b>MOCK / DERIVED</b></p></div></section>
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="border-b border-slate-100 pb-2 text-sm font-semibold">Dependency impact</h3>{data.dependencies.length ? data.dependencies.map(dep => <div className="mt-3 text-sm" key={dep.id}><b>{dep.task_id}</b> <span className="text-slate-500">— {dep.status}</span><p className="text-xs text-rose-600">{dep.downstreamImpact}</p></div>) : <p className="mt-3 text-sm text-slate-500">No upstream dependencies.</p>}</section>
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2"><h3 className="border-b border-slate-100 pb-2 text-sm font-semibold">Manager allocation support <span className="text-[9px] text-slate-400">ADVISORY · MOCK / DERIVED</span></h3><div className="mt-3 grid gap-2 md:grid-cols-2">{candidates?.map(employee => <div key={employee.id} className="rounded-lg bg-slate-50 p-3 text-sm"><div className="flex justify-between"><b>{employee.name}</b><span className={employee.suitable ? 'text-emerald-600' : 'text-slate-500'}>{employee.suitable ? 'Suitable' : 'Review needed'}</span></div><p className="mt-1 text-xs text-slate-500">Skills: {employee.skills.join(', ')} · workload {employee.workloadRatio}% · {employee.availability}</p></div>)}</div></section>
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2"><h3 className="border-b border-slate-100 pb-2 text-sm font-semibold">Relevant knowledge & playbooks</h3>{data.knowledge.map(item => <p key={item.id} className="mt-2 text-sm"><b>{item.title}</b> <span className="text-slate-500">— gate: {item.gate}</span></p>)}</section>
  </div>;
}
