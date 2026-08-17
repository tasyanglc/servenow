'use client';
import DashboardLayout from '../../components/DashboardLayout';
import { InterventionView } from '../../components/operations/OperationalControlViews';

export default function Page() {
  return (
    <DashboardLayout>
      <InterventionView />
    </DashboardLayout>
  );
}
