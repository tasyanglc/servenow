import { getDb } from '../../../../lib/db';
import { ensureTaskSeed } from '../../../../lib/operationalStore';

export const dynamic = 'force-dynamic';
const rowToTask = (row) => ({ ...row.data, id: row.id, status: row.status || row.data.status, deadline: row.deadline ? row.deadline.toISOString().slice(0, 10) : row.data.deadline, projectId: row.project_id, updatedAt: row.updated_at });

export async function GET(_request, { params }) {
  try { const { id } = await params; const db = getDb(); await ensureTaskSeed(db); const { rows } = await db.query('SELECT * FROM tasks WHERE id=$1', [id]); return rows[0] ? Response.json(rowToTask(rows[0])) : Response.json({ error: 'Tugas tidak ditemukan.' }, { status: 404 }); }
  catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params; const patch = await request.json(); const db = getDb(); const { rows } = await db.query('SELECT * FROM tasks WHERE id=$1', [id]);
    if (!rows[0]) return Response.json({ error: 'Tugas tidak ditemukan.' }, { status: 404 });
    const current = rowToTask(rows[0]); const merged = { ...current, ...patch, owner: patch.owner || current.owner, activity_history: patch.activity_history || current.activity_history };
    const deadline = /^\d{4}-\d{2}-\d{2}$/.test(merged.deadline || '') ? merged.deadline : null;
    const saved = await db.query(`UPDATE tasks SET project_id=$2, owner_initials=$3, status=$4, deadline=$5, data=$6, updated_at=NOW() WHERE id=$1 RETURNING *`, [id, merged.projectId || current.projectId || null, merged.owner?.initials || null, merged.status || 'Open', deadline, JSON.stringify(merged)]);
    return Response.json(rowToTask(saved.rows[0]));
  } catch (error) { return Response.json({ error: 'Tugas tidak dapat diperbarui.' }, { status: 500 }); }
}
