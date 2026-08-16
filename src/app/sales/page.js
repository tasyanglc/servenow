'use client';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

export default function Page() {
  const { activeRole } = useAuth();
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Sales</h1>
        <p className="text-slate-500 text-sm mb-4">This page follows the PRD scope restrictions.</p>
        <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded border border-indigo-100 text-xs font-semibold">
          Active Identity: {activeRole}
        </div>
      </div>
    </DashboardLayout>
  );
}
