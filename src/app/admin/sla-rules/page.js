'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import PageHeader from '../../../components/ui/PageHeader';
import { operationsService } from '../../../services/operationsService';

export default function AdminSlaRulesPage() {
  const [rules, setRules] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editVal, setEditVal] = useState(0);
  useEffect(() => { operationsService.getSlaRules().then(setRules); }, []);

  const handleEdit = (id, curVal) => {
    setEditingId(id);
    setEditVal(curVal);
  };

  const handleSave = async (id) => {
    await operationsService.updateSlaRule(id, { defaultSla: editVal });
    setRules(await operationsService.getSlaRules());
    setEditingId(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <PageHeader 
          title="SLA Rules Policy" 
          subtitle="These policies are used when a package creates operational tasks. Changes are retained for this demo session."
        />

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/20">
                <th className="p-4">Task Type</th>
                <th className="p-4">Priority Urgency</th>
                <th className="p-4">Default SLA Policy (Hours)</th>
                <th className="p-4">Target Compliance Threshold</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-800">{r.type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.priority === 'Critical' ? 'bg-rose-50 text-rose-700' :
                      r.priority === 'High' ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600'
                    }`}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    {editingId === r.id ? (
                      <input 
                        type="number"
                        value={editVal}
                        onChange={(e) => setEditVal(parseInt(e.target.value) || 0)}
                        className="w-20 text-xs p-1 rounded border border-slate-250 bg-white font-mono"
                      />
                    ) : (
                      <span className="font-mono font-semibold text-slate-700">{r.defaultSla} hours</span>
                    )}
                  </td>
                  <td className="p-4 font-mono font-medium text-slate-600">{r.threshold}% remaining</td>
                  <td className="p-4 text-right">
                    {editingId === r.id ? (
                      <button 
                        onClick={() => handleSave(r.id)}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleEdit(r.id, r.defaultSla)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded"
                      >
                        Adjust SLA
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
