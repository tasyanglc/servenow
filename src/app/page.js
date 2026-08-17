'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { userConfig, isRoleReady } = useAuth();
  
  useEffect(() => {
    if (isRoleReady && userConfig) {
      const landingPage = userConfig.level === 'C-Level' ? '/overview' : userConfig.level === 'Manager' ? '/team-dashboard' : '/my-work';
      router.push(landingPage);
    }
  }, [isRoleReady, userConfig, router]);

  return <div className="h-screen w-screen flex items-center justify-center bg-[#F4F7FE]">Loading ServeNow Workforce OS...</div>;
}
