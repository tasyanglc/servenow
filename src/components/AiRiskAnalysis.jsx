'use client';
import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';
import { operationsService } from '../services/operationsService';

// Technical feature to operational translation mapper
const featureTranslationMap = {
  "dependency_delay_hours": "Upstream Dependency Delay",
  "dependency_count": "High Number of Active Dependencies",
  "dependency_pressure_score": "Critical Path Dependency Pressure",
  "current_workload_ratio": "High Owner Workload Ratio",
  "workload_pressure_score": "High Department Workload Pressure",
  "current_open_tasks": "Owner Task Overload",
  "employee_experience_years": "Task Complexity Misalignment",
  "employee_historical_sla_rate": "Owner SLA Rate Volatility",
  "reassignment_count": "Frequent Task Reassignments (Bouncing)",
  "task_queue_age_hours": "Task Queue Backlog Age",
  "queue_pressure": "High Backlog Pressure",
  "estimated_vs_sla_ratio": "Aggressive SLA vs Work Estimate",
  "cross_department_required": "Cross-Department Collaboration Overhead",
  "peak_workload_flag": "System Peak Workload Period"
};

const translateFeature = (featureName) => {
  // Strip off encoded variables if they are categories (e.g. task_type_Technical Issue -> task_type)
  const matchingKey = Object.keys(featureTranslationMap).find(key => featureName.startsWith(key));
  return matchingKey ? featureTranslationMap[matchingKey] : featureName;
};

export default function AiRiskAnalysis({ task }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [decision, setDecision] = useState(null);
  const [reason, setReason] = useState('Manager reviewed model recommendation and task context.');

  useEffect(() => {
    if (!task) return;
    setLoading(true);
    apiClient.predictTaskRisk(task)
      .then(res => {
        setPrediction(res);
        const dependencyDelayed = task.dependencies?.some(dep => dep.status === 'Delayed');
        operationsService.getCapacityRecommendations(task.id).then(candidates => {
          const owner = candidates.find(candidate => candidate.initials === task.owner?.initials);
          setDecision(operationsService.decide({ riskBand: res.risk_band, slaState: task.remaining_sla_hours < 0 ? 'OVERDUE' : task.remaining_sla_hours / task.sla_hours < .25 ? 'AT RISK' : 'ON TRACK', dependencyDelayed, workloadRatio: owner?.workloadRatio, priority: task.task_priority, complexity: task.task_complexity }));
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [task]);

  const handleConfirmAction = async () => {
    setConfirming(true);
    try {
      await operationsService.confirmIntervention({ taskId: task.id, action: decision?.action || prediction?.recommended_action, reason });
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

  // Extract primary root cause and contributing factors from SHAP list
  const rootCauses = prediction?.root_causes || [];
  const primaryCause = rootCauses.length > 0 ? rootCauses[0] : null;
  const contributingFactors = rootCauses.length > 1 ? rootCauses.slice(1) : [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
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
          <div className={`p-3.5 rounded-lg border flex justify-between items-center ${getRiskColor(prediction.risk_band)}`}>
            <div>
              <span className="block text-[9px] uppercase font-bold tracking-wider opacity-70">Risk Band</span>
              <span className="text-sm font-bold uppercase">{prediction.risk_band} RISK</span>
            </div>
            <div className="text-right">
              <span className="block text-[9px] uppercase font-bold tracking-wider opacity-70">Breach Probability</span>
              <span className="text-sm font-mono font-bold">{(prediction.sla_breach_probability * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Primary Root Cause */}
          {primaryCause && (
            <div className="p-3 bg-rose-50/30 border border-rose-100 rounded-lg">
              <span className="block text-[9px] uppercase font-bold text-rose-700 tracking-wider mb-1">Primary Root Cause</span>
              <p className="text-xs font-semibold text-slate-800">
                {translateFeature(primaryCause.feature)}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Calculated SHAP impact of +{(primaryCause.impact).toFixed(3)}
              </p>
            </div>
          )}

          {/* Contributing Factors */}
          {contributingFactors.length > 0 && (
            <div>
              <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Contributing Factors</span>
              <ul className="space-y-1">
                {contributingFactors.map((factor, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span>{translateFeature(factor.feature)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Action */}
          <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
            <span className="block text-[9px] uppercase font-bold text-indigo-600 tracking-wider mb-1">Recommended Action</span>
            <p className="text-xs font-semibold text-slate-800 mb-1">{decision?.action || prediction.recommended_action}</p>
            <p className="text-[10px] text-slate-500 mb-3">{decision?.reason || 'Model recommendation pending context.'}</p>
            <input value={reason} onChange={(event) => setReason(event.target.value)} aria-label="Manager intervention reason" className="mb-2 w-full rounded border border-slate-200 p-2 text-[11px]" />
            
            <div className="flex gap-2">
              <button 
                onClick={handleConfirmAction}
                disabled={confirming || confirmed}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all shadow-sm ${
                  confirmed 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'
                }`}
              >
                {confirming ? 'Recording...' : confirmed ? '✓ Intervention Recorded' : 'Confirm Manager Decision'}
              </button>
            </div>
          </div>

          {/* Safety Disclaimer */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[9px] text-slate-500 leading-normal flex gap-1.5 items-start">
            <span className="text-xs">⚠️</span>
            <p>
              <strong>AI Advisory Only:</strong> This model provides predictive advice based on historical indicators. It does not automatically reassign tasks, escalate queues, or affect employee performance evaluations. Final decisions rest solely with the manager.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
