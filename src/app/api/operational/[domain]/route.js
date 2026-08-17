import { getDb } from '../../../../lib/db';
import { ensureOperationalSeed, supportedDomains } from '../../../../lib/operationalStore';

export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  try {
    const { domain } = await params;
    if (!supportedDomains.includes(domain)) return Response.json({ error: 'Domain tidak ditemukan.' }, { status: 404 });
    const db = getDb(); await ensureOperationalSeed(db, domain);
    const { rows } = await db.query('SELECT id, data, created_at, updated_at FROM operational_records WHERE domain=$1 ORDER BY id', [domain]);
    return Response.json(rows.map(row => ({ ...row.data, id: row.id, createdAt: row.created_at, updatedAt: row.updated_at })));
  } catch (error) {
    console.error('Unable to load operational domain', error);
    return Response.json({ error: 'Data operasional tidak dapat dimuat.' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { domain } = await params; const patch = await request.json();
    if (!supportedDomains.includes(domain) || !patch.id) return Response.json({ error: 'Data tidak lengkap.' }, { status: 400 });
    const db = getDb(); await ensureOperationalSeed(db, domain);
    const existing = await db.query('SELECT data FROM operational_records WHERE domain=$1 AND id=$2', [domain, patch.id]);
    if (!existing.rows[0]) return Response.json({ error: 'Data tidak ditemukan.' }, { status: 404 });
    const data = { ...existing.rows[0].data, ...patch };
    const { rows } = await db.query('UPDATE operational_records SET data=$3, updated_at=NOW() WHERE domain=$1 AND id=$2 RETURNING id,data,updated_at', [domain, patch.id, JSON.stringify(data)]);
    return Response.json({ ...rows[0].data, id: rows[0].id, updatedAt: rows[0].updated_at });
  } catch (error) { return Response.json({ error: 'Data operasional tidak dapat diperbarui.' }, { status: 500 }); }
}
