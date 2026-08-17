'use client';

import { useMemo, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';

const requiredColumns = ['task_id', 'task_type', 'task_priority', 'employee_department', 'sla_hours', 'remaining_sla_hours', 'sla_breached'];
const batchSize = 250;

function parseCsv(content) {
  const lines = content.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  const headers = lines[0]?.split(',').map(value => value.trim()) || [];
  return lines.slice(1).map(line => Object.fromEntries(headers.map((header, index) => [header, line.split(',')[index]?.trim() ?? ''])));
}

export default function HistoricalImportPage() {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState('');
  const [notice, setNotice] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const valid = useMemo(() => rows.filter(row => row.task_id && row.task_type && row.sla_hours).length, [rows]);
  const labelStats = useMemo(() => ({ breached: rows.filter(row => row.sla_breached === '1').length, achieved: rows.filter(row => row.sla_breached === '0').length }), [rows]);

  const chooseFile = async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    const content = await file.text(); const parsed = parseCsv(content);
    const missing = requiredColumns.filter(column => !Object.keys(parsed[0] || {}).includes(column));
    if (missing.length) { setRows([]); setNotice(`Kolom wajib belum ada: ${missing.join(', ')}`); return; }
    setRows(parsed); setFileName(file.name); setNotice(`${parsed.length.toLocaleString('id-ID')} baris siap ditinjau. Data ini akan diberi label historis/demo.`);
  };

  const importData = async () => {
    if (!valid || isImporting) return;
    setIsImporting(true); setNotice('Mengimpor data historis…');
    let imported = 0; let skipped = 0;
    try {
      for (let start = 0; start < rows.length; start += batchSize) {
        const response = await fetch('/api/import/historical', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ records: rows.slice(start, start + batchSize) }) });
        const result = await response.json(); if (!response.ok) throw new Error(result.error);
        imported += result.imported; skipped += result.skipped;
        setNotice(`Mengimpor ${Math.min(start + batchSize, rows.length).toLocaleString('id-ID')} dari ${rows.length.toLocaleString('id-ID')} baris…`);
      }
      setNotice(`Selesai: ${imported.toLocaleString('id-ID')} task historis diimpor. ${skipped.toLocaleString('id-ID')} ID yang sudah ada dilewati.`);
    } catch (error) { setNotice(error.message || 'Import gagal.'); } finally { setIsImporting(false); }
  };

  return <DashboardLayout><section className="mx-auto max-w-6xl space-y-6"><div><h1 className="text-2xl font-semibold tracking-tight text-slate-950">Import Historical Data</h1><p className="mt-1 text-sm text-slate-500">Masukkan CSV historis untuk demo dan validasi model. Data baru dari operasional tetap dibuat melalui aplikasi.</p></div><article className="rounded-xl border border-blue-100 bg-blue-50/60 p-5"><h2 className="text-sm font-semibold text-slate-900">Apa yang akan terjadi?</h2><ol className="mt-3 list-decimal space-y-1 pl-5 text-xs leading-5 text-slate-600"><li>Sistem mengecek kolom CSV dan menampilkan preview.</li><li>Setiap baris disimpan sebagai task berlabel <b>historical/demo</b>.</li><li>Model dapat menghitung risiko SLA ketika task dibuka; hasil aktual historis disimpan terpisah untuk pembandingan.</li></ol></article><article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm"><label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-blue-300 bg-slate-50 px-6 py-10 text-center"><span className="text-sm font-semibold text-slate-800">Pilih file CSV</span><span className="mt-1 text-xs text-slate-500">Contoh: servenow_5000_data_training.csv</span><input type="file" accept=".csv,text/csv" className="sr-only" onChange={chooseFile} /></label>{notice && <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">{notice}</p>}</article>{rows.length > 0 && <><div className="grid gap-3 sm:grid-cols-3"><Metric label="Baris terbaca" value={rows.length.toLocaleString('id-ID')} /><Metric label="SLA breach historis" value={labelStats.breached.toLocaleString('id-ID')} tone="text-rose-600" /><Metric label="SLA tercapai historis" value={labelStats.achieved.toLocaleString('id-ID')} tone="text-emerald-600" /></div><article className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4"><div><h2 className="text-sm font-semibold">Preview: {fileName}</h2><p className="mt-1 text-xs text-slate-500">{valid.toLocaleString('id-ID')} baris memiliki data inti yang valid.</p></div><button disabled={isImporting || !valid} onClick={importData} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50">{isImporting ? 'Importing…' : `Import ${valid.toLocaleString('id-ID')} historical tasks`}</button></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase text-slate-400"><tr><th className="p-4">Task ID</th><th>Type</th><th>Department</th><th>Priority</th><th>Remaining SLA</th><th>Actual result</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.slice(0, 10).map(row => <tr key={row.task_id}><td className="p-4 font-medium text-blue-600">{row.task_id}</td><td>{row.task_type}</td><td>{row.employee_department}</td><td>{row.task_priority}</td><td>{row.remaining_sla_hours}h</td><td><span className={`rounded px-2 py-1 text-[10px] font-semibold ${row.sla_breached === '1' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>{row.sla_breached === '1' ? 'Breached' : 'Achieved'}</span></td></tr>)}</tbody></table></div></article></>}</section></DashboardLayout>;
}

const Metric = ({ label, value, tone = 'text-slate-950' }) => <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">{label}</p><p className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</p></article>;
