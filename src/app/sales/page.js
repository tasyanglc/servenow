'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import PageHeader from '../../components/ui/PageHeader';
import KpiCard from '../../components/ui/KpiCard';
import Link from 'next/link';

export default function SalesPage() {
  const { userConfig } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDeal, setEditingDeal] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' or 'expand'

  // Mock Expansion Opportunities (Land & Expand)
  const expansionClients = [
    {
      name: "Client ABC",
      branches: [
        { name: "Jakarta", product: "Core Workforce OS", value: 200000, stage: "Contract", nextAction: "Signature collection" },
        { name: "Bandung", product: "None (Upsell Opportunity)", value: 80000, stage: "Demo", nextAction: "Schedule deep-dive demo" },
        { name: "Surabaya", product: "None (Upsell Opportunity)", value: 120000, stage: "Lead", nextAction: "Qualify expansion fit" },
        { name: "Medan", product: "None (Upsell Opportunity)", value: 100000, stage: "Meeting", nextAction: "Present branch proposal" }
      ]
    },
    {
      name: "Acme Corporation",
      branches: [
        { name: "Singapore", product: "Analytics Suite", value: 150000, stage: "Proposal", nextAction: "Present SLA results" },
        { name: "Kuala Lumpur", product: "None (Upsell Opportunity)", value: 90000, stage: "Lead", nextAction: "Contact branch operations lead" }
      ]
    }
  ];

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = () => {
    apiClient.fetchDeals().then(data => {
      setDeals(data);
      setLoading(false);
    });
  };

  const handleEditClick = (deal) => {
    // RBAC check: Sales Executive can only edit their own deals
    const isSalesExecutive = userConfig.division === 'Sales' && userConfig.level === 'Employee';
    const isOwner = deal.owner === userConfig.name;
    
    if (isSalesExecutive && !isOwner) {
      setErrorMsg(`Access Denied: As a Sales Executive, you can only modify your own deals. ${deal.owner} owns this deal.`);
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    setEditingDeal({ ...deal });
  };

  const handleSave = () => {
    if (!editingDeal) return;
    
    const expectedRevenue = editingDeal.value * editingDeal.probability;
    const updatedPayload = {
      ...editingDeal,
      expectedRevenue
    };

    apiClient.updateDeal(editingDeal.id, updatedPayload)
      .then(() => {
        setSuccessMsg("Deal successfully updated!");
        setEditingDeal(null);
        loadDeals();
        setTimeout(() => setSuccessMsg(''), 3000);
      })
      .catch(err => {
        setErrorMsg(err.message);
        setTimeout(() => setErrorMsg(''), 3000);
      });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-slate-500">Loading Sales Records...</div>
      </DashboardLayout>
    );
  }

  // Calculate Aggregates
  const totalPipeline = deals.reduce((sum, d) => sum + d.value, 0);
  const expectedRevenueTotal = deals.reduce((sum, d) => sum + d.expectedRevenue, 0);
  const founderInvolvedCount = deals.filter(d => d.founderInvolvement).length;
  const founderDependencyRate = deals.length > 0 ? Math.round((founderInvolvedCount / deals.length) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <PageHeader 
          title="Sales System of Record" 
          subtitle="Deals logging, progressive delegation metrics, and revenue forecasting."
        />

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-2">
            <span>⚠️</span> {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-2">
            <span>✓</span> {successMsg}
          </div>
        )}

        {/* Sales KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Total Pipeline" value={`$${(totalPipeline / 1000).toFixed(0)}k`} status="ON TRACK" />
          <KpiCard title="Expected Revenue" value={`$${(expectedRevenueTotal / 1000).toFixed(0)}k`} status="ON TRACK" />
          <KpiCard title="Founder Invol." value={founderInvolvedCount} status={founderDependencyRate > 20 ? "AT RISK" : "ON TRACK"} />
          <KpiCard title="Sales Deleg. Rate" value={`${100 - founderDependencyRate}%`} status="ON TRACK" />
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 gap-4">
          <button 
            onClick={() => setActiveTab('registry')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'registry' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'
            }`}
          >
            Deals Registry
          </button>
          <button 
            onClick={() => setActiveTab('expand')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'expand' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'
            }`}
          >
            Land & Expand (Branch Tree)
          </button>
        </div>

        {activeTab === 'registry' ? (
          /* Deals Database */
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-semibold text-slate-800">Company Sales Register</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/20">
                    <th className="p-4">Account</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4">Stage</th>
                    <th className="p-4">Value</th>
                    <th className="p-4">Prob.</th>
                    <th className="p-4">Progressive Level</th>
                    <th className="p-4">Founder Involved</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deals.map(deal => (
                    <tr key={deal.id} className="hover:bg-slate-50">
                      <td className="p-4 font-medium text-slate-800"><Link href={`/sales/deals/${deal.id}`} className="text-indigo-600 hover:underline">{deal.account}</Link></td>
                      <td className="p-4 text-slate-600">{deal.owner}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium">
                          {deal.stage}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-semibold">${deal.value.toLocaleString()}</td>
                      <td className="p-4 font-mono">{(deal.probability * 100).toFixed(0)}%</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          deal.progressiveOwnership === 'Own' ? 'bg-emerald-100 text-emerald-800' :
                          deal.progressiveOwnership === 'Lead' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {deal.progressiveOwnership}
                        </span>
                      </td>
                      <td className="p-4">
                        {deal.founderInvolvement ? (
                          <span className="text-rose-600 font-semibold">Yes</span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleEditClick(deal)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded"
                        >
                          Edit Deal
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Land & Expand Branch Tree view */
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Account Branch Opportunities</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tracking branch-level adoption and expansion pipeline.</p>
            </div>
            
            <div className="space-y-4">
              {expansionClients.map(client => (
                <div key={client.name} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                  <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                    🏢 {client.name}
                  </h4>
                  
                  <div className="pl-6 border-l-2 border-indigo-200 space-y-3 relative">
                    {client.branches.map(branch => (
                      <div key={branch.name} className="flex justify-between items-center bg-white p-3 rounded border border-slate-100 shadow-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-800">{branch.name} Branch</span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded border border-slate-150">{branch.product}</span>
                          </div>
                          <span className="block text-[10px] text-slate-500">
                            <strong>Next Action:</strong> {branch.nextAction}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-slate-700 uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            {branch.stage}
                          </span>
                          <span className="text-xs font-mono font-bold text-indigo-700">
                            +${branch.value.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inline Edit Form Modal/Section */}
        {editingDeal && (
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-200 pb-2">
              Edit Deal: {editingDeal.account}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Stage</label>
                <select 
                  value={editingDeal.stage}
                  onChange={(e) => setEditingDeal({ ...editingDeal, stage: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-250 bg-white"
                >
                  {["Lead", "Qualification", "Meeting", "Demo", "Proposal", "Negotiation", "Contract", "Implementation", "Expansion"].map(stg => (
                    <option key={stg} value={stg}>{stg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Deal Value ($)</label>
                <input 
                  type="number"
                  value={editingDeal.value}
                  onChange={(e) => setEditingDeal({ ...editingDeal, value: parseInt(e.target.value) || 0 })}
                  className="w-full text-xs p-2 rounded border border-slate-250 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Win Probability (0-1)</label>
                <input 
                  type="number" 
                  step="0.05"
                  max="1"
                  min="0"
                  value={editingDeal.probability}
                  onChange={(e) => setEditingDeal({ ...editingDeal, probability: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xs p-2 rounded border border-slate-250 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Progressive Ownership Level</label>
                <select 
                  value={editingDeal.progressiveOwnership}
                  onChange={(e) => setEditingDeal({ ...editingDeal, progressiveOwnership: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-250 bg-white"
                >
                  {["Observe", "Contribute", "Co-lead", "Lead", "Own"].map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Next Action</label>
                <input 
                  type="text"
                  value={editingDeal.nextAction}
                  onChange={(e) => setEditingDeal({ ...editingDeal, nextAction: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-250 bg-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input 
                    type="checkbox"
                    checked={editingDeal.founderInvolvement}
                    onChange={(e) => setEditingDeal({ ...editingDeal, founderInvolvement: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  Requires Founder/Director Involvement
                </label>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button 
                onClick={() => setEditingDeal(null)}
                className="px-4 py-2 border border-slate-250 text-slate-600 rounded text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Save Updates
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
