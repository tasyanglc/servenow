import 'server-only';
import { Pool } from 'pg';

const globalForDb = global;
export function getDb() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum tersedia. Tambahkan di environment Vercel atau .env.local.');
  if (!globalForDb.__servenowDb) globalForDb.__servenowDb = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  return globalForDb.__servenowDb;
}
