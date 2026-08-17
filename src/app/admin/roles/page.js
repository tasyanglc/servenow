'use client';
import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import PageHeader from '../../../components/ui/PageHeader';
import { ROLE_CONFIG } from '../../../context/AuthContext';

export default function AdminRolesPage() {
  const roles = Object.entries(ROLE_CONFIG).map(([name, config]) => ({ name, description: `${config.level} scope for ${config.division}. Default workspace: ${config.defaultPath}.`, paths: config.allowedPaths, level: config.level }));

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <PageHeader 
          title="Role Scopes & Permissions" 
          subtitle="System definition of role descriptions and allowed path boundaries."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map(role => (
            <div key={role.name} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-800">{role.name}</h3>
                <span className="text-[10px] font-mono text-slate-400">{role.level}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{role.description}</p>
              
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-450 mb-1.5">Allowed Path Gateways</span>
                <div className="flex flex-wrap gap-1.5">
                  {role.paths.map(p => (
                    <code key={p} className="text-[10px] bg-slate-50 border border-slate-150 px-2 py-0.5 rounded text-indigo-600">
                      {p}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
