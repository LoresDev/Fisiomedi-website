import { promises as fs } from "fs";
import path from "path";
import { randomUUID, createHash, randomBytes } from "crypto";
import { query, queryOne } from "@/lib/db";

const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");

export function newId(): string {
  return randomUUID();
}

export function hashValue(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: "admin" | "terapeuta" | "paciente";
  patientId?: string;
  mustChangePassword: boolean;
  passSalt: string;
  passHash: string;
  createdAt: string;
}

interface UserRow {
  id: string;
  username: string;
  name: string;
  role: "admin" | "terapeuta" | "paciente";
  patient_id: string | null;
  must_change_password: boolean;
  pass_salt: string;
  pass_hash: string;
  created_at: Date;
}

function toUser(r: UserRow): User {
  return {
    id: r.id,
    username: r.username,
    name: r.name,
    role: r.role,
    patientId: r.patient_id ?? undefined,
    mustChangePassword: r.must_change_password,
    passSalt: r.pass_salt,
    passHash: r.pass_hash,
    createdAt: r.created_at.toISOString(),
  };
}

function makePassword(salt: string, password: string): string {
  return hashValue(`${salt}:${password}`);
}

const USER_COLS = `id, username, name, role, patient_id, must_change_password, pass_salt, pass_hash, created_at`;

export function generateRandomPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from(randomBytes(8))
    .map((b) => chars[b % chars.length])
    .join("");
}

