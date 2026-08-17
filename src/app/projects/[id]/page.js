'use client';

import { use } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import ProjectDetailWorkspace from '../../../components/operations/ProjectDetailWorkspace';

export default function Page({ params }) {
  return <DashboardLayout><ProjectDetailWorkspace id={use(params).id} /></DashboardLayout>;
}
