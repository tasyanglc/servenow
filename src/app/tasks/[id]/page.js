'use client';
import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../services/apiClient';
import SlaCountdown from '../../../components/ui/SlaCountdown';
import ActivityHistory from '../../../components/ui/ActivityHistory';
import PageHeader from '../../../components/ui/PageHeader';
import CustomerSlaProgress from '../../../components/CustomerSlaProgress';
import AiRiskAnalysis from '../../../components/AiRiskAnalysis';

import DashboardLayout from '../../../components/DashboardLayout';

export default function TaskDetailPage({ params }) {
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [customerSla, setCustomerSla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Unwrap params using React.use() as per Next.js 15+ constraints
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  useEffect(() => {
    Promise.all([
      apiClient.getTaskById(id),
      apiClient.getCustomerSlaContext(id)
    ])
      .then(([taskData, slaData]) => {
        setTask(taskData);
        setCustomerSla(slaData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading task details...</div>;
  if (error || !task) return <div className="p-8 text-center text-rose-500">Task not found.</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        <div className="flex justify-between items-start">
          <PageHeader 
            title={task.title} 
            subtitle={`${task.id} • ${task.task_type} • ${task.customer}`}
            backTo={() => router.back()}
          />
          <div className="flex flex-col items-end gap-2">
            {task.task_priority === "Critical" && (
              <span className="text-xs font-bold px-2 py-1 bg-rose-100 text-rose-700 rounded border border-rose-200">
                CRITICAL PRIORITY
              </span>
            )}
            <SlaCountdown remainingSlaHours={task.remaining_sla_hours} slaHours={task.sla_hours} />
          </div>
        </div>

        <CustomerSlaProgress customerSla={customerSla} activeTaskId={task.id} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">Task Definition</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Responsibility</span>
                  <p className="text-sm text-slate-700">{task.responsibility || "Not specified."}</p>
                </div>
                
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Expected Output</span>
                  <p className="text-sm text-slate-700">{task.expected_output || "Not specified."}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">Dependencies</h3>
              
              {!task.dependencies || task.dependencies.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No dependencies logged.</p>
              ) : (
                <div className="space-y-3">
                  {task.dependencies.map(dep => (
                    <div key={dep.id} className="flex justify-between items-center p-3 rounded bg-slate-50 border border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-700">{dep.task_id}</span>
                        <span className="text-[10px] text-slate-500">Owned by: {dep.owner}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                        dep.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 
                        dep.status === 'Delayed' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {dep.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            <AiRiskAnalysis task={task} />

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">Ownership</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700">
                  {task.owner?.initials || "??"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800">{task.owner?.name || "Unassigned"}</span>
                  <span className="text-xs text-slate-500">{task.department}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">Activity & Escalation Trail</h3>
              <div className="max-h-80 overflow-y-auto custom-scrollbar pr-2">
                <ActivityHistory activities={task.activity_history} escalations={task.escalation_history} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
