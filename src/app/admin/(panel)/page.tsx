import Link from "next/link";
import { getAppointments } from "@/lib/appointments";
import { countExams, getPatients } from "@/lib/store";

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default async function AdminDashboard() {
  const [appointments, patients, exams] = await Promise.all([
    getAppointments(),
    getPatients(),
    countExams(),
  ]);
  const today = todayISO();
  const todays = appointments
    .filter((a) => a.date === today && a.status !== "cancelada")
    .sort((a, b) => a.time.localeCompare(b.time));
  const pending = appointments.filter((a) => a.status === "pendiente").length;

  const stats = [
    { label: "Citas hoy", value: todays.length },
    { label: "Por confirmar", value: pending },
    { label: "Pacientes registrados", value: patients.length },
    { label: "Exámenes archivados", value: exams },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Buen día</h1>
      <p className="mt-1 text-sm text-slate-500">
        Resumen general del sistema de gestión clínica.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-3xl font-bold text-blue-700">{s.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Agenda de hoy</h2>
            <Link href="/admin/citas" className="text-sm text-blue-700 hover:underline">
              Ver todas →
            </Link>
          </div>
          {todays.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No hay citas programadas para hoy.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {todays.map((a) => (
                <li key={a.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                  <div>
                    <span className="font-semibold text-slate-800">{a.time}</span>
                    <span className="ml-3 text-slate-700">{a.name}</span>
                    <span className="block text-xs text-slate-400">{a.serviceName}</span>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      a.status === "confirmada"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {a.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Acciones rápidas</h2>
          <div className="grid gap-3">
            <Link
              href="/admin/pacientes/nuevo"
              className="rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium hover:border-blue-500 hover:text-blue-700 transition-colors"
            >
              + Registrar nuevo paciente
            </Link>
            <Link
              href="/admin/citas?nueva=1"
              className="rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium hover:border-blue-500 hover:text-blue-700 transition-colors"
            >
              + Agendar cita interna
            </Link>
            <Link
              href="/admin/pacientes"
              className="rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium hover:border-blue-500 hover:text-blue-700 transition-colors"
            >
              Buscar paciente / ver historias y exámenes
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
