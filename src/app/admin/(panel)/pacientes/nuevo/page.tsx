import Link from "next/link";
import { createPatientAction } from "../../../actions";

const input =
  "w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

export default async function NuevoPacientePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/pacientes" className="text-sm text-blue-700 hover:underline">
        ← Volver a pacientes
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">Nuevo paciente</h1>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Completa al menos el nombre y el teléfono.
        </p>
      )}

      <form action={createPatientAction} className="mt-6 rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm text-slate-600">Nombre completo *</span>
            <input type="text" name="name" required minLength={3} className={input} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">DNI / Documento</span>
            <input type="text" name="docId" className={input} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Teléfono *</span>
            <input type="tel" name="phone" required className={input} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Email</span>
            <input type="email" name="email" className={input} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Fecha de nacimiento</span>
            <input type="date" name="birthDate" className={input} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Género</span>
            <select name="gender" className={input}>
              <option value="">Sin especificar</option>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
              <option value="otro">Otro</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Dirección</span>
            <input type="text" name="address" className={input} />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm text-slate-600">Observaciones generales</span>
            <textarea name="notes" rows={3} className={input} placeholder="Alergias, condiciones preexistentes, etc." />
          </label>
        </div>
        <button className="rounded-full bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition-colors">
          Registrar paciente
        </button>
      </form>
    </div>
  );
}
