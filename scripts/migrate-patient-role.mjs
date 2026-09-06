import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query(`
  ALTER TABLE users
    ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT false
`).then(() => { console.log('✅ Migración completada'); pool.end(); })
  .catch(e => { console.error('❌', e.message); pool.end(); });
