import { getDb } from '../../../lib/db';
import { ensureTaskSeed } from '../../../lib/operationalStore';

export const dynamic = 'force-dynamic';

const rowToTask = (row) => ({ ...row.data, id: row.id, status: row.status || row.data.status, deadline: row.deadline ? row.deadline.toISOString().slice(0, 10) : row.data.deadline, projectId: row.project_id, updatedAt: row.updated_at });

export async function GET(request) {
  try {
    const db = getDb(); await ensureTaskSeed(db);
    const { searchParams } = new URL(request.url); const ownerInitials = searchParams.get('ownerInitials'); const projectId = searchParams.get('projectId');
    const filters = []; const values = [];
    if (ownerInitials) { values.push(ownerInitials); filters.push(`owner_initials = $${values.length}`); }
    if (projectId) { values.push(projectId); filters.push(`project_id = $${values.length}`); }
    const { rows } = await db.query(`SELECT * FROM tasks ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''} ORDER BY deadline NULLS LAST, updated_at DESC`, values);
    return Response.json(rows.map(rowToTask));
  } catch (error) {
    console.error('Unable to load tasks', error);
    return Response.json({ error: 'Database tidak dapat memuat tugas. Periksa DATABASE_URL dan jalankan migrasi.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const task = await request.json();
    if (!task.id || !task.title) return Response.json({ error: 'ID dan judul tugas wajib diisi.' }, { status: 400 });
    const db = getDb(); const deadline = /^\d{4}-\d{2}-\d{2}$/.test(task.deadline || '') ? task.deadline : null;
    const { rows } = await db.query(`INSERT INTO tasks (id, project_id, owner_initials, status, deadline, data) VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (id) DO UPDATE SET project_id=EXCLUDED.project_id, owner_initials=EXCLUDED.owner_initials, status=EXCLUDED.status, deadline=EXCLUDED.deadline, data=EXCLUDED.data, updated_at=NOW() RETURNING *`, [task.id, task.projectId || null, task.owner?.initials || null, task.status || 'Open', deadline, JSON.stringify(task)]);
    return Response.json(rowToTask(rows[0]), { status: 201 });
  } catch (error) {
    console.error('Unable to save task', error);
    return Response.json({ error: 'Tugas tidak dapat disimpan.' }, { status: 500 });
  }
}
