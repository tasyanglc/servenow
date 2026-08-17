'use client';
import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext({});

export const ROLE_CONFIG = {
  "Director": {
    name: "Director",
    title: "CEO",
    initials: "D",
    color: "bg-indigo-500",
    defaultPath: "/overview",
    allowedPaths: [
      "/overview", "/tasks", "/risk-monitor", "/root-causes", "/sales", 
      "/customer-zero", "/organization", "/escalations"
    ]
  },
  "Manager": {
    name: "Budi Santoso",
    title: "Operations Manager",
    initials: "BS",
    color: "bg-emerald-500",
    defaultPath: "/team-dashboard",
    allowedPaths: [
      "/team-dashboard", "/my-work", "/team-tasks", "/risk-monitor", 
      "/interventions", "/workload", "/escalations"
    ]
  },
  "Employee": {
    name: "Rian Pratama",
    title: "L2 Specialist",
    initials: "RP",
    color: "bg-sky-500",
    defaultPath: "/my-work",
    allowedPaths: [
      "/my-work", "/my-performance", "/team-status"
    ]
  },
  "Sales": {
    name: "Sarah Lee",
    title: "Sales Executive",
    initials: "SL",
    color: "bg-orange-500",
    defaultPath: "/sales/pipeline",
    allowedPaths: [
      "/sales", "/sales/pipeline", "/customer-zero", "/my-work"
    ]
  },
  "Admin": {
    name: "System Admin",
    title: "IT Operations",
    initials: "AD",
    color: "bg-slate-700",
    defaultPath: "/admin/users",
    allowedPaths: [
      "/admin/users", "/admin/roles", "/admin/sla-rules", "/admin/escalation-rules", "/admin/audit-log"
    ]
  }
};

export const AuthProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState("Director");
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
