'use client';
import DashboardLayout from '../../components/DashboardLayout';
import { EscalationView } from '../../components/operations/OperationalControlViews';

export default function Page() {
  return (
    <DashboardLayout>
      <EscalationView />
    </DashboardLayout>
  );
}
