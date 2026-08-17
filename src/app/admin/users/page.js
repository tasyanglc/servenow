'use client';
import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import PageHeader from '../../../components/ui/PageHeader';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: "Andi Pratama", email: "andi@servenow.io", role: "Manager", department: "Implementation", status: "Active", manager: "Director" },
    { id: 2, name: "Budi Santoso", email: "budi@servenow.io", role: "Manager", department: "Support", status: "Active", manager: "Director" },
    { id: 3, name: "Rian Pratama", email: "rian@servenow.io", role: "Employee", department: "Support", status: "Active", manager: "Budi Santoso" },
    { id: 4, name: "Sarah Lee", email: "sarah@servenow.io", role: "Sales", department: "Sales", status: "Active", manager: "Director" },
    { id: 5, name: "System Admin", email: "admin@servenow.io", role: "Admin", department: "IT Ops", status: "Active", manager: "None" }
  ]);

  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Employee', department: 'Support', manager: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleStatus = (id) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
    ));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const userObj = {
      id: users.length + 1,
      ...newUser,
      status: "Active"
    };

    setUsers([...users, userObj]);
    setNewUser({ name: '', email: '', role: 'Employee', department: 'Support', manager: '' });
    setShowAddForm(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <div className="flex justify-between items-center">
          <PageHeader 
            title="User Directory" 
            subtitle="Manage user accounts, assign departments, and configure reporting structures."
          />
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition-colors shadow-sm"
          >
            {showAddForm ? "Cancel" : "Add User"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddUser} className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 max-w-xl">
            <h3 className="text-xs font-bold uppercase text-slate-400">New User Definition</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-250 bg-white"
                  placeholder="e.g. Maya Lestari"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-250 bg-white"
                  placeholder="e.g. maya@servenow.io"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Role</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-250 bg-white"
                >
                  <option value="Director">Director</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                  <option value="Sales">Sales Executive</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Department</label>
                <select 
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-250 bg-white"
                >
                  <option value="Support">Support</option>
                  <option value="Implementation">Implementation</option>
                  <option value="Data Ops">Data Ops</option>
                  <option value="Sales">Sales</option>
                  <option value="IT Ops">IT Ops</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Reporting Manager</label>
                <input 
                  type="text" 
                  value={newUser.manager}
                  onChange={(e) => setNewUser({ ...newUser, manager: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-250 bg-white"
                  placeholder="e.g. Budi Santoso"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition-colors shadow-sm"
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/20">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Manager</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-800">{u.name}</td>
                  <td className="p-4 text-slate-500 font-mono">{u.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{u.department}</td>
                  <td className="p-4 text-slate-600">{u.manager}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-150 text-slate-500'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => toggleStatus(u.id)}
                      className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
                        u.status === 'Active' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {u.status === 'Active' ? "Deactivate" : "Activate"}
                    </button>
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
