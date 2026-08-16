'use client';
import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';

export default function AiRiskAnalysis({ task }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!task) return;
    setLoading(true);
    apiClient.predictTaskRisk(task)
      .then(res => {
        setPrediction(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [task]);

  const handleConfirmAction = async () => {
    setConfirming(true);
    try {
      // Simulate confirmed action payload to API
      await apiClient.updateTask(task.id, {
        ai_action_confirmed: true,
        confirmed_action: prediction?.recommended_action
      });
      setConfirmed(true);
    } catch (err) {
      console.error(err);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">AI Risk Analysis</h3>
        <div className="flex flex-col items-center justify-center py-6 gap-2">
          <div className="w-5 h-5 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500">Querying XGBoost model...</span>
        </div>
      </div>
    );
  }

  const isOffline = prediction?.risk_band?.includes("Offline") || !prediction || prediction.sla_breach_probability === null;

  const getRiskColor = (band) => {
    switch (band) {
      case "High": return "text-rose-700 bg-rose-50 border-rose-200";
      case "Medium": return "text-amber-700 bg-amber-50 border-amber-200";
      case "Low": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      default: return "text-slate-500 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
        <h3 className="text-sm font-semibold text-slate-800">AI Risk Analysis</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">XGBoost / SHAP</span>
      </div>

      {isOffline ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
          <span className="text-lg">🔌</span>
          <h4 className="text-xs font-semibold text-slate-700 mt-1">ML Service Unavailable</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Could not reach the SLA breach prediction backend.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Risk Band & Probability */}
          <div className={`p-4 rounded-lg border flex justify-between items-center ${getRiskColor(prediction.risk_band)}`}>
            <div>
              <span className="block text-[9px] uppercase font-bold tracking-wider opacity-70">Risk Band</span>
              <span className="text-base font-bold">{prediction.risk_band}</span>
            </div>
            <div className="text-right">
              <span className="block text-[9px] uppercase font-bold tracking-wider opacity-70">Breach Probability</span>
              <span className="text-base font-mono font-bold">{(prediction.sla_breach_probability * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* SHAP Root Causes */}
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Root Cause Analysis (SHAP)</span>
            {prediction.root_causes && prediction.root_causes.length > 0 ? (
              <div className="space-y-1.5">
                {prediction.root_causes.map((rc, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="font-medium text-slate-700">{rc.feature}</span>
                    <span className="font-mono text-[10px] text-indigo-600">+{rc.impact.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No significant root causes identified.</p>
            )}
          </div>

          {/* Recommended Action */}
          <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
            <span className="block text-[10px] uppercase font-bold text-indigo-600 mb-1">Recommended Action</span>
            <p className="text-xs font-semibold text-slate-800">{prediction.recommended_action}</p>
            
            <button 
              onClick={handleConfirmAction}
              disabled={confirming || confirmed}
              className={`w-full mt-3 py-2 rounded text-xs font-bold transition-all shadow-sm ${
                confirmed 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'
              }`}
            >
              {confirming ? 'Confirming...' : confirmed ? '✓ Action Confirmed' : 'Confirm Action'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
