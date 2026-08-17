import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const NAVIGATION = [
  { type: 'header', name: 'WORKSPACE' },
  { name: 'My Work', path: '/my-work', icon: '◉' },
  { name: 'Team Dashboard', path: '/team-dashboard', icon: '◈' },
  { type: 'header', name: 'OPERATIONS' },
  { name: 'Projects', path: '/projects', icon: '▱' },
  { name: 'Workflows', path: '/workflows', icon: '◇' },
  { name: 'Tasks', path: '/tasks', icon: '☷' },
  { name: 'Escalations', path: '/escalations', icon: '↗' },
  { name: 'Knowledge Hub', path: '/knowledge', icon: '◈' },
  { type: 'header', name: 'BUSINESS' },
  { name: 'Sales Pipeline', path: '/sales/pipeline', icon: '◐' },
  { name: 'Customer Zero', path: '/customer-zero', icon: '◎' },
  { name: 'Reports', path: '/reports', icon: '▤' },
  { type: 'header', name: 'ADMIN' },
  { name: 'Admin Configuration', path: '/admin/users', icon: '⚙' },
  { name: 'Import Historical Data', path: '/admin/import', icon: '⇧' },
];

export default function Sidebar({ isCollapsed, onToggle, currentPath, allowedPaths }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const isAllowed = (path) => allowedPaths.some(allowed => path === allowed || path.startsWith(`${allowed}/`));
  const sectionHasAccessibleLink = (index) => {
    const nextHeaderIndex = NAVIGATION.findIndex((item, itemIndex) => itemIndex > index && item.type === 'header');
    return NAVIGATION.slice(index + 1, nextHeaderIndex === -1 ? NAVIGATION.length : nextHeaderIndex).some(item => isAllowed(item.path));
  };

  return <aside className={`flex shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
    <div className="flex h-20 shrink-0 items-center gap-3 border-b border-slate-100 px-6"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-sm"><span className="text-xs font-semibold text-white">SN</span></div>{!isCollapsed && <div className="whitespace-nowrap"><p className="text-lg font-semibold tracking-tight text-slate-950">ServeNow</p><p className="text-[11px] text-slate-500">Workforce OS</p></div>}</div>
    <nav className="custom-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">{isMounted && NAVIGATION.map((item, index) => {
      if (item.type === 'header') return sectionHasAccessibleLink(index) ? (isCollapsed ? <div key={item.name} className="my-2 h-px bg-slate-100" /> : <p key={item.name} className="mb-1 mt-3 px-3 text-[10px] font-semibold tracking-[0.14em] text-slate-400">{item.name}</p>) : null;
      if (!isAllowed(item.path)) return null;
      const active = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
      return <Link key={item.path} href={item.path} title={item.name} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}><span className={`grid w-5 shrink-0 place-items-center text-base ${active ? 'text-blue-600' : 'text-slate-500'}`}>{item.icon}</span>{!isCollapsed && <span>{item.name}</span>}</Link>;
    })}</nav>
    <div className="border-t border-slate-100 p-3"><button onClick={onToggle} className="w-full rounded-lg px-3 py-2 text-xs text-slate-500 transition hover:bg-slate-50 hover:text-slate-800">{isCollapsed ? 'Expand' : 'Collapse sidebar'}</button></div>
  </aside>;
}
