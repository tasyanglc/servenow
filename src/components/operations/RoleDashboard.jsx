'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { operationsService } from '../../services/operationsService';

const quickLinks = [
  { path: '/overview', label: 'Executive overview' }, { path: '/team-dashboard', label: 'Team monitoring' }, { path: '/projects', label: 'Projects & workflows' }, { path: '/tasks', label: 'Task board' }, { path: '/risk-monitor', label: 'Risk monitor' }, { path: '/interventions', label: 'Interventions' }, { path: '/sales', label: 'Sales pipeline' }, { path: '/customers', label: 'Customers' }, { path: '/admin/users', label: 'User administration' }, { path: '/my-work', label: 'My work' }
];

export default function RoleDashboard() {
  const { userConfig, activeRole } = useAuth();
  const [org, setOrg] = useState();
  useEffect(() => { operationsService.getOrganization().then(setOrg); }, []);
  if (!org) return <div className="flex h-48 items-center justify-center text-sm text-slate-500">Loading role workspace…</div>;
  const leader = org.leadership.find(person => person.name === userConfig.name);
  const team = org.divisions.find(item => item.department === userConfig.division);
  const visibleLinks = quickLinks.filter(item => userConfig.allowedPaths.some(path => item.path === path || item.path.startsWith(`${path}/`))).slice(0, 6);
  const employee = org.employees.find(person => person.name === userConfig.name);
  const accountabilities = leader?.accountabilities || (employee ? [`Assigned function: ${employee.department}`, `Skills: ${employee.skills.join(', ')}`, `Availability: ${employee.availability}`, `${employee.allocatedHours}/${employee.capacityHours} weekly capacity`] : ['Role-scoped work queue', 'Project and task context']);
  return <section className="max-w-7xl space-y-6"><div className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm"><div className="flex flex-col justify-between gap-4 md:flex-row"><div><span className="text-xs font-bold uppercase tracking-widest text-indigo-300">{userConfig.level} · {userConfig.division}</span><h1 className="mt-2 text-2xl font-bold">Workspace {userConfig.title}</h1><p className="mt-1 text-sm text-slate-300">{userConfig.name} · Role context: {activeRole}</p></div><div className="rounded-xl bg-white/10 px-4 py-3 text-sm"><b>Scope</b><br />{userConfig.allowedPaths.length} authorized capabilities</div></div></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{accountabilities.map(item => <article key={item} className="rounded-xl border bg-white p-4 shadow-sm"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Responsibility</span><p className="mt-2 text-sm font-semibold text-slate-700">{item}</p></article>)}</div>{team && <article className="rounded-xl border bg-white p-5 shadow-sm"><div className="flex flex-col justify-between gap-2 md:flex-row"><div><h2 className="font-semibold">{team.department} team</h2><p className="text-sm text-slate-500">Manager: {team.manager?.name || 'C-level scope'}</p></div><span className="text-sm font-bold text-indigo-600">{team.employees.length} active employees</span></div><div className="mt-4 grid gap-3 md:grid-cols-2">{team.employees.map(person => <div key={person.id} className="rounded-lg bg-slate-50 p-3 text-sm"><b>{person.name}</b><p className="mt-1 text-xs text-slate-500">{person.skills.join(', ')} · {person.availability}</p></div>)}</div></article>}<div><h2 className="mb-3 text-lg font-bold">Role tools</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visibleLinks.map(item => <Link key={item.path} href={item.path} className="rounded-xl border bg-white p-4 text-sm font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-300">{item.label} →</Link>)}</div></div></section>;
}
