'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import TaskBoard from '../../components/TaskBoard';

export default function TeamTasksPage() {
  const { userConfig } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch tasks for the team/department of the current manager
    // We'll just fetch all tasks for the MVP to show the board
    apiClient.fetchTasks().then(data => {
      setTasks(data);
      setLoading(false);
    });
  }, [userConfig]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Team Task Board</h1>
        <p className="text-sm text-slate-500 mt-1">Operational view of all tasks in the department, grouped by SLA status.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-sm text-slate-500">Loading board...</div>
      ) : (
        <TaskBoard tasks={tasks} />
      )}
    </div>
  );
}
