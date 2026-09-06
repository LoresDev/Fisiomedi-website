import type { Metadata } from "next";
import { getSession, logout } from "@/lib/auth";
import { getAppointments } from "@/lib/appointments";
import { getExams } from "@/lib/store";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Mi cuenta — FisioMedi",
  robots: { index: false },
};

async function logoutAction() {
  "use server";
  await logout();
  redirect("/login");
}

const statusColors: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-800",
  confirmada: "bg-green-100 text-green-800",
  cancelada: "bg-red-100 text-red-700",
  completada: "bg-slate-100 text-slate-600",
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MiCuentaPage() {
  const session = await getSession();
  if (!session || session.role !== "paciente") redirect("/login");
  if (session.mustChangePassword) redirect("/mi-cuenta/cambiar-clave");

  const allAppointments = await getAppointments();
  const myAppointments = session.patientId
    ? allAppointments
        .filter((a) => a.patientId === session.patientId)
        .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))
    : [];

  const myExams = session.patientId ? await getExams(session.patientId) : [];

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = myAppointments.filter(
    (a) => a.date >= today && a.status !== "cancelada" && a.status !== "completada"
  );
  const past = myAppointments.filter(
    (a) => a.date < today || a.status === "completada" || a.status === "cancelada"
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              F
            </span>
            <span className="font-bold text-slate-900">FisioMedi</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-slate-500">
              Hola, <strong className="text-slate-700">{session.name}</strong>
            </span>
            <form action={logoutAction}>
              <button className="rounded-full border border-slate-300 px-4 py-1.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mi cuenta</h1>
          <p className="mt-1 text-sm text-slate-500">Consulta tus citas y resultados médicos.</p>
        </div>

        {/* Upcoming appointments */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Próximas citas</h2>
            <span className="text-xs text-slate-400">{upcoming.length} cita(s)</span>
          </header>

          {upcoming.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-slate-400">No tienes citas próximas.</p>
              <a
                href="/reservar"
                className="mt-4 inline-block rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Reservar una cita
              </a>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {upcoming.map((a) => (
                <li key={a.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-800">{a.serviceName}</p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {a.date} · {a.time}
                    </p>
                    {a.notes && (
                      <p className="text-xs text-slate-400 mt-1">{a.notes}</p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      statusColors[a.status] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {a.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Mis Resultados */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Mis Resultados</h2>
              <p className="text-xs text-slate-400 mt-0.5">Exámenes y documentos subidos por tu terapeuta</p>
            </div>
            <span className="text-xs text-slate-400">{myExams.length} archivo(s)</span>
          </header>

          {myExams.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                </svg>
              </div>
              <p className="text-sm text-slate-400">Aún no tienes resultados disponibles.</p>
              <p className="text-xs text-slate-300 mt-1">Tu terapeuta los subirá después de tus consultas.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {myExams.map((e) => (
                <li key={e.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex items-start gap-3">
                    {/* File icon */}
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mt-0.5">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate">{e.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {e.originalName} · {formatSize(e.size)}
                        {e.examDate ? ` · ${e.examDate}` : ""}
                      </p>
                      {e.notes && (
                        <p className="text-xs text-slate-500 mt-1">{e.notes}</p>
                      )}
                    </div>
                  </div>
                  <a
                    href={`/api/exams/${e.id}`}
                    className="shrink-0 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Descargar
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Past appointments */}
        {past.length > 0 && (
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <header className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Historial de citas</h2>
            </header>
            <ul className="divide-y divide-slate-100">
              {past.map((a) => (
                <li key={a.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-700">{a.serviceName}</p>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {a.date} · {a.time}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      statusColors[a.status] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {a.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Reserve CTA */}
        <div className="rounded-2xl bg-blue-600 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-white">¿Necesitas una nueva cita?</p>
            <p className="text-sm text-blue-100 mt-0.5">Reserva en línea de forma rápida y sencilla.</p>
          </div>
          <a
            href="/reservar"
            className="shrink-0 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
          >
            Reservar ahora
          </a>
        </div>
      </main>
    </div>
  );
}