export async function ensureSeedUsers(): Promise<void> {
  const rows = await query<{ count: string }>("SELECT count(*)::text AS count FROM users");
  if (rows[0] && rows[0].count !== "0") return;
  const seeds = [
    { username: "admin", name: "Administrador", role: "admin" as const, password: "fisiomedi2026" },
    { username: "terapeuta", name: "Terapeuta", role: "terapeuta" as const, password: "terapia2026" },
  ];
  for (const s of seeds) {
    const salt = randomBytes(8).toString("hex");
    await query(
      `INSERT INTO users (id, username, name, role, pass_salt, pass_hash)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [newId(), s.username, s.name, s.role, salt, makePassword(salt, s.password)]
    );
  }
}

export async function getUsers(): Promise<User[]> {
  await ensureSeedUsers();
  const rows = await query<UserRow>(`SELECT ${USER_COLS} FROM users ORDER BY created_at`);
  return rows.map(toUser);
}

export async function findUser(username: string): Promise<User | undefined> {
  await ensureSeedUsers();
  const row = await queryOne<UserRow>(
    `SELECT ${USER_COLS} FROM users WHERE lower(username) = lower($1)`,
    [username.trim()]
  );
  return row ? toUser(row) : undefined;
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<User | null> {
  const user = await findUser(username);
  if (!user) return null;
  if (makePassword(user.passSalt, password) !== user.passHash) return null;
  return user;
}

export async function createUser(input: {
  username: string;
  name: string;
  role: "admin" | "terapeuta" | "paciente";
  password: string;
  patientId?: string;
  mustChangePassword?: boolean;
}): Promise<User | null> {
  await ensureSeedUsers();
  if (!input.username.trim() || input.password.length < 6) return null;
  if (await findUser(input.username)) return null;
  const salt = randomBytes(8).toString("hex");
  const validRole = ["admin", "terapeuta", "paciente"].includes(input.role) ? input.role : "terapeuta";
  const row = await queryOne<UserRow>(
    `INSERT INTO users (id, username, name, role, patient_id, must_change_password, pass_salt, pass_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${USER_COLS}`,
    [
      newId(),
      input.username.trim().toLowerCase(),
      input.name.trim() || input.username.trim(),
      validRole,
      input.patientId ?? null,
      input.mustChangePassword ?? false,
      salt,
      makePassword(salt, input.password),
    ]
  );
  return row ? toUser(row) : null;
}

export async function getUserByPatientId(patientId: string): Promise<User | undefined> {
  const row = await queryOne<UserRow>(
    `SELECT ${USER_COLS} FROM users WHERE patient_id = $1`,
    [patientId]
  );
  return row ? toUser(row) : undefined;
}

export async function setMustChangePassword(id: string, value: boolean): Promise<void> {
  await query("UPDATE users SET must_change_password = $2 WHERE id = $1", [id, value]);
}

export async function deleteUser(id: string): Promise<boolean> {
  const result = await query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
  return result.length > 0;
}

export async function changePassword(
  id: string,
  newPassword: string
): Promise<boolean> {
  if (newPassword.length < 6) return false;
  const salt = randomBytes(8).toString("hex");
  const result = await query(
    "UPDATE users SET pass_salt = $2, pass_hash = $3 WHERE id = $1 RETURNING id",
    [id, salt, makePassword(salt, newPassword)]
  );
  return result.length > 0;
}

export interface Patient {
  id: string;
  name: string;
  docId: string;
  phone: string;
  email?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

interface PatientRow {
  id: string;
  name: string;
  doc_id: string;
  phone: string;
  email: string | null;
  birth_date: string | null;
  gender: string | null;
  address: string | null;
  notes: string | null;
  created_at: Date;
}

function toPatient(r: PatientRow): Patient {
  return {
    id: r.id,
    name: r.name,
    docId: r.doc_id,
    phone: r.phone,
    email: r.email ?? undefined,
    birthDate: r.birth_date ?? undefined,
    gender: r.gender ?? undefined,
    address: r.address ?? undefined,
    notes: r.notes ?? undefined,
    createdAt: r.created_at.toISOString(),
  };
}

const PATIENT_COLS = `id, name, doc_id, phone, email, birth_date, gender, address, notes, created_at`;

export async function getPatients(q?: string): Promise<Patient[]> {
  const needle = q?.trim().toLowerCase();
  const rows = needle
    ? await query<PatientRow>(
        `SELECT ${PATIENT_COLS} FROM patients
         WHERE lower(name) LIKE $1 OR lower(doc_id) LIKE $1 OR lower(phone) LIKE $1
         ORDER BY name`,
        [`%${needle}%`]
      )
    : await query<PatientRow>(
        `SELECT ${PATIENT_COLS} FROM patients ORDER BY name`
      );
  return rows.map(toPatient);
}

export async function getPatient(id: string): Promise<Patient | undefined> {
  const row = await queryOne<PatientRow>(
    `SELECT ${PATIENT_COLS} FROM patients WHERE id = $1`,
    [id]
  );
  return row ? toPatient(row) : undefined;
}

export interface PatientInput {
  name: string;
  docId: string;
  phone: string;
  email?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  notes?: string;
}

function emptyToNull(v?: string): string | null {
  return v && v.trim() ? v.trim() : null;
}

export async function createPatient(input: PatientInput): Promise<Patient> {
  const row = await queryOne<PatientRow>(
    `INSERT INTO patients (id, name, doc_id, phone, email, birth_date, gender, address, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING ${PATIENT_COLS}`,
    [
      newId(),
      input.name.trim(),
      input.docId ?? "",
      input.phone.trim(),
      emptyToNull(input.email),
      emptyToNull(input.birthDate),
      emptyToNull(input.gender),
      emptyToNull(input.address),
      emptyToNull(input.notes),
    ]
  );
  return toPatient(row!);
}

export async function updatePatient(
  id: string,
  patch: Partial<PatientInput>
): Promise<boolean> {
  const current = await getPatient(id);
  if (!current) return false;
  const merged = { ...current, ...patch };
  const result = await query(
    `UPDATE patients SET name = $2, doc_id = $3, phone = $4, email = $5,
       birth_date = $6, gender = $7, address = $8, notes = $9
     WHERE id = $1 RETURNING id`,
    [
      id,
      merged.name.trim(),
      merged.docId ?? "",
      merged.phone.trim(),
      emptyToNull(merged.email),
      emptyToNull(merged.birthDate),
      emptyToNull(merged.gender),
      emptyToNull(merged.address),
      emptyToNull(merged.notes),
    ]
  );
  return result.length > 0;
}

export async function deletePatient(id: string): Promise<boolean> {
  const result = await query("DELETE FROM patients WHERE id = $1 RETURNING id", [id]);
  return result.length > 0;
}

export interface HistoryEntry {
  id: string;
  patientId: string;
  date: string;
  professional: string;
  reason: string;
  diagnosis?: string;
  treatment?: string;
  createdAt: string;
}

interface HistoryRow {
  id: string;
  patient_id: string;
  date: string;
  professional: string;
  reason: string;
  diagnosis: string | null;
  treatment: string | null;
  created_at: Date;
}

function toHistory(r: HistoryRow): HistoryEntry {
  return {
    id: r.id,
    patientId: r.patient_id,
    date: r.date,
    professional: r.professional,
    reason: r.reason,
    diagnosis: r.diagnosis ?? undefined,
    treatment: r.treatment ?? undefined,
    createdAt: r.created_at.toISOString(),
  };
}

export async function getHistory(patientId: string): Promise<HistoryEntry[]> {
  const rows = await query<HistoryRow>(
    `SELECT * FROM history_entries WHERE patient_id = $1 ORDER BY date DESC, created_at DESC`,
    [patientId]
  );
  return rows.map(toHistory);
}

export async function addHistoryEntry(input: Omit<
  HistoryEntry,
  "id" | "createdAt"
>): Promise<HistoryEntry> {
  const row = await queryOne<HistoryRow>(
    `INSERT INTO history_entries (id, patient_id, date, professional, reason, diagnosis, treatment)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      newId(),
      input.patientId,
      input.date,
      input.professional,
      input.reason,
      emptyToNull(input.diagnosis),
      emptyToNull(input.treatment),
    ]
  );
  return toHistory(row!);
}

export interface Exam {
  id: string;
  patientId: string;
  title: string;
  examDate?: string;
  notes?: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdBy: string;
  createdAt: string;
}

interface ExamRow {
  id: string;
  patient_id: string;
  title: string;
  exam_date: string | null;
  notes: string | null;
  file_name: string;
  original_name: string;
  mime_type: string;
  size: number;
  created_by: string;
  created_at: Date;
}

function toExam(r: ExamRow): Exam {
  return {
    id: r.id,
    patientId: r.patient_id,
    title: r.title,
    examDate: r.exam_date ?? undefined,
    notes: r.notes ?? undefined,
    fileName: r.file_name,
    originalName: r.original_name,
    mimeType: r.mime_type,
    size: Number(r.size),
    createdBy: r.created_by,
    createdAt: r.created_at.toISOString(),
  };
}

const MAX_EXAM_SIZE = 10 * 1024 * 1024;

export async function getExams(patientId: string): Promise<Exam[]> {
  const rows = await query<ExamRow>(
    `SELECT * FROM exams WHERE patient_id = $1 ORDER BY created_at DESC`,
    [patientId]
  );
  return rows.map(toExam);
}

export async function getExam(id: string): Promise<Exam | undefined> {
  const row = await queryOne<ExamRow>(`SELECT * FROM exams WHERE id = $1`, [id]);
  return row ? toExam(row) : undefined;
}

export async function countExams(): Promise<number> {
  const rows = await query<{ count: string }>("SELECT count(*)::text AS count FROM exams");
  return Number(rows[0]?.count ?? 0);
}

export async function saveExamFile(
  file: File
): Promise<{ fileName: string; size: number; mimeType: string } | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_EXAM_SIZE) return null;
  const id = newId();
  const ext = path.extname(file.name).slice(0, 10).replace(/[^.\w]/g, "");
  const fileName = `${id}${ext}`;
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(
    path.join(UPLOADS_DIR, fileName),
    Buffer.from(await file.arrayBuffer())
  );
  return { fileName, size: file.size, mimeType: file.type || "application/octet-stream" };
}

export async function addExam(input: Omit<Exam, "id" | "createdAt">): Promise<Exam> {
  const row = await queryOne<ExamRow>(
    `INSERT INTO exams (id, patient_id, title, exam_date, notes, file_name, original_name, mime_type, size, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      newId(),
      input.patientId,
      input.title,
      emptyToNull(input.examDate),
      emptyToNull(input.notes),
      input.fileName,
      input.originalName,
      input.mimeType,
      input.size,
      input.createdBy,
    ]
  );
  return toExam(row!);
}

export async function deleteExam(id: string): Promise<boolean> {
  const exam = await getExam(id);
  if (!exam) return false;
  await query("DELETE FROM exams WHERE id = $1", [id]);
  try {
    await fs.unlink(path.join(UPLOADS_DIR, exam.fileName));
  } catch {}
  return true;
}

export function uploadsPath(fileName: string): string {
  return path.join(UPLOADS_DIR, path.basename(fileName));
}
