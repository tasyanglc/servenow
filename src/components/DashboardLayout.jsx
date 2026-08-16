import React from 'react';
import AppShell from './layout/AppShell';

// We map the old DashboardLayout directly to AppShell to avoid refactoring all page.js files
export default function DashboardLayout({ children }) {
  return <AppShell>{children}</AppShell>;
}
