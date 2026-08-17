'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../../components/DashboardLayout';
import { apiClient } from '../../../../services/apiClient';

const stages = ['Lead', 'Qualification', 'Meeting', 'Demo', 'Proposal', 'Negotiation', 'Contract', 'Implementation', 'Expansion'];

export default function DealDetailPage({ params }) {
  const { id } = use(params);
  const [deal, setDeal] = useState(null);
  const [draft, setDraft] = useState(null);
  const [message, setMessage] = useState('');
  useEffect(() => { apiClient.getDealById(id).then(item => { setDeal(item); setDraft(item); }).catch(() => setDeal(false)); }, [id]);
  const save = async () => { const updated = await apiClient.updateDeal(id, { ...draft, expectedRevenue: draft.value * draft.probability }); setDeal(updated); setDraft(updated); setMessage('Deal updated.'); };
  if (deal === null) return <DashboardLayout><div className="p-8 text-sm text-slate-500">Loading deal…</div></DashboardLayout>;
  if (deal === false) return <DashboardLayout><div className="p-8 text-sm text-rose-600">Deal not found.</div></DashboardLayout>;
  return <DashboardLayout><section className="max-w-4xl space-y-6"><Link href="/sales" className="text-sm font-semibold text-indigo-600">← Sales register</Link><div><h1 className="text-2xl font-bold">{deal.account}</h1><p className="text-sm text-slate-500">{deal.id} · owner: {deal.owner} · <b>MOCK PERSISTENCE</b></p></div>{message && <div className="rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}<div className="grid gap-4 md:grid-cols-3"><div className="rounded-xl border bg-white p-4"><span className="text-xs text-slate-400">Deal value</span><p className="mt-1 text-xl font-bold">${deal.value.toLocaleString()}</p></div><div className="rounded-xl border bg-white p-4"><span className="text-xs text-slate-400">Expected revenue</span><p className="mt-1 text-xl font-bold">${deal.expectedRevenue.toLocaleString()}</p></div><div className="rounded-xl border bg-white p-4"><span className="text-xs text-slate-400">Next action</span><p className="mt-1 text-sm font-semibold">{deal.nextAction}</p></div></div><form onSubmit={event => { event.preventDefault(); save(); }} className="space-y-4 rounded-xl border bg-white p-5 shadow-sm"><h2 className="font-semibold">Update pipeline record</h2><div className="grid gap-4 md:grid-cols-2"><label className="text-sm">Stage<select value={draft.stage} onChange={event => setDraft({ ...draft, stage: event.target.value })} className="mt-1 w-full rounded border p-2">{stages.map(stage => <option key={stage}>{stage}</option>)}</select></label><label className="text-sm">Next action<input value={draft.nextAction} onChange={event => setDraft({ ...draft, nextAction: event.target.value })} className="mt-1 w-full rounded border p-2" /></label><label className="text-sm">Value<input type="number" value={draft.value} onChange={event => setDraft({ ...draft, value: Number(event.target.value) })} className="mt-1 w-full rounded border p-2" /></label><label className="text-sm">Probability<input type="number" min="0" max="1" step="0.05" value={draft.probability} onChange={event => setDraft({ ...draft, probability: Number(event.target.value) })} className="mt-1 w-full rounded border p-2" /></label></div><button className="rounded bg-indigo-600 px-4 py-2 text-sm font-bold text-white">Save deal</button></form></section></DashboardLayout>;
}
