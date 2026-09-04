import type { Metadata } from "next";
import { getSession, logout } from "@/lib/auth";
import { getAppointments } from "@/lib/appointments";
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

export default async function MiCuentaPage() {
  const session = await getSession();
  if (!session || session.role !== "paciente") redirect("/login");

  const allAppointments = await getAppointments();
  const myAppointments = session.patientId
    ? allAppointments
        .filter((a) => a.patientId === session.patientId)
        .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))
    : [];

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
          <p className="mt-1 text-sm text-slate-500">Consulta tus citas y el estado de tus reservas.</p>
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
