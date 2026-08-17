'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { apiClient } from '../../services/apiClient';
import PageHeader from '../../components/ui/PageHeader';
import KpiCard from '../../components/ui/KpiCard';

export default function CustomerZeroPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [frictionText, setFrictionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    apiClient.fetchCustomerZeroData().then(res => {
      setData(res);
      setLoading(false);
    });
  };

  const handleFrictionSubmit = (e) => {
    e.preventDefault();
    if (!frictionText.trim()) return;
    setSubmitting(true);
    apiClient.submitFriction(frictionText.trim())
      .then(() => {
        setFrictionText('');
        setSuccessMsg("Friction point successfully logged and added to the validation pipeline!");
        loadData();
        setTimeout(() => setSuccessMsg(''), 4000);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-slate-500">Loading Customer Zero Dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <PageHeader 
          title="Customer Zero" 
          subtitle="Proof-of-product & learning: How ServeNow runs internally."
        />

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-2">
            <span>✓</span> {successMsg}
          </div>
        )}

        {/* Customer Zero Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard title="Internal SLA Achievement" value={`${data.slaAchievement}%`} status="ON TRACK" />
          <KpiCard title="Tasks Managed" value={data.tasksManaged} status="ON TRACK" />
          <KpiCard title="At-Risk Resol. Speed" value={`${data.atRiskResolutionSpeedHours}h`} status="ON TRACK" />
          <KpiCard title="Director Escalations" value={data.directorEscalations} status="ON TRACK" />
          <KpiCard title="Efficiency Gain" value={data.efficiencyGain} status="ON TRACK" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Friction Capture form - Left Col (1/3) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Capture Friction Point</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Submit real operational bottlenecks to drive internal validation.</p>
              </div>

              <form onSubmit={handleFrictionSubmit} className="space-y-3">
                <textarea 
                  rows={4}
                  value={frictionText}
                  onChange={(e) => setFrictionText(e.target.value)}
                  placeholder="Describe the friction (e.g. support queue lacks visual SLA warnings causing reassignments...)"
                  className="w-full text-xs p-3 rounded border border-slate-250 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded shadow-sm disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Logging..." : "Submit to validation queue"}
                </button>
              </form>
            </div>
          </div>

          {/* Validation & improvements feed - Right Col (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-semibold text-slate-800">Friction-to-Product Pipeline</h3>
              </div>

              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto custom-scrollbar">
                {data.frictions.map((fric, idx) => (
                  <div key={idx} className="p-4 space-y-2 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 font-mono block mb-1">{fric.id}</span>
                        <p className="text-xs font-semibold text-slate-800 leading-tight">
                          {fric.friction}
                        </p>
                      </div>
                      <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full shrink-0 uppercase ${
                        fric.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                        fric.status === 'Product Improvement' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {fric.status}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded border border-slate-150 text-[10px] space-y-1">
                      <div><strong className="text-slate-500">User Feedback:</strong> {fric.feedback}</div>
                      <div><strong className="text-indigo-600">Product Improvement:</strong> {fric.improvement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
