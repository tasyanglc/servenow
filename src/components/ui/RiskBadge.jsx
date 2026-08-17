import React from 'react';

export default function RiskBadge({ level }) {
  const labels = { HIGH: 'TINGGI', MEDIUM: 'SEDANG', LOW: 'RENDAH' };
  const getStyle = (lvl) => {
    switch (lvl?.toUpperCase()) {
      case 'HIGH': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'LOW': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStyle(level)}`}>
      {labels[level?.toUpperCase()] || level || "BELUM DIKETAHUI"}
    </span>
  );
}
