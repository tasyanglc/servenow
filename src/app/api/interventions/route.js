import { getDb } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await getDb().query('SELECT id, task_id AS "taskId", action, reason, actor, status, created_at AS timestamp FROM interventions ORDER BY created_at DESC');
    return Response.json(rows);
  } catch (error) {
    console.error('Unable to load interventions', error);
    return Response.json({ error: 'Database tidak dapat memuat tindakan.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const item = await request.json();
    if (!item.id || !item.taskId || !item.action || !item.reason || !item.actor) return Response.json({ error: 'Data tindakan belum lengkap.' }, { status: 400 });
    const { rows } = await getDb().query('INSERT INTO interventions (id, task_id, action, reason, actor, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, task_id AS "taskId", action, reason, actor, status, created_at AS timestamp', [item.id, item.taskId, item.action, item.reason, item.actor, item.status || 'Monitoring']);
    return Response.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Unable to save intervention', error);
    return Response.json({ error: 'Database tidak dapat menyimpan tindakan.' }, { status: 500 });
  }
}
