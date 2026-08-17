'use client';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { mockTasks } from '../../lib/mockData';
import TaskCard from '../../components/TaskCard';
import { calculateTaskStatus } from '../../lib/taskUtils';

export default function Page() {
  const { activeRole } = useAuth();
  
  const onTrackTasks = mockTasks.filter(t => calculateTaskStatus(t.remaining_sla_hours, t.sla_hours) === "ON TRACK");
  const atRiskTasks = mockTasks.filter(t => calculateTaskStatus(t.remaining_sla_hours, t.sla_hours) === "AT RISK");
  const overdueTasks = mockTasks.filter(t => calculateTaskStatus(t.remaining_sla_hours, t.sla_hours) === "OVERDUE");

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">All Tasks</h1>
          <p className="text-sm text-slate-500">Lihat tugas yang sedang dikerjakan oleh seluruh tim.</p>
        </div>
        <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 text-xs font-semibold shadow-sm">
          Peran aktif: {activeRole}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
        
        {/* On Track Column */}
        <div className="flex flex-col gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold text-slate-700 tracking-wider">SESUAI RENCANA</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{onTrackTasks.length}</span>
          </div>
          {onTrackTasks.map(task => <TaskCard key={task.id} task={task} />)}
          {onTrackTasks.length === 0 && <div className="text-center text-xs text-slate-400 py-4">Belum ada tugas</div>}
        </div>

        {/* At Risk Column */}
        <div className="flex flex-col gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-xs font-bold text-slate-700 tracking-wider">BERISIKO</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{atRiskTasks.length}</span>
          </div>
          {atRiskTasks.map(task => <TaskCard key={task.id} task={task} />)}
          {atRiskTasks.length === 0 && <div className="text-center text-xs text-slate-400 py-4">Belum ada tugas</div>}
        </div>

        {/* Overdue Column */}
        <div className="flex flex-col gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-xs font-bold text-slate-700 tracking-wider">TERLAMBAT</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{overdueTasks.length}</span>
          </div>
          {overdueTasks.map(task => <TaskCard key={task.id} task={task} />)}
          {overdueTasks.length === 0 && <div className="text-center text-xs text-slate-400 py-4">Belum ada tugas</div>}
        </div>

      </div>
    </DashboardLayout>
  );
}
