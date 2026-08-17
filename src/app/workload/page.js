'use client';
import DashboardLayout from '../../components/DashboardLayout';
import { WorkloadView } from '../../components/operations/OperationalControlViews';

export default function Page() {
  return (
    <DashboardLayout>
      <WorkloadView />
    </DashboardLayout>
  );
}
