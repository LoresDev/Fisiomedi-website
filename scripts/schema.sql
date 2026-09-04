CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'terapeuta', 'paciente')),
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  pass_salt TEXT NOT NULL,
  pass_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  doc_id TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL,
  email TEXT,
  birth_date TEXT,
  gender TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS history_entries (
  id UUID PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  professional TEXT NOT NULL,
  reason TEXT NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_history_patient ON history_entries(patient_id);

CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  exam_date TEXT,
  notes TEXT,
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_exams_patient ON exams(patient_id);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (status IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'web' CHECK (source IN ('web', 'interno'))
);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
