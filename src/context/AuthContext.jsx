'use client';
import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext({});

const common = ['/role-dashboard', '/my-work', '/tasks', '/projects', '/workflows', '/knowledge'];
const manager = [...common, '/team-dashboard', '/interventions', '/escalations'];

export const ROLE_CONFIG = {
  'Direktur Utama': { name: 'Arif Pratama', title: 'Direktur Utama', initials: 'DU', color: 'bg-indigo-600', level: 'C-Level', division: 'Executive', defaultPath: '/role-dashboard', allowedPaths: [...common, '/overview', '/team-dashboard', '/interventions', '/escalations', '/sales', '/sales/pipeline', '/sales/deals', '/customer-zero', '/reports'] },
  'Direktur Teknologi': { name: 'Nadia Putri', title: 'Direktur Teknologi & Product', initials: 'DT', color: 'bg-violet-600', level: 'C-Level', division: 'Teknologi', defaultPath: '/role-dashboard', allowedPaths: [...manager, '/overview', '/reports'] },
  'Direktur Operasional': { name: 'Budi Santoso', title: 'Direktur Operasional', initials: 'DO', color: 'bg-emerald-600', level: 'C-Level', division: 'Operasional', defaultPath: '/role-dashboard', allowedPaths: [...manager, '/overview', '/customer-zero', '/reports'] },
  'Manager Teknologi': { name: 'Dimas Kurniawan', title: 'Manager Teknologi', initials: 'MT', color: 'bg-violet-500', level: 'Manager', division: 'Teknologi', defaultPath: '/role-dashboard', allowedPaths: manager },
  'Manager Implementasi': { name: 'Andi Pratama', title: 'Manager Implementasi', initials: 'MI', color: 'bg-blue-500', level: 'Manager', division: 'Implementasi', defaultPath: '/role-dashboard', allowedPaths: manager },
  'Manager Support': { name: 'Maya Lestari', title: 'Manager Support', initials: 'MS', color: 'bg-cyan-600', level: 'Manager', division: 'Support', defaultPath: '/role-dashboard', allowedPaths: manager },
  'Manager Sales': { name: 'Sarah Lee', title: 'Manager Sales', initials: 'MZ', color: 'bg-orange-500', level: 'Manager', division: 'Sales', defaultPath: '/role-dashboard', allowedPaths: [...common, '/sales', '/sales/pipeline', '/sales/deals', '/reports'] },
  'Manager Administrasi': { name: 'Ratna Dewi', title: 'Manager Administrasi', initials: 'MA', color: 'bg-slate-600', level: 'Manager', division: 'Administrasi', defaultPath: '/role-dashboard', allowedPaths: [...common, '/admin/users', '/admin/roles', '/admin/sla-rules', '/admin/escalation-rules', '/admin/audit-log'] },
  'Karyawan Teknologi': { name: 'Fajar Ramadhan', title: 'Software Engineer', initials: 'FT', color: 'bg-violet-400', level: 'Employee', division: 'Teknologi', defaultPath: '/role-dashboard', allowedPaths: common },
  'Karyawan Implementasi': { name: 'Citra Wulandari', title: 'Implementation Specialist', initials: 'CW', color: 'bg-blue-400', level: 'Employee', division: 'Implementasi', defaultPath: '/role-dashboard', allowedPaths: common },
  'Karyawan Support': { name: 'Siti Aisyah', title: 'Support Specialist', initials: 'SA', color: 'bg-cyan-500', level: 'Employee', division: 'Support', defaultPath: '/role-dashboard', allowedPaths: common },
  'Karyawan Sales': { name: 'Rian Pratama', title: 'Sales Executive', initials: 'RP', color: 'bg-orange-400', level: 'Employee', division: 'Sales', defaultPath: '/role-dashboard', allowedPaths: [...common, '/sales', '/sales/pipeline', '/sales/deals'] },
  'Karyawan Administrasi': { name: 'Lina Kartika', title: 'Administration Officer', initials: 'LK', color: 'bg-slate-500', level: 'Employee', division: 'Administrasi', defaultPath: '/role-dashboard', allowedPaths: common }
};

export const AuthProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState('Direktur Utama');
  const router = useRouter();

  const changeRole = (role) => {
    setActiveRole(role);
    router.push(ROLE_CONFIG[role].defaultPath);
  };

  return (
    <AuthContext.Provider value={{ 
      activeRole, 
      changeRole, 
      userConfig: ROLE_CONFIG[activeRole], 
      allRoles: ROLE_CONFIG 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
