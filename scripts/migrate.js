const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { loadEnvConfig } = require('@next/env');

// `node scripts/migrate.js` runs outside Next.js, so explicitly load .env.local.
loadEnvConfig(process.cwd());

async function run() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum ditemukan. Tambahkan ke .env.local lalu jalankan kembali.');
  console.log('Menghubungkan ke PostgreSQL...');
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('PostgreSQL terhubung.');
  try {
    const migrationDirectory = path.join(__dirname, '..', 'db', 'migrations');
    const migrations = fs.readdirSync(migrationDirectory).filter(file => file.endsWith('.sql')).sort();
    for (const migration of migrations) {
      console.log(`Menjalankan ${migration}...`);
      await client.query(fs.readFileSync(path.join(migrationDirectory, migration), 'utf8'));
      console.log(`${migration} selesai.`);
    }
    console.log('Migration selesai: tabel PostgreSQL ServeNow siap digunakan.');
  } finally { await client.end(); }
}

run().catch(error => { console.error(error.message); process.exit(1); });
