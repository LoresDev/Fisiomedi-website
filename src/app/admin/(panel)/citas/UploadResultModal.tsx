"use client";

import { useState } from "react";
import { uploadAppointmentResultAction } from "../../actions";

interface Props {
  appointment: {
    id: string;
    name: string;
    phone: string;
    serviceName: string;
    date: string;
    time: string;
    patientId?: string;
    therapistName?: string;
    status: string;
  };
  examCount?: number;
}

export function UploadResultModal({ appointment, examCount = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all shadow-xs ${
          examCount > 0
            ? "bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            : "bg-blue-50 border border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
        }`}
        title={examCount > 0 ? `${examCount} resultado(s) cargado(s)` : "Subir archivo de resultados"}
      >
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        <span>
          {examCount > 0 ? `Resultados (${examCount})` : "Ingresar resultados"}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                    📄
                  </span>
                  Ingresar Resultados Médicos
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Paciente: <strong className="text-slate-800">{appointment.name}</strong> ({appointment.phone})
                </p>
                <p className="text-2xs text-slate-400">
                  {appointment.serviceName} · {appointment.date} {appointment.time}
                  {appointment.therapistName ? ` · Médico: ${appointment.therapistName}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                aria-label="Cerrar"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form
              action={uploadAppointmentResultAction}
              onSubmit={() => setSubmitting(true)}
              className="mt-4 space-y-3.5"
              encType="multipart/form-data"
            >
              <input type="hidden" name="appointmentId" value={appointment.id} />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título del estudio / examen *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Ej: Resonancia Magnética Lumbar, Rayos X, Informe Clínico"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fecha del estudio
                  </label>
                  <input
                    type="date"
                    name="examDate"
                    defaultValue={appointment.date}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estado inicial
                  </label>
                  <div className="rounded-xl bg-green-50 border border-green-200 px-3 py-2 text-xs font-semibold text-green-700 flex items-center gap-1.5">
                    <span>✓</span> Validado (visible al paciente)
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Archivo del resultado (PDF con imágenes, Rayos X, Resonancia, etc. - Máx. 10 MB) *
                </label>
                <input
                  type="file"
                  name="file"
                  required
                  accept=".pdf,image/*"
                  className="w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                <p className="text-2xs text-slate-400 mt-1">
                  Formatos soportados: PDF, JPG, PNG, escaneos e informes diagnósticos.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Diagnóstico y conclusiones del especialista
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Observaciones clínicas, hallazgos o indicaciones de tratamiento..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {appointment.status !== "completada" && (
                <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-3">
                  <label className="flex items-center gap-2 text-xs font-medium text-blue-900 cursor-pointer">
                    <input
                      type="checkbox"
                      name="markCompleted"
                      defaultChecked
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>Marcar la cita como <strong>Completada</strong> automáticamente</span>
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-all flex items-center gap-1.5"
                >
                  {submitting ? "Cargando archivo..." : "Guardar y Publicar Resultados"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
