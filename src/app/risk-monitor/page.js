'use client';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';

export default function RiskMonitorPage() {
  const { activeRole } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch tasks asynchronously
    const loadData = async () => {
      setIsLoading(true);
      try {
        const fetchedTasks = await apiClient.fetchTasks();
        setTasks(fetchedTasks);
        
        // 2. Fetch ML predictions for each task in parallel
        const predictionPromises = fetchedTasks.map(async (task) => {
          const result = await apiClient.predictTaskRisk(task);
          return { taskId: task.id, prediction: result };
        });
        
        const resultsArray = await Promise.all(predictionPromises);
        
        // Convert array to dictionary for fast lookup
        const predictionDict = {};
        resultsArray.forEach(item => {
          predictionDict[item.taskId] = item.prediction;
        });
        
        setPredictions(predictionDict);
      } catch (error) {
        console.error("Failed to load risk data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Helpers for visual styling
  const getRiskColor = (band) => {
    switch(band) {
      case "High": return "text-rose-700 bg-rose-50 border-rose-200";
      case "Medium": return "text-amber-700 bg-amber-50 border-amber-200";
      case "Low": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      default: return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">AI Risk Monitor</h1>
          <p className="text-sm text-slate-500">Real-time XGBoost predictions based on SHAP local interpretability.</p>
        </div>
        <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 text-xs font-semibold shadow-sm flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
           Live Model Connection
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 text-sm">Querying XGBoost Model API...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {tasks.map(task => {
            const pred = predictions[task.id];
            
            return (
              <div key={task.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col lg:flex-row gap-6">
                
                {/* Left side: Task Summary */}
                <div className="lg:w-1/3 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{task.id}</span>
                      <span className="text-[9px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{task.task_type}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">{task.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">Owner: {task.owner?.name}</p>
                  </div>
                </div>

                {/* Right side: AI Insights */}
                <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Metric 1: Risk Band */}
                  <div className={`p-4 rounded-lg border ${getRiskColor(pred?.risk_band)} flex flex-col justify-center items-center text-center`}>
                     <span className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">Model Risk Band</span>
                     <span className="text-xl font-black">{pred?.risk_band || "Unknown"}</span>
                     {pred?.sla_breach_probability !== null && (
                       <span className="text-[10px] mt-1 font-medium">Prob: {(pred.sla_breach_probability * 100).toFixed(1)}%</span>
                     )}
                  </div>

                  {/* Metric 2: Root Causes (SHAP) */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Root Cause (SHAP)
                    </span>
                    {pred?.root_causes?.length > 0 ? (
                      <ul className="flex flex-col gap-1.5">
                        {pred.root_causes.map((rc, idx) => (
                          <li key={idx} className="text-[10px] text-slate-700 flex justify-between items-center bg-white px-2 py-1 rounded border border-slate-100">
                            <span className="truncate max-w-[120px]" title={rc.feature}>{rc.feature}</span>
                            <span className="font-mono text-[9px] text-indigo-500">+{rc.impact.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No significant drivers detected.</span>
                    )}
                  </div>

                  {/* Metric 3: Action */}
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-2 block flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Recommended Action
                      </span>
                      <p className="text-xs font-bold text-indigo-900 leading-tight">
                        {pred?.recommended_action || "Manual Review Required"}
                      </p>
                    </div>
                    {/* PRD constraint: Manager must confirm action */}
                    <button className="w-full mt-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded shadow-sm transition-colors">
                      Confirm Action
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
