import { randomUUID } from "crypto";
import { clinic, services } from "@/config/clinic";
import { query, queryOne } from "@/lib/db";

export type AppointmentStatus =
  | "pendiente"
  | "confirmada"
  | "cancelada"
  | "completada";

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email?: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  patientId?: string;
  source?: "web" | "interno";
}

interface AppointmentRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service_id: string;
  service_name: string;
  date: string;
  time: string;
  notes: string | null;
  status: AppointmentStatus;
  created_at: Date;
  patient_id: string | null;
  source: "web" | "interno";
}

function toAppointment(r: AppointmentRow): Appointment {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email ?? undefined,
    serviceId: r.service_id,
    serviceName: r.service_name,
    date: r.date,
    time: r.time,
    notes: r.notes ?? undefined,
    status: r.status,
    createdAt: r.created_at.toISOString(),
    patientId: r.patient_id ?? undefined,
    source: r.source,
  };
}

export async function getAppointments(): Promise<Appointment[]> {
  const rows = await query<AppointmentRow>(
    `SELECT * FROM appointments ORDER BY date, time, created_at`
  );
  return rows.map(toAppointment);
}

export async function getActiveByDate(date: string): Promise<Appointment[]> {
  const rows = await query<AppointmentRow>(
    `SELECT * FROM appointments
     WHERE date = $1 AND status IN ('pendiente', 'confirmada')`,
    [date]
  );
  return rows.map(toAppointment);
}

export async function addAppointment(input: {
  name: string;
  phone: string;
  email?: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
  patientId?: string;
  source?: "web" | "interno";
}): Promise<Appointment> {
  const service = services.find((s) => s.id === input.serviceId);
  if (!service) throw new Error("Servicio no válido");

  const row = await queryOne<AppointmentRow>(
    `INSERT INTO appointments
       (id, name, phone, email, service_id, service_name, date, time, notes, patient_id, source)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      randomUUID(),
      input.name.trim(),
      input.phone.trim(),
      input.email?.trim() || null,
      service.id,
      service.name,
      input.date,
      input.time,
      input.notes?.trim() || null,
      input.patientId || null,
      input.source === "interno" ? "interno" : "web",
    ]
  );
  return toAppointment(row!);
}

export async function setAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<boolean> {
  const result = await query(
    `UPDATE appointments SET status = $2 WHERE id = $1 RETURNING id`,
    [id, status]
  );
  return result.length > 0;
}

export function isValidBookingDate(dateStr: string): boolean {
  const d = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d < today) return false;
  const day = d.getDay();
  return day >= clinic.schedule.firstDay && day <= clinic.schedule.lastDay;
}

export function getSlotsForDate(): string[] {
  const slots: string[] = [];
  for (let h = clinic.schedule.startHour; h < clinic.schedule.endHour; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  return slots;
}

export async function getAvailableSlots(dateStr: string): Promise<string[]> {
  const taken = await getActiveByDate(dateStr);
  const takenTimes = new Set(taken.map((a) => a.time));
  return getSlotsForDate().filter((t) => !takenTimes.has(t));
}
