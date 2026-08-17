import { getDb } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await getDb().query('SELECT * FROM projects ORDER BY created_at DESC');
    return Response.json(rows.map(row => ({ ...row, customerId: row.customer_id, packageId: row.package_id, workflowIds: row.workflow_ids, taskIds: row.task_ids, generatedTasks: row.generated_tasks, slaId: row.sla_id, createdAt: row.created_at })));
  } catch (error) {
    console.error('Unable to load projects', error);
    return Response.json({ error: 'Database tidak dapat memuat proyek. Periksa DATABASE_URL dan jalankan migrasi.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const project = await request.json();
    if (!project.id || !project.customerId || !project.packageId || !project.name) return Response.json({ error: 'Data proyek belum lengkap.' }, { status: 400 });
    const { rows } = await getDb().query(`INSERT INTO projects (id, customer_id, package_id, name, scope, workflow_ids, task_ids, milestones, generated_tasks, sla_id, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, scope=EXCLUDED.scope, task_ids=EXCLUDED.task_ids, milestones=EXCLUDED.milestones, generated_tasks=EXCLUDED.generated_tasks, status=EXCLUDED.status, updated_at=NOW()
      RETURNING *`, [project.id, project.customerId, project.packageId, project.name, project.scope || null, JSON.stringify(project.workflowIds || []), JSON.stringify(project.taskIds || []), JSON.stringify(project.milestones || []), JSON.stringify(project.generatedTasks || []), project.slaId || null, project.status || 'In progress']);
    return Response.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Unable to save project', error);
    return Response.json({ error: 'Database tidak dapat menyimpan proyek. Periksa DATABASE_URL dan jalankan migrasi.' }, { status: 500 });
  }
}
