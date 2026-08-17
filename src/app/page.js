'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { userConfig, isRoleReady } = useAuth();
  
  useEffect(() => {
    if (isRoleReady && userConfig) {
      router.push(userConfig.defaultPath);
    }
  }, [isRoleReady, userConfig, router]);

  return <div className="h-screen w-screen flex items-center justify-center bg-[#F4F7FE]">Loading ServeNow Workforce OS...</div>;
}
