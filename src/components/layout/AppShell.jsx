import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import EmptyState from '../ui/EmptyState';

export default function AppShell({ children }) {
  const { userConfig } = useAuth();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Allow root path or dynamic paths without strict checking for prototype convenience
  // In real app, all routes except public ones should be strictly checked against JWT scopes
  let isAuthorized = false;
  if (pathname === '/' || pathname.includes('[')) {
      isAuthorized = true; 
  } else {
      isAuthorized = userConfig.allowedPaths.some(p => pathname.startsWith(p));
  }

  // 403 Forbidden Screen
  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-screen bg-[#F4F7FE]">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          currentPath={pathname}
          allowedPaths={userConfig.allowedPaths} 
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 p-8">
            <div className="h-full flex items-center justify-center">
               <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-rose-200 p-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500"></div>
                  <div className="w-16 h-16 mx-auto bg-rose-50 rounded-full flex items-center justify-center mb-6">
                    <span className="text-2xl">🚫</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">403 Unauthorized</h2>
                  <p className="text-sm text-slate-500 mb-6">
                    Your current role (<span className="font-bold text-slate-700">{userConfig.title}</span>) does not have permission to view the <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600">{pathname}</code> resource.
                  </p>
                  <p className="text-xs text-slate-400 border-t border-slate-100 pt-4">
                    This enforcement happens strictly at the client rendering layer and should be mirrored at the API level via JWT validation.
                  </p>
               </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Authorized Render
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F7FE] text-slate-800 font-sans">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        currentPath={pathname}
        allowedPaths={userConfig.allowedPaths} 
      />
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
