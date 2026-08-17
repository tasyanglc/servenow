'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import { apiClient } from '../../../services/apiClient';
import PageHeader from '../../../components/ui/PageHeader';

export default function SalesPipelinePage() {
  const { userConfig } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // The 9 required pipeline stages
  const stages = [
    "Lead", "Qualification", "Meeting", "Demo", "Proposal", 
    "Negotiation", "Contract", "Implementation", "Expansion"
  ];

  useEffect(() => {
    apiClient.fetchDeals().then(data => {
      setDeals(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-slate-500">Loading Pipeline Board...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Sales Pipeline" 
          subtitle="9-Stage transition board mapping progressive account ownership."
        />

        <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar items-start">
          {stages.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage);
            
            return (
              <div key={stage} className="shrink-0 flex flex-col gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 w-64 min-h-[450px]">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">{stage}</span>
                  <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full">
                    {stageDeals.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-0.5">
                  {stageDeals.length === 0 ? (
                    <div className="text-center py-8 text-[11px] text-slate-400 italic">No deals</div>
                  ) : (
                    stageDeals.map(deal => (
                      <div key={deal.id} className="p-3 rounded bg-white border border-slate-200 shadow-sm flex flex-col gap-2 relative hover:shadow-md transition-shadow">
                        
                        <div className="flex justify-between items-start">
                          <span className="text-[11px] font-bold text-slate-800 leading-tight pr-4">
                            {deal.account}
                          </span>
                          {deal.founderInvolvement && (
                            <span className="text-[8px] font-black uppercase text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 shrink-0">Founder</span>
                          )}
                        </div>

                        <div className="flex justify-between items-end mt-1">
                          <span className="text-xs font-mono font-bold text-indigo-800">
                            ${(deal.value / 1000).toFixed(0)}k
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            Prob: {(deal.probability * 100).toFixed(0)}%
                          </span>
                        </div>

                        <div className="text-[10px] text-slate-600 border-t border-slate-100 pt-2 flex flex-col gap-1">
                          <div><strong className="text-slate-400">Next Action:</strong> {deal.nextAction}</div>
                          <div className="text-[9px] text-slate-500 font-mono font-semibold">Deadline: {deal.nextActionDeadline}</div>
                        </div>

                        <div className="flex justify-between items-center mt-2 border-t border-slate-100 pt-2">
                          <span className="text-[9px] text-slate-500">Owner: {deal.owner}</span>
                          <span className={`text-[8px] font-extrabold px-1 rounded uppercase ${
                            deal.progressiveOwnership === 'Own' ? 'bg-emerald-100 text-emerald-700' :
                            deal.progressiveOwnership === 'Lead' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {deal.progressiveOwnership}
                          </span>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
