'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import TaskCard from '../../components/TaskCard';

export default function MyWorkPage() {
  const { userConfig } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch only tasks assigned to the active user
    apiClient.fetchTasks({ ownerInitials: userConfig.initials }).then(data => {
      setTasks(data);
      setLoading(false);
    });
  }, [userConfig]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Work</h1>
        <p className="text-sm text-slate-500 mt-1">Tasks assigned directly to you.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-sm text-slate-500">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <span className="text-2xl mb-2">🎉</span>
          <h3 className="text-sm font-semibold text-slate-700">Inbox Zero</h3>
          <p className="text-xs text-slate-500 mt-1">You have no tasks assigned to you right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
