import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
  const { activeRole, changeRole, userConfig, allRoles } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const roleGroups = ['C-Level', 'Manager', 'Employee'].map(level => ({
    level: ({ 'C-Level': 'Direksi', Manager: 'Manajer', Employee: 'Karyawan' })[level],
    sourceLevel: level,
    roles: Object.entries(allRoles).filter(([, config]) => config.level === level)
  }));

  return (
    <header className="relative z-50 flex h-20 shrink-0 items-center justify-end border-b border-slate-100 bg-white px-6 md:px-8">
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-haspopup="menu" className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300">
          <div className={`w-8 h-8 rounded-full ${userConfig.color} flex items-center justify-center text-white text-xs font-semibold shadow-sm`}>
            {userConfig.initials}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-none">{userConfig.name}</span>
            <span className="text-[10px] text-slate-500 leading-tight">{userConfig.title}</span>
          </div>
        </button>
        {isOpen && (
          <div role="menu" className="absolute right-0 top-full z-[60] mt-2 w-80 max-h-[calc(100vh-5.5rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-100 bg-white px-4 py-3">
               <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Ganti Peran (Khusus Demo)</span>
               <p className="mt-0.5 text-xs text-slate-500">Pilih peran untuk melihat ruang kerja yang sesuai.</p>
            </div>
            <div className="max-h-[calc(100vh-9.5rem)] overflow-y-auto overscroll-contain py-2 custom-scrollbar">
              {roleGroups.map(group => (
                <div key={group.level} className="py-1">
                  <div className="border-y border-slate-100 bg-slate-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">{group.level}</div>
                  {group.roles.map(([role, config]) => (
                    <button
                      key={role}
                      role="menuitem"
                      onClick={() => { changeRole(role); setIsOpen(false); }}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 ${activeRole === role ? 'bg-indigo-50/70' : ''}`}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.color} text-[10px] font-semibold text-white`}>{config.initials}</div>
                      <div className="min-w-0 flex-1">
                        <span className={`block truncate text-xs ${activeRole === role ? 'font-semibold text-indigo-700' : 'font-medium text-slate-700'}`}>{config.name}</span>
                        <span className="block truncate text-[10px] text-slate-500">{config.title}</span>
                      </div>
                      {activeRole === role && <span className="text-[10px] font-semibold text-indigo-600">Aktif</span>}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
