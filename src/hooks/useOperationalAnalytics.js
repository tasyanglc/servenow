'use client';
import { useEffect, useState } from 'react';
export function useOperationalAnalytics() { const [data, setData] = useState(); useEffect(() => { let active = true; const load = async () => { const response = await fetch('/api/analytics'); if (response.ok && active) setData(await response.json()); }; load(); const timer = setInterval(load, 30000); return () => { active = false; clearInterval(timer); }; }, []); return data; }
