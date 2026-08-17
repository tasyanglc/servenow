'use client';
import DashboardLayout from '../../components/DashboardLayout';
import { RootCauseView } from '../../components/operations/OperationalControlViews';

export default function Page() {
  return (
    <DashboardLayout>
      <RootCauseView />
    </DashboardLayout>
  );
}
