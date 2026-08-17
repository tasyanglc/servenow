import { getDb } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await getDb().query("SELECT to_regclass('public.projects') IS NOT NULL AS projects_ready, to_regclass('public.interventions') IS NOT NULL AS interventions_ready");
    const schemaReady = rows[0]?.projects_ready && rows[0]?.interventions_ready;
    return Response.json({ connected: true, schemaReady });
  } catch (error) {
    console.error('Database status check failed', error);
    return Response.json({ connected: false, schemaReady: false, error: 'Database tidak terhubung atau migrasi belum dijalankan.' }, { status: 500 });
  }
}
