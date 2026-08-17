import { cookies } from 'next/headers';
import { getDb } from '../../../../lib/db';
import { decodeSession, encodeSession } from '../../../../lib/demoSession';
import { ensureOperationalSeed } from '../../../../lib/operationalStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = decodeSession((await cookies()).get('servenow-demo-session')?.value);
  if (!session) return Response.json({ user: null });
  const db = getDb(); await ensureOperationalSeed(db, 'users');
  const { rows } = await db.query("SELECT id, data FROM operational_records WHERE domain='users' AND id=$1", [session.id]);
  return Response.json({ user: rows[0] ? { ...rows[0].data, id: rows[0].id } : null });
}

export async function POST(request) {
  const { email } = await request.json();
  if (!email) return Response.json({ error: 'Email wajib diisi.' }, { status: 400 });
  const db = getDb(); await ensureOperationalSeed(db, 'users');
  const { rows } = await db.query("SELECT id, data FROM operational_records WHERE domain='users' AND lower(data->>'email')=lower($1)", [email.trim()]);
  const user = rows[0] && { ...rows[0].data, id: rows[0].id };
  if (!user || user.status !== 'Active') return Response.json({ error: 'Email belum terdaftar atau akun tidak aktif.' }, { status: 401 });
  (await cookies()).set('servenow-demo-session', encodeSession(user), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 12 });
  return Response.json({ user });
}

export async function DELETE() { (await cookies()).delete('servenow-demo-session'); return Response.json({ ok: true }); }
