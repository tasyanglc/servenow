import { getDb } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

const numericFields = ['employee_experience_years', 'employee_historical_sla_rate', 'current_open_tasks', 'current_workload_ratio', 'task_complexity', 'estimated_task_hours', 'sla_hours', 'remaining_sla_hours', 'dependency_count', 'dependency_delay_hours', 'reassignment_count', 'similar_task_avg_hours', 'employee_avg_completion_hours', 'task_queue_age_hours', 'customer_escalation_history'];
const departmentLabels = { Engineering: 'Teknologi', Implementation: 'Implementasi', Support: 'Support', 'Customer Success': 'Support', 'Sales Operations': 'Sales' };
const asNumber = (value) => Number(String(value ?? '').trim().replace(',', '.')) || 0;
const asBoolean = (value) => ['1', 'true', 'yes'].includes(String(value ?? '').trim().toLowerCase());

function normalizeRecord(record) {
  const id = String(record.task_id || '').trim();
  if (!id) return null;
  const task = Object.fromEntries(numericFields.map(field => [field, asNumber(record[field])]));
  const employeeId = String(record.employee_id || 'HISTORICAL').trim();
  const type = String(record.task_type || 'Customer Support').trim();
  const customerTier = String(record.customer_tier || 'Standard').trim();
  const actualBreached = asBoolean(record.sla_breached);
  return {
    ...task,
    id,
    task_type: type,
    task_priority: String(record.task_priority || 'Medium').trim(),
    customer_tier: customerTier,
    employee_id: employeeId,
    employee_department: String(record.employee_department || 'Support').trim(),
    cross_department_required: asBoolean(record.cross_department_required),
    peak_workload_flag: asBoolean(record.peak_workload_flag),
    title: `${type} — historical case ${id}`,
    customer: `${customerTier} demo account`,
    department: departmentLabels[record.employee_department] || 'Support',
    owner: { name: `Historical ${employeeId}`, initials: employeeId.slice(-4).toUpperCase() },
    status: 'Historical',
    source: 'historical-csv',
    historical_actual_breached: actualBreached,
    historical_outcome: actualBreached ? 'SLA breached' : 'SLA achieved',
    activity_history: [{ timestamp: new Date().toISOString(), action: 'Historical CSV record imported', user: 'Data Import' }],
    escalation_history: [],
    dependencies: [],
  };
}

export async function POST(request) {
  try {
    const { records } = await request.json();
    if (!Array.isArray(records) || !records.length) return Response.json({ error: 'Tidak ada data untuk diimpor.' }, { status: 400 });
    if (records.length > 250) return Response.json({ error: 'Maksimal 250 baris per batch.' }, { status: 400 });
    const tasks = records.map(normalizeRecord).filter(Boolean);
    if (!tasks.length) return Response.json({ error: 'Kolom task_id tidak ditemukan.' }, { status: 400 });
    const client = await getDb().connect();
    let imported = 0; let skipped = 0;
    try {
      await client.query('BEGIN');
      for (const task of tasks) {
        const result = await client.query(`INSERT INTO tasks (id, owner_initials, status, data)
          VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING RETURNING id`, [task.id, task.owner.initials, task.status, JSON.stringify(task)]);
        if (result.rowCount) imported += 1; else skipped += 1;
      }
      await client.query('COMMIT');
    } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
    return Response.json({ imported, skipped, processed: tasks.length });
  } catch (error) {
    console.error('Unable to import historical data', error);
    return Response.json({ error: 'Data historis tidak dapat diimpor. Pastikan format CSV benar.' }, { status: 500 });
  }
}
