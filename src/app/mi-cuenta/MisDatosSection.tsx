"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { updatePatientContactAction } from "./actions";

interface Props {
  patient: {
    name: string;
    docId: string;
    phone: string;
    email?: string;
    birthDate?: string;
    gender?: string;
    address?: string;
  };
}

export function MisDatosSection({ patient }: Props) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      await updatePatientContactAction(formData);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 4000);
    });
  }

  return (
    <section
      id="mis-datos"
      className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden scroll-mt-20"
    >
      <header className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <span>Mis Datos Personales</span>
            {saved && (
              <span className="text-xs font-normal text-green-600 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5 animate-fade-in">
                ✓ Datos actualizados
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Información registrada en tu ficha médica
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 px-3.5 py-1 text-xs font-semibold transition-colors"
            >
              Editar contacto
            </button>
          ) : (
            <button
              onClick={() => setEditing(false)}
              className="rounded-full border border-slate-300 text-slate-600 hover:bg-slate-50 px-3.5 py-1 text-xs font-medium transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </header>

      {!editing ? (
        <div className="p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Nombre */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xs font-medium uppercase tracking-wider text-slate-400 block mb-1">
                Nombre y Apellidos
              </span>
              <p className="font-semibold text-slate-800 text-sm">{patient.name}</p>
            </div>

            {/* DNI */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-medium uppercase tracking-wider text-slate-400 block mb-1">
                  Documento de Identidad (DNI)
                </span>
                <span className="text-3xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                  Verificado
                </span>
              </div>
              <p className="font-semibold text-slate-800 text-sm">
                {patient.docId || "No registrado"}
              </p>
            </div>

            {/* Teléfono */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xs font-medium uppercase tracking-wider text-slate-400 block mb-1">
                Teléfono de contacto
              </span>
              <p className="font-semibold text-slate-800 text-sm">{patient.phone}</p>
            </div>

            {/* Correo */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xs font-medium uppercase tracking-wider text-slate-400 block mb-1">
                Correo Electrónico
              </span>
              <p className="font-semibold text-slate-800 text-sm truncate">
                {patient.email || <span className="text-slate-400 font-normal">Sin registrar</span>}
              </p>
            </div>

            {/* Fecha de nacimiento */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xs font-medium uppercase tracking-wider text-slate-400 block mb-1">
                Fecha de Nacimiento
              </span>
              <p className="font-semibold text-slate-800 text-sm">
                {patient.birthDate || <span className="text-slate-400 font-normal">Sin registrar</span>}
              </p>
            </div>

            {/* Género */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xs font-medium uppercase tracking-wider text-slate-400 block mb-1">
                Género
              </span>
              <p className="font-semibold text-slate-800 text-sm capitalize">
                {patient.gender || <span className="text-slate-400 font-normal">Sin registrar</span>}
              </p>
            </div>

            {/* Dirección */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
              <span className="text-2xs font-medium uppercase tracking-wider text-slate-400 block mb-1">
                Dirección de Domicilio
              </span>
              <p className="font-semibold text-slate-800 text-sm">
                {patient.address || <span className="text-slate-400 font-normal">Sin registrar</span>}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Para modificar tu nombre o DNI oficial, solicítalo en recepción al asistir a tu cita.
            </p>
            <Link
              href="/mi-cuenta/cambiar-clave"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline shrink-0"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              Cambiar mi contraseña
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-3 text-xs text-blue-700">
            Puedes actualizar tu teléfono, correo y dirección para que podamos comunicarnos contigo sobre tus citas y resultados.
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Teléfono de contacto *
              </label>
              <input
                type="tel"
                name="phone"
                required
                defaultValue={patient.phone}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                defaultValue={patient.email || ""}
                placeholder="ejemplo@correo.com"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="address"
                defaultValue={patient.address || ""}
                placeholder="Av. Principal 123, Distrito"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-colors"
            >
              {isPending ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
