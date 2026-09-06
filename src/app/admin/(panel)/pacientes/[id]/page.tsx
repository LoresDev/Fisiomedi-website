import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addHistoryEntryAction,
  createPatientAccountAction,
  deleteExamAction,
  deletePatientAction,
  deletePatientAccountAction,
  uploadExamAction,
  updateExamStatusAction,
} from "../../../actions";
import { getAppointments } from "@/lib/appointments";
import { getExams, getHistory, getPatient, getUserByPatientId } from "@/lib/store";

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
  searchParams: Promise<{ error?: string; nueva_clave?: string }>;
}) {
  const { id } = await params;
  const { error, nueva_clave } = await searchParams;
  const patient = await getPatient(id);
  if (!patient) notFound();

  const [history, exams, appointments, patientAccount] = await Promise.all([
    getHistory(id),
    getExams(id),
    getAppointments(),
    getUserByPatientId(id),
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
            <div>
              <h2 className="font-semibold text-slate-900">Exámenes y Resultados</h2>
              <p className="text-xs text-slate-400 mt-0.5">Sube, valida o rechaza resultados médicos del paciente</p>
            </div>
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
              <label className="block">
                <span className="mb-1 block text-xs text-slate-500">Estado inicial</span>
                <select name="status" className={input} defaultValue="validado">
                  <option value="validado">Validado (listo para descarga del paciente)</option>
                  <option value="en_revision">En revisión (borrador interno)</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-slate-500">Observaciones</span>
                <input type="text" name="notes" placeholder="Notas clínicas u observaciones" className={input} />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs text-slate-500">Archivo (PDF o imagen, máx. 10 MB) *</span>
                <input
                  type="file"
                  name="file"
                  required
                  accept=".pdf,image/*"
                  className="w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
              </label>
            </div>
            <button className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-all">
              Subir examen
            </button>
          </form>

          <ul className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
            {exams.length === 0 ? (
              <li className="px-6 py-10 text-center text-sm text-slate-400">
                Sin exámenes archivados.
              </li>
            ) : (
              exams.map((e) => (
                <li key={e.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="truncate text-sm font-semibold text-slate-800">{e.title}</p>
                      {e.status === "validado" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-2xs font-semibold text-green-700">
                          ✓ Validado
                        </span>
                      )}
                      {e.status === "en_revision" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-2xs font-semibold text-amber-800">
                          ⏳ En revisión
                        </span>
                      )}
                      {e.status === "rechazado" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-2xs font-semibold text-red-700">
                          ✕ Rechazado / Erróneo
                        </span>
                      )}
                    </div>

                    <p className="truncate text-xs text-slate-400 mt-1">
                      {e.originalName} · {formatSize(e.size)}
                      {e.examDate ? ` · Fecha: ${e.examDate}` : ""}
                    </p>
                    {e.notes && <p className="mt-1 text-xs text-slate-600 italic">{e.notes}</p>}
                    
                    {e.status === "rechazado" && e.rejectionReason && (
                      <div className="mt-2 rounded-lg bg-red-50 border border-red-200 p-2 text-xs text-red-800">
                        <strong>Motivo del rechazo:</strong> {e.rejectionReason}
                      </div>
                    )}

                    <p className="text-2xs text-slate-400 mt-1">
                      Subido por {e.createdBy}
                      {e.validatedBy && e.status === "validado" ? ` · Validado por ${e.validatedBy}` : ""}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-start mt-2 sm:mt-0">
                    <a
                      href={`/api/exams/${e.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Descargar
                    </a>

                    {/* Validar action if not currently validated */}
                    {e.status !== "validado" && (
                      <form action={updateExamStatusAction}>
                        <input type="hidden" name="id" value={e.id} />
                        <input type="hidden" name="patientId" value={patient.id} />
                        <input type="hidden" name="status" value="validado" />
                        <button
                          title="Aprobar y validar resultado para el paciente"
                          className="rounded-full border border-green-300 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors"
                        >
                          ✓ Validar
                        </button>
                      </form>
                    )}

                    {/* Rechazar action if not currently rejected */}
                    {e.status !== "rechazado" && (
                      <details className="relative">
                        <summary className="cursor-pointer list-none rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100 transition-colors">
                          Rechazar...
                        </summary>
                        <div className="absolute right-0 top-full mt-1 z-30 w-72 rounded-xl bg-white border border-slate-200 p-3 shadow-xl space-y-2 text-left">
                          <p className="text-xs font-semibold text-slate-800">Rechazar / Anular resultado</p>
                          <p className="text-2xs text-slate-500">Indica la razón por la cual este examen es errado:</p>
                          <form action={updateExamStatusAction} className="space-y-2">
                            <input type="hidden" name="id" value={e.id} />
                            <input type="hidden" name="patientId" value={patient.id} />
                            <input type="hidden" name="status" value="rechazado" />
                            <input
                              type="text"
                              name="rejectionReason"
                              required
                              placeholder="Ej: Archivo erróneo, datos no coinciden..."
                              className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-500"
                            />
                            <button
                              type="submit"
                              className="w-full rounded-lg bg-red-600 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                            >
                              Confirmar rechazo
                            </button>
                          </form>
                        </div>
                      </details>
                    )}

                    {/* Delete button (permanent erase) */}
                    <form action={deleteExamAction}>
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="patientId" value={patient.id} />
                      <button
                        title="Eliminar permanentemente del servidor"
                        className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                      >
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
                <th className="px-6 py-2.5">Especialista</th>
                <th className="px-6 py-2.5">Estado</th>
              </tr>
            </thead>
            <tbody>
              {patientAppointments.map((a) => (
                <tr key={a.id} className="border-t border-slate-100">
                  <td className="px-6 py-3">{a.date}</td>
                  <td className="px-6 py-3 font-medium">{a.time}</td>
                  <td className="px-6 py-3">{a.serviceName}</td>
                  <td className="px-6 py-3 text-xs text-slate-600">
                    {a.therapistName ? (
                      <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                        👨‍⚕️ {a.therapistName}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-6 py-3 capitalize">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Patient account access section */}
      <section id="cuenta" className="mt-6 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <header className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Cuenta de acceso</h2>
            <p className="text-xs text-slate-400 mt-0.5">Permite al paciente ver sus citas y resultados</p>
          </div>
          {patientAccount && (
            <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium">Activa</span>
          )}
        </header>

        {/* Generated password banner — shown once after creation */}
        {nueva_clave && (
          <div className="mx-6 mt-5 rounded-xl bg-green-50 border border-green-200 px-5 py-4">
            <p className="text-sm font-semibold text-green-800 mb-1">✅ Cuenta creada exitosamente</p>
            <p className="text-xs text-green-700 mb-3">
              Entrega esta contraseña temporal al paciente. No se volverá a mostrar.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1">
                <p className="text-xs text-green-600 mb-1">Usuario (DNI)</p>
                <code className="block rounded-lg bg-white border border-green-300 px-4 py-2 text-sm font-mono font-semibold text-slate-800">
                  {patientAccount?.username ?? patient.docId}
                </code>
              </div>
              <div className="flex-1">
                <p className="text-xs text-green-600 mb-1">Contraseña temporal</p>
                <code className="block rounded-lg bg-white border border-green-300 px-4 py-2 text-sm font-mono font-semibold text-slate-800">
                  {nueva_clave}
                </code>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-3">El paciente deberá cambiarla en su primer ingreso.</p>
          </div>
        )}

        {error === "cuenta" && (
          <p className="mx-6 mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
            No se pudo crear la cuenta. El DNI ya puede estar registrado como usuario.
          </p>
        )}
        {error === "sin_dni" && (
          <p className="mx-6 mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5 text-sm text-amber-800">
            Este paciente no tiene DNI registrado. Edita su ficha y añade el DNI antes de crear la cuenta.
          </p>
        )}

        {patientAccount ? (
          <div className="px-6 py-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-700">
                Usuario (DNI): <strong className="font-mono">{patientAccount.username}</strong>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Creada el {new Date(patientAccount.createdAt).toLocaleDateString("es")}</p>
              {patientAccount.mustChangePassword && (
                <span className="mt-1 inline-block rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs">
                  Pendiente cambio de contraseña
                </span>
              )}
            </div>
            <form action={deletePatientAccountAction}>
              <input type="hidden" name="userId" value={patientAccount.id} />
              <input type="hidden" name="patientId" value={patient.id} />
              <button className="rounded-full border border-red-300 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50">
                Eliminar cuenta
              </button>
            </form>
          </div>
        ) : (
          <div className="px-6 py-5">
            {!patient.docId || !patient.docId.trim() ? (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                ⚠️ Añade el <strong>DNI</strong> del paciente en su ficha antes de crear una cuenta.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                  <p className="text-xs text-slate-500 mb-1">Usuario que se asignará</p>
                  <p className="font-mono font-semibold text-slate-800">{patient.docId}</p>
                </div>
                <p className="text-xs text-slate-500">
                  Se generará una contraseña temporal que deberás entregar al paciente. El paciente la cambiará en su primer ingreso.
                </p>
                <form action={createPatientAccountAction}>
                  <input type="hidden" name="patientId" value={patient.id} />
                  <button className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                    Generar cuenta de acceso
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
