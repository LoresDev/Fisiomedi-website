import Link from "next/link";
import { getAppointments, getSlotsForDate, type AppointmentStatus } from "@/lib/appointments";
import { services } from "@/config/clinic";
import { getPatients } from "@/lib/store";
import { createInternalAppointmentAction, updateStatusAction } from "../../actions";

const statusStyles: Record<AppointmentStatus, string> = {
  pendiente: "bg-amber-100 text-amber-800",
  confirmada: "bg-blue-100 text-blue-800",
  cancelada: "bg-red-100 text-red-700",
  completada: "bg-slate-200 text-slate-700",
};

const nextStatus: Partial<Record<AppointmentStatus, { label: string; to: AppointmentStatus }[]>> = {
  pendiente: [
    { label: "Confirmar", to: "confirmada" },
    { label: "Cancelar", to: "cancelada" },
  ],
  confirmada: [
    { label: "Completar", to: "completada" },
    { label: "Cancelar", to: "cancelada" },
  ],
  cancelada: [{ label: "Reactivar", to: "pendiente" }],
  completada: [],
};

const input =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

export default async function CitasPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; error?: string }>;
}) {
  const { estado, error } = await searchParams;
  const all = await getAppointments();
  const patients = await getPatients();
  all.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

  const filters: { key: string; label: string }[] = [
    { key: "", label: "Activas" },
    { key: "pendiente", label: "Pendientes" },
    { key: "confirmada", label: "Confirmadas" },
    { key: "completada", label: "Completadas" },
    { key: "cancelada", label: "Canceladas" },
    { key: "todas", label: "Todas" },
  ];

  const visible =
    !estado || estado === ""
      ? all.filter((a) => a.status !== "cancelada")
      : estado === "todas"
        ? all
        : all.filter((a) => a.status === (estado as AppointmentStatus));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Citas</h1>
      <p className="mt-1 text-sm text-slate-500">
        Gestiona las reservas web y las citas agendadas internamente.
      </p>

      <details className="mt-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-slate-900 hover:text-blue-700">
          + Agendar cita interna
        </summary>
        <form action={createInternalAppointmentAction} className="border-t border-slate-100 px-6 py-5 space-y-4 bg-slate-50/60">
          {error && (
            <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error === "datos"
                ? "Selecciona un paciente registrado o completa nombre y teléfono."
                : "Revisa los datos de la cita."}
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block sm:col-span-1">
              <span className="mb-1 block text-xs text-slate-500">Paciente registrado</span>
              <select name="patientId" className={input}>
                <option value="">— Paciente nuevo / ocasional —</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-slate-500">Nombre (si no está registrado)</span>
              <input type="text" name="name" className={input} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-slate-500">Teléfono (si no está registrado)</span>
              <input type="tel" name="phone" className={input} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-slate-500">Servicio *</span>
              <select name="serviceId" required className={input}>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-slate-500">Fecha *</span>
              <input type="date" name="date" required className={input} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-slate-500">Hora *</span>
              <select name="time" required className={input}>
                {getSlotsForDate().map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-3">
              <span className="mb-1 block text-xs text-slate-500">Motivo / notas</span>
              <input type="text" name="notes" className={input} />
            </label>
          </div>
          <button className="rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            Agendar cita
          </button>
        </form>
      </details>

      {error === undefined && null}

      <nav className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.key || "activas"}
            href={f.key ? `/admin/citas?estado=${f.key}` : "/admin/citas"}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              (estado ?? "") === f.key
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white border border-slate-200 p-10 text-center text-slate-400 shadow-sm">
          No hay citas en esta vista.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Hora</th>
                <th className="px-4 py-3">Paciente</th>
                <th className="px-4 py-3">Servicio</th>
                <th className="px-4 py-3">Origen</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => (
                <tr key={a.id} className="border-b border-slate-100 last:border-0 align-top">
                  <td className="whitespace-nowrap px-4 py-3">{a.date}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium">{a.time}</td>
                  <td className="px-4 py-3">
                    {a.patientId ? (
                      <Link href={`/admin/pacientes/${a.patientId}`} className="text-blue-700 hover:underline">
                        {a.name}
                      </Link>
                    ) : (
                      <>
                        {a.name}
                        <span className="block text-xs text-slate-400">{a.phone}</span>
                      </>
                    )}
                    {a.notes && (
                      <span className="block max-w-[220px] truncate text-xs text-slate-400" title={a.notes}>
                        {a.notes}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{a.serviceName}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${a.source === "interno" ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700"}`}>
                      {a.source === "interno" ? "Interna" : "Web"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {(nextStatus[a.status] ?? []).map((n) => (
                        <form key={n.to} action={updateStatusAction}>
                          <input type="hidden" name="id" value={a.id} />
                          <input type="hidden" name="status" value={n.to} />
                          <button
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                              n.to === "cancelada"
                                ? "border border-red-300 text-red-600 hover:bg-red-50"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {n.label}
                          </button>
                        </form>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
