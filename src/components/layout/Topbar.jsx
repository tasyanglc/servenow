import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
  const { activeRole, changeRole, userConfig, allRoles } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="h-16 px-8 flex items-center justify-between bg-white border-b border-slate-200 shrink-0 z-10 shadow-sm relative">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-slate-900 leading-tight">Good morning, {userConfig.name.split(' ')[0]} 👋</h1>
      </div>
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className={`w-8 h-8 rounded-full ${userConfig.color} flex items-center justify-center text-white text-xs font-semibold shadow-sm`}>
            {userConfig.initials}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-none">{userConfig.name}</span>
            <span className="text-[10px] text-slate-500 leading-tight">{userConfig.title}</span>
          </div>
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50">
            <div className="px-4 py-2 border-b border-slate-100 mb-1">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Context (Dev Only)</span>
            </div>
            {Object.keys(allRoles).map((role) => (
              <button 
                key={role} 
                onClick={() => { changeRole(role); setIsOpen(false); }} 
                className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 ${activeRole === role ? 'bg-slate-50' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full ${allRoles[role].color} flex items-center justify-center text-white text-[10px] font-bold`}>{allRoles[role].initials}</div>
                <div className="flex flex-col">
                  <span className={`text-xs ${activeRole === role ? 'font-bold text-indigo-700' : 'font-medium text-slate-700'}`}>{allRoles[role].name}</span>
                  <span className="text-[10px] text-slate-500">{allRoles[role].title}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
