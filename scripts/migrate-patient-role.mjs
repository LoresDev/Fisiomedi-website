import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query(`
  ALTER TABLE users
    DROP CONSTRAINT IF EXISTS users_role_check,
    ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'terapeuta', 'paciente')),
    ADD COLUMN IF NOT EXISTS patient_id UUID REFERENCES patients(id) ON DELETE SET NULL
`).then(() => { console.log('✅ Migración completada'); pool.end(); })
  .catch(e => { console.error('❌', e.message); pool.end(); });
