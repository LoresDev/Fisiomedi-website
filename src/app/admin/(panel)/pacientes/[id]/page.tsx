import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addHistoryEntryAction,
  deleteExamAction,
  deletePatientAction,
  uploadExamAction,
} from "../../../actions";
import { getAppointments } from "@/lib/appointments";
import { getExams, getHistory, getPatient } from "@/lib/store";

const input =
  "w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function FichaPacientePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const patient = await getPatient(id);
  if (!patient) notFound();

  const [history, exams, appointments] = await Promise.all([
    getHistory(id),
    getExams(id),
    getAppointments(),
  ]);
  const patientAppointments = appointments
    .filter((a) => a.patientId === id)
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

  return (
    <div>
      <Link href="/admin/pacientes" className="text-sm text-blue-700 hover:underline">
        ← Volver a pacientes
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {patient.docId && <>Doc. {patient.docId} · </>}
            {patient.phone}
            {patient.email && <> · {patient.email}</>}
          </p>
          {patient.birthDate && (
            <p className="text-xs text-slate-400">Nacimiento: {patient.birthDate}{patient.gender ? ` · ${patient.gender}` : ""}</p>
          )}
          {patient.address && (
            <p className="text-xs text-slate-400">{patient.address}</p>
          )}
          {patient.notes && (
            <p className="mt-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 max-w-xl">
              {patient.notes}
            </p>
          )}
        </div>
        <form action={deletePatientAction}>
          <input type="hidden" name="id" value={patient.id} />
          <button className="rounded-full border border-red-300 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50">
            Eliminar paciente
          </button>
        </form>
      </div>

      {error === "examen" && (
        <p className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          No se pudo subir el examen. Verifica que el archivo no supere 10 MB.
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section id="historia" className="rounded-2xl bg-white border border-slate-200 shadow-sm">
          <header className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Historia clínica</h2>
            <span className="text-xs text-slate-400">{history.length} entrada(s)</span>
          </header>

          <form action={addHistoryEntryAction} className="px-6 py-5 space-y-3 border-b border-slate-100 bg-slate-50/60">
            <input type="hidden" name="patientId" value={patient.id} />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs text-slate-500">Fecha *</span>
                <input
                  type="date"
                  name="date"
                  required
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  className={input}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-slate-500">Motivo de consulta *</span>
                <input type="text" name="reason" required placeholder="Ej: dolor lumbar" className={input} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-slate-500">Diagnóstico</span>
                <input type="text" name="diagnosis" className={input} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-slate-500">Tratamiento aplicado</span>
                <input type="text" name="treatment" className={input} />
              </label>
            </div>
            <button className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              + Añadir a la historia
            </button>
          </form>

          <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
            {history.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-slate-400">
                Sin registros clínicos todavía.
              </p>
            ) : (
              history.map((h) => (
                <article key={h.id} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-800">{h.reason}</p>
                    <time className="shrink-0 text-xs text-slate-400">{h.date}</time>
                  </div>
                  {h.diagnosis && (
                    <p className="mt-1 text-sm text-slate-600"><strong className="text-slate-500">Dx:</strong> {h.diagnosis}</p>
                  )}
                  {h.treatment && (
                    <p className="text-sm text-slate-600"><strong className="text-slate-500">Tto:</strong> {h.treatment}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-400">Registrado por {h.professional}</p>
                </article>
              ))
            )}
          </div>
        </section>

        <section id="examenes" className="rounded-2xl bg-white border border-slate-200 shadow-sm">
          <header className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Exámenes médicos</h2>
            <span className="text-xs text-slate-400">{exams.length} archivo(s)</span>
          </header>

          <form action={uploadExamAction} className="px-6 py-5 space-y-3 border-b border-slate-100 bg-slate-50/60" encType="multipart/form-data">
            <input type="hidden" name="patientId" value={patient.id} />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs text-slate-500">Título del examen *</span>
                <input type="text" name="title" required placeholder="Ej: Radiografía de columna" className={input} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-slate-500">Fecha del examen</span>
                <input type="date" name="examDate" className={input} />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs text-slate-500">Archivo (PDF o imagen, máx. 10 MB) *</span>
                <input
                  type="file"
                  name="file"
                  required
                  accept=".pdf,image/*"
                  className="w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs text-slate-500">Observaciones</span>
                <input type="text" name="notes" className={input} />
              </label>
            </div>
            <button className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              Subir examen
            </button>
          </form>

          <ul className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
            {exams.length === 0 ? (
              <li className="px-6 py-10 text-center text-sm text-slate-400">
                Sin exámenes archivados.
              </li>
            ) : (
              exams.map((e) => (
                <li key={e.id} className="px-6 py-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{e.title}</p>
                    <p className="truncate text-xs text-slate-400">
                      {e.originalName} · {formatSize(e.size)}
                      {e.examDate ? ` · ${e.examDate}` : ""}
                    </p>
                    {e.notes && <p className="mt-1 text-xs text-slate-500">{e.notes}</p>}
                    <p className="text-xs text-slate-400">Subido por {e.createdBy}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href={`/api/exams/${e.id}`}
                      className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Descargar
                    </a>
                    <form action={deleteExamAction}>
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="patientId" value={patient.id} />
                      <button className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                        Borrar
                      </button>
                    </form>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <header className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Citas de este paciente</h2>
        </header>
        {patientAppointments.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-400">
            Este paciente aún no tiene citas. Puedes agendar una desde{" "}
            <Link href="/admin/citas?nueva=1" className="text-blue-700 hover:underline">
              Citas
            </Link>
            .
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-2.5">Fecha</th>
                <th className="px-6 py-2.5">Hora</th>
                <th className="px-6 py-2.5">Servicio</th>
                <th className="px-6 py-2.5">Estado</th>
              </tr>
            </thead>
            <tbody>
              {patientAppointments.map((a) => (
                <tr key={a.id} className="border-t border-slate-100">
                  <td className="px-6 py-3">{a.date}</td>
                  <td className="px-6 py-3 font-medium">{a.time}</td>
                  <td className="px-6 py-3">{a.serviceName}</td>
                  <td className="px-6 py-3 capitalize">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
