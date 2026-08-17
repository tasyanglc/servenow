import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const NAVIGATION = [
  { type: 'header', name: 'WORKSPACE' },
  { name: 'Overview', path: '/overview', icon: '⌂', cLevelOnly: true },
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

export default function Sidebar({ isCollapsed, onToggle, currentPath, allowedPaths, isMobileOpen = false, onNavigate }) {
  const [isMounted, setIsMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { activeRole, changeRole, userConfig, allRoles } = useAuth();
  useEffect(() => setIsMounted(true), []);
  const isAllowed = (path) => allowedPaths.some(allowed => path === allowed || path.startsWith(`${allowed}/`));
  const sectionHasAccessibleLink = (index) => {
    const nextHeaderIndex = NAVIGATION.findIndex((item, itemIndex) => itemIndex > index && item.type === 'header');
    return NAVIGATION.slice(index + 1, nextHeaderIndex === -1 ? NAVIGATION.length : nextHeaderIndex).some(item => (!item.cLevelOnly || allowedPaths.includes('/overview')) && isAllowed(item.path));
  };

  return <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:w-auto lg:translate-x-0 lg:shadow-none ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}>
    <div className="flex h-20 shrink-0 items-center gap-3 border-b border-slate-100 px-6"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-sm"><span className="text-xs font-semibold text-white">SN</span></div>{!isCollapsed && <div className="whitespace-nowrap"><p className="text-lg font-semibold tracking-tight text-slate-950">ServeNow</p><p className="text-[11px] text-slate-500">Workforce OS</p></div>}</div>
    <nav className="custom-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">{isMounted && NAVIGATION.map((item, index) => {
      if (item.type === 'header') return sectionHasAccessibleLink(index) ? (isCollapsed ? <div key={item.name} className="my-2 h-px bg-slate-100" /> : <p key={item.name} className="mb-1 mt-3 px-3 text-[10px] font-semibold tracking-[0.14em] text-slate-400">{item.name}</p>) : null;
      if (item.cLevelOnly && !allowedPaths.includes('/overview')) return null;
      if (!isAllowed(item.path)) return null;
      const active = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
      return <Link key={item.path} href={item.path} onClick={onNavigate} title={item.name} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}><span className={`grid w-5 shrink-0 place-items-center text-base ${active ? 'text-blue-600' : 'text-slate-500'}`}>{item.icon}</span>{!isCollapsed && <span>{item.name}</span>}</Link>;
    })}</nav>
    <div className="relative border-t border-slate-100 p-3"><button onClick={() => setProfileOpen(value => !value)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-slate-50"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${userConfig.color} text-xs font-semibold text-white`}>{userConfig.initials}</span>{!isCollapsed && <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-800">{userConfig.name}</span><span className="block truncate text-[10px] text-slate-500">{userConfig.title}</span></span>}<span className="text-xs text-slate-400">⌃</span></button>{profileOpen && <div className="absolute bottom-full left-3 right-3 z-[60] mb-2 max-h-[60vh] overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-2xl"><p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Ganti peran (demo)</p>{Object.entries(allRoles).map(([role, config]) => <button key={role} onClick={() => { changeRole(role); setProfileOpen(false); onNavigate?.(); }} className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 ${activeRole === role ? 'bg-blue-50 text-blue-700' : ''}`}><span className={`grid h-6 w-6 place-items-center rounded-full ${config.color} text-[9px] font-semibold text-white`}>{config.initials}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">{config.name}</span><span className="block truncate text-[10px] text-slate-500">{config.title}</span></span></button>)}</div>}<div className="mt-1 border-t border-slate-100 pt-2"><button onClick={onToggle} className="hidden w-full rounded-lg px-3 py-2 text-xs text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 lg:block">{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</button><button onClick={onNavigate} className="w-full rounded-lg px-3 py-2 text-xs text-slate-500 lg:hidden">Tutup menu</button></div></div>
  </aside>;
}
