import { getDb } from '../../../lib/db';
import { ensureTaskSeed } from '../../../lib/operationalStore';

export const dynamic = 'force-dynamic';
const risk = (task) => { const ratio = Number(task.remaining_sla_hours) / Math.max(1, Number(task.sla_hours)); return Number(task.remaining_sla_hours) <= 0 ? 'OVERDUE' : ratio <= .25 ? 'AT RISK' : 'ON TRACK'; };

export async function GET() {
  try {
    const db = getDb(); await ensureTaskSeed(db);
    const [{ rows }, { rows: deals }, { rows: projects }] = await Promise.all([db.query('SELECT data FROM tasks'), db.query('SELECT value, expected_revenue, stage FROM deals'), db.query('SELECT status FROM projects')]);
    const tasks = rows.map(row => row.data); const total = Math.max(tasks.length, 1);
    const groups = {}; const buckets = [['0–4h', 0, 4], ['4–12h', 4, 12], ['12–24h', 12, 24], ['24–48h', 24, 48], ['48h+', 48, Infinity]];
    tasks.forEach(task => { const key = task.department || task.employee_department || 'Other'; if (!groups[key]) groups[key] = { name: key, total: 0, openTasks: 0, achieved: 0, atRisk: 0, workload: [] }; const group = groups[key]; group.total += 1; group.workload.push(Number(task.current_workload_ratio) || 0); if (task.historical_actual_breached === false || task.sla_breached === 0) group.achieved += 1; const state = risk(task); if (state !== 'ON TRACK') { group.openTasks += 1; group.atRisk += 1; } });
    const deptSummary = Object.values(groups).map(group => ({ ...group, slaAchievement: Math.round(group.achieved / Math.max(group.total, 1) * 100), averageWorkload: Math.round(group.workload.reduce((sum, value) => sum + value, 0) / Math.max(group.workload.length, 1) * 100) }));
    const trend = buckets.map(([label, from, to]) => { const items = tasks.filter(task => { const age = Number(task.task_queue_age_hours) || 0; return age >= from && age < to; }); const achieved = items.filter(task => task.historical_actual_breached === false || task.sla_breached === 0).length; return { label, value: Math.round(achieved / Math.max(items.length, 1) * 100), count: items.length }; });
    const exceptions = tasks.filter(task => risk(task) !== 'ON TRACK').sort((a,b) => Number(a.remaining_sla_hours) - Number(b.remaining_sla_hours)).slice(0, 8).map(task => ({ ...task, status: risk(task), owner: task.owner?.name || task.employee_id }));
    const atRisk = exceptions.length; const overdue = tasks.filter(task => risk(task) === 'OVERDUE').length; const historical = tasks.filter(task => task.source === 'historical-csv'); const achieved = historical.filter(task => task.historical_actual_breached === false).length;
    return Response.json({ taskCount: tasks.length, slaAchievement: Math.round(achieved / Math.max(historical.length, 1) * 100), weeklyExceptions: atRisk, criticalExceptions: exceptions, deptSummary, trend, directorDependency: `${Math.round(atRisk / total * 100)}%`, pipelineValue: deals.reduce((sum, deal) => sum + Number(deal.value || 0), 0), weightedPipeline: deals.reduce((sum, deal) => sum + Number(deal.expected_revenue || 0), 0), dealStages: Object.entries(deals.reduce((acc, deal) => ({ ...acc, [deal.stage]: (acc[deal.stage] || 0) + Number(deal.value || 0) }), {})).map(([name, value]) => ({ name, value })), projectSummary: { total: projects.length, completed: projects.filter(project => project.status === 'Completed').length }, updatedAt: new Date().toISOString() });
  } catch (error) { console.error('Unable to calculate analytics', error); return Response.json({ error: 'Analitik tidak dapat dimuat.' }, { status: 500 }); }
}
