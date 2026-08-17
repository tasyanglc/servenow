'use client';

import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { mockTasks } from '../../lib/mockData';
import TaskCard from '../../components/TaskCard';
import { calculateTaskStatus } from '../../lib/taskUtils';

export default function TaskBoardPage() {
  const { activeRole } = useAuth();
  const columns = [
    { title: 'ON TRACK', label: 'Sesuai rencana', tasks: mockTasks.filter(task => calculateTaskStatus(task.remaining_sla_hours, task.sla_hours) === 'ON TRACK'), dot: 'bg-emerald-500', border: 'border-emerald-100', action: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' },
    { title: 'AT RISK', label: 'Perlu perhatian', tasks: mockTasks.filter(task => calculateTaskStatus(task.remaining_sla_hours, task.sla_hours) === 'AT RISK'), dot: 'bg-amber-500', border: 'border-amber-100', action: 'border-amber-200 text-amber-700 hover:bg-amber-50' },
    { title: 'OVERDUE', label: 'Melewati SLA', tasks: mockTasks.filter(task => calculateTaskStatus(task.remaining_sla_hours, task.sla_hours) === 'OVERDUE'), dot: 'bg-rose-500', border: 'border-rose-100', action: 'border-rose-200 text-rose-700 hover:bg-rose-50' },
    { title: 'BLOCKED', label: 'Menunggu ketergantungan', tasks: mockTasks.filter(task => task.dependencies?.some(dependency => dependency.status !== 'Resolved')), dot: 'bg-violet-500', border: 'border-violet-100', action: 'border-violet-200 text-violet-700 hover:bg-violet-50' }
  ];

  return <DashboardLayout><section className="mx-auto max-w-[1440px]"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-semibold tracking-tight text-slate-950">Task Board</h1><p className="mt-1 text-sm text-slate-500">Pantau pekerjaan berdasarkan kondisi dan risiko SLA.</p></div><div className="flex flex-wrap gap-2"><button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">Group by: Status</button><button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">This Week</button><span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">{activeRole}</span></div></div><div className="grid min-h-[calc(100vh-180px)] grid-cols-1 gap-4 xl:grid-cols-4">{columns.map(column => <section key={column.title} className={`flex min-h-80 flex-col rounded-xl border ${column.border} bg-white p-3 shadow-sm`}><div className="mb-3 flex items-start justify-between border-b border-slate-100 px-1 pb-3"><div><div className="flex items-center gap-2"><i className={`h-2 w-2 rounded-full ${column.dot}`} /><h2 className="text-xs font-semibold tracking-wide text-slate-800">{column.title}</h2></div><p className="mt-1 text-[11px] text-slate-500">{column.label}</p></div><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{column.tasks.length}</span></div><div className="custom-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto">{column.tasks.map(task => <TaskCard key={task.id} task={task} />)}{column.tasks.length === 0 && <p className="py-6 text-center text-xs text-slate-400">Belum ada tugas</p>}</div><button className={`mt-3 rounded-lg border px-3 py-2 text-xs font-semibold transition ${column.action}`}>+ Add Task</button></section>)}</div></section></DashboardLayout>;
}
