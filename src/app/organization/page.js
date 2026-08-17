'use client';
import DashboardLayout from '../../components/DashboardLayout';
import { OrganizationView } from '../../components/operations/OperationalControlViews';

export default function Page() {
  return (
    <DashboardLayout>
      <OrganizationView />
    </DashboardLayout>
  );
}
