'use client';
import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import PageHeader from '../../../components/ui/PageHeader';

export default function AdminEscalationRulesPage() {
  const [rules, setRules] = useState([
    { id: 1, condition: "SLA remaining time <= 25%", threshold: "25% remaining", level: "At Risk Notification", recipient: "Department Manager" },
    { id: 2, condition: "SLA remaining time <= 0", threshold: "0 hours (Breach)", level: "Overdue Auto-Escalation", recipient: "Director & CEO" },
    { id: 3, condition: "Dependency delay > 12 hours", threshold: "12 hours idle", level: "Blocker Alert Escalation", recipient: "Preceding Owner's Manager" },
    { id: 4, condition: "Task reassigned > 2 times", threshold: "2 bounces", level: "Volatility Intervention", recipient: "Operations Director" }
  ]);

  const [newRule, setNewRule] = useState({ condition: '', threshold: '', level: 'At Risk Notification', recipient: '' });
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newRule.condition || !newRule.recipient) return;

    setRules([...rules, { id: rules.length + 1, ...newRule }]);
    setNewRule({ condition: '', threshold: '', level: 'At Risk Notification', recipient: '' });
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <div className="flex justify-between items-center">
          <PageHeader 
            title="Escalation Protocols" 
            subtitle="Configure automated alert policies, operational thresholds, and target alert recipients."
          />
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition-colors shadow-sm"
          >
            {showForm ? "Cancel" : "Add Protocol"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 max-w-xl">
            <h3 className="text-xs font-bold uppercase text-slate-400">New Escalation Rule</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Trigger Condition</label>
                <input 
                  type="text" 
                  value={newRule.condition}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-250 bg-white"
                  placeholder="e.g. SLA remaining < 1h"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Threshold Parameter</label>
                <input 
                  type="text" 
                  value={newRule.threshold}
                  onChange={(e) => setNewRule({ ...newRule, threshold: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-250 bg-white"
                  placeholder="e.g. 1 hour remaining"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Escalation Priority Level</label>
                <select 
                  value={newRule.level}
                  onChange={(e) => setNewRule({ ...newRule, level: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-250 bg-white"
                >
                  <option value="At Risk Notification">At Risk Notification</option>
                  <option value="Overdue Auto-Escalation">Overdue Auto-Escalation</option>
                  <option value="Blocker Alert Escalation">Blocker Alert Escalation</option>
                  <option value="Volatility Intervention">Volatility Intervention</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Recipient / Target Action</label>
                <input 
                  type="text" 
                  value={newRule.recipient}
                  onChange={(e) => setNewRule({ ...newRule, recipient: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-250 bg-white"
                  placeholder="e.g. Operations Director"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition-colors shadow-sm"
              >
                Save Protocol
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/20">
                <th className="p-4">Condition</th>
                <th className="p-4">Threshold</th>
                <th className="p-4">Level</th>
                <th className="p-4">Recipient</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-800">{r.condition}</td>
                  <td className="p-4 font-mono text-slate-600">{r.threshold}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-orange-50 border border-orange-100 text-orange-700 font-semibold text-[10px]">
                      {r.level}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700 font-medium">{r.recipient}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
