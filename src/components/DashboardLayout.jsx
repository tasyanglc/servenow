import React from 'react';
import AppShell from './layout/AppShell';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const { userConfig, activeRole } = useAuth();
  const pathname = usePathname();

  // Helper to validate path authorization
  const isAuthorized = (path, allowedList = []) => {
    // Root path is allowed for everyone as redirect entry
    if (path === '/' || path === '/_not-found') return true;
    
    return allowedList.some(allowedPath => {
      if (allowedPath === path) return true;
      // Allow exact subroutes (e.g. /tasks/TSK-1040 is covered by /tasks)
      if (path.startsWith(allowedPath + '/')) return true;
      return false;
    });
  };

  const authorized = isAuthorized(pathname, userConfig.allowedPaths);

  if (!authorized) {
    return (
      <AppShell>
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-8 max-w-2xl mx-auto my-12 text-center space-y-4 shadow-sm">
          <span className="text-4xl">🛡️</span>
          <h1 className="text-xl font-black text-rose-800 tracking-tight">Access Denied</h1>
          <p className="text-xs text-rose-600 leading-relaxed">
            Your active role <strong>{activeRole}</strong> ({userConfig.title}) does not have permission to access the path <code>{pathname}</code>. 
          </p>
          <div className="pt-2">
            <p className="text-[10px] text-slate-400 italic">
              ServeNow Workforce OS security logs recorded this attempt. Please contact system admin to elevate privileges.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  return <AppShell>{children}</AppShell>;
}
