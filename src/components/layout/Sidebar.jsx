import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export const SIDEBAR_STRUCTURE = [
  { type: "header", name: "GLOBAL" },
  { name: "My Role Workspace", path: "/role-dashboard", icon: "🧭" },
  { name: "Executive Overview", path: "/overview", icon: "📊" },
  { name: "Organization", path: "/organization", icon: "🏢" },
  
  { type: "header", name: "01 OPERATE" },
  { name: "Customers", path: "/customers", icon: "👥" },
  { name: "Projects", path: "/projects", icon: "🗂️" },
  { name: "Workflow Library", path: "/workflows", icon: "⚙️" },
  { name: "All Tasks (Company)", path: "/tasks", icon: "📋" },
  { name: "Team Dashboard", path: "/team-dashboard", icon: "👥" },
  { name: "My Work", path: "/my-work", icon: "👤" },
  { name: "Team Tasks", path: "/team-tasks", icon: "👥" },
  { name: "Escalations", path: "/escalations", icon: "🚩" },
  { name: "My Performance", path: "/my-performance", icon: "📈" },
  { name: "Team Status", path: "/team-status", icon: "🟢" },

  { type: "header", name: "02 MANAGE" },
  { name: "Risk Monitor", path: "/risk-monitor", icon: "⚠️" },
  { name: "Root Cause Explorer", path: "/root-causes", icon: "🔍" },
  { name: "Interventions", path: "/interventions", icon: "⚡" },
  { name: "Workload", path: "/workload", icon: "⚖️" },

  { type: "header", name: "03 SCALE" },
  { name: "Knowledge & Playbooks", path: "/knowledge", icon: "📚" },
  { name: "Workflow Pilots", path: "/pilots", icon: "🧪" },
  { name: "Outcomes", path: "/outcomes", icon: "✅" },
  { name: "Sales (Company)", path: "/sales", icon: "💼" },
  { name: "Sales Pipeline", path: "/sales/pipeline", icon: "🎯" },
  { name: "Customer Zero", path: "/customer-zero", icon: "✨" },

  { type: "header", name: "ADMIN" },
  { name: "Users", path: "/admin/users", icon: "⚙️" },
  { name: "Roles", path: "/admin/roles", icon: "⚙️" },
  { name: "SLA Rules", path: "/admin/sla-rules", icon: "⚙️" },
  { name: "Escalation Rules", path: "/admin/escalation-rules", icon: "⚙️" },
  { name: "Audit Log", path: "/admin/audit-log", icon: "⚙️" }
];

// The deck's operating model is exposed as a complete flow: operate, control,
// learn and scale. Supporting commercial and admin tools remain accessible.
const OPERATIONAL_NAVIGATION = [
  { type: 'header', name: 'WORKSPACE' },
  { name: 'My Workspace', path: '/role-dashboard', icon: '⌂' },
  { name: 'Executive Overview', path: '/overview', icon: '▦' },
  { name: 'Organization', path: '/organization', icon: '♙' },
  { type: 'header', name: '01 OPERATE' },
  { name: 'Customers', path: '/customers', icon: '♧' },
  { name: 'Projects', path: '/projects', icon: '▱' },
  { name: 'Workflow Library', path: '/workflows', icon: '◇' },
  { name: 'All Tasks', path: '/tasks', icon: '↯' },
  { name: 'My Work', path: '/my-work', icon: '☷' },
  { type: 'header', name: '02 CONTROL' },
  { name: 'Control Center', path: '/team-dashboard', icon: '▤' },
  { name: 'SLA Risk Monitor', path: '/risk-monitor', icon: '◈' },
  { name: 'Root Cause Analysis', path: '/root-causes', icon: '⌕' },
  { name: 'Capacity & Allocation', path: '/workload', icon: '◒' },
  { name: 'Interventions', path: '/interventions', icon: '↗' },
  { name: 'Escalations', path: '/escalations', icon: '⚑' },
  { type: 'header', name: '03 LEARN & SCALE' },
  { name: 'Knowledge & Playbooks', path: '/knowledge', icon: '▧' },
  { name: 'Workflow Pilots', path: '/pilots', icon: '◌' },
  { name: 'Outcomes', path: '/outcomes', icon: '✓' },
  { type: 'header', name: 'COMMERCIAL' },
  { name: 'Sales System', path: '/sales', icon: '◫' },
  { name: 'Sales Pipeline', path: '/sales/pipeline', icon: '◹' },
  { name: 'Customer Zero', path: '/customer-zero', icon: '◉' },
  { type: 'header', name: 'ADMINISTRATION' },
  { name: 'Users', path: '/admin/users', icon: '♙' },
  { name: 'Roles', path: '/admin/roles', icon: '◇' },
  { name: 'SLA Rules', path: '/admin/sla-rules', icon: '◌' },
  { name: 'Escalation Rules', path: '/admin/escalation-rules', icon: '⚑' },
  { name: 'Audit Log', path: '/admin/audit-log', icon: '▤' }
];

export default function Sidebar({ isCollapsed, onToggle, currentPath, allowedPaths }) {
  // The navigation is role-scoped and may change after a development route refresh.
  // Render a stable shell for SSR/hydration, then hydrate the current role's links.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <aside className={`flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} shrink-0 z-20 overflow-hidden`}>
      <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-100 shrink-0">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-sm">
          <span className="text-white text-xs font-semibold">SN</span>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-slate-900 font-semibold text-lg tracking-tight leading-tight">ServeNow</span>
            <span className="text-slate-500 text-[11px] leading-tight">Workforce OS</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-5 px-3 flex flex-col gap-1 custom-scrollbar">
        {isMounted && OPERATIONAL_NAVIGATION.map((item, idx) => {
          if (item.type === "header") {
            if (isCollapsed) return <div key={idx} className="h-px bg-slate-100 my-2"></div>;
            return <div key={idx} className="text-[10px] font-semibold text-slate-400 tracking-[0.12em] uppercase mt-4 mb-1 px-3">{item.name}</div>;
          }

          const isAllowed = allowedPaths.some(p => item.path === p);
          if (!isAllowed) return null;

          const isActive = currentPath === item.path || 
            (item.path === '/sales' 
              ? currentPath.startsWith('/sales/deals/') 
              : currentPath.startsWith(item.path + '/'));
          return (
            <Link
              href={item.path}
              key={idx}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap ${
                isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={item.name}
            >
              <div className={`w-5 text-center shrink-0 text-base ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>{item.icon}</div>
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>
      
      <div className="p-3 border-t border-slate-800">
        <button onClick={onToggle} className="flex items-center justify-center w-full px-3 py-2 text-xs text-slate-500 hover:text-slate-300">
           {isCollapsed ? "»" : "« Collapse Sidebar"}
        </button>
      </div>
    </aside>
  );
}
