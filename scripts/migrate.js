const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { loadEnvConfig } = require('@next/env');

// `node scripts/migrate.js` runs outside Next.js, so explicitly load .env.local.
loadEnvConfig(process.cwd());

async function run() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum ditemukan. Tambahkan ke .env.local lalu jalankan kembali.');
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'db', 'migrations', '001_initial.sql'), 'utf8');
    await client.query(sql);
    console.log('Migration selesai: tabel PostgreSQL ServeNow siap digunakan.');
  } finally { await client.end(); }
}

run().catch(error => { console.error(error.message); process.exit(1); });
