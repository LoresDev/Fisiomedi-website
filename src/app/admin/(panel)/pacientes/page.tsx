import Link from "next/link";
import { getPatients } from "@/lib/store";

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const patients = await getPatients(q);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pacientes</h1>
          <p className="mt-1 text-sm text-slate-500">
            {patients.length} paciente(s) {q ? "encontrados" : "registrados"}.
          </p>
        </div>
        <Link
          href="/admin/pacientes/nuevo"
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Nuevo paciente
        </Link>
      </div>

      <form method="get" className="mt-6 flex gap-3 max-w-md">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre, DNI o teléfono..."
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700">
          Buscar
        </button>
      </form>

      {patients.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-white border border-slate-200 p-10 text-center text-slate-400 shadow-sm">
          No se encontraron pacientes.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Paciente</th>
                <th className="px-4 py-3">Documento</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                  <td className="px-4 py-3 text-slate-500">{p.docId || "—"}</td>
                  <td className="px-4 py-3">{p.phone}</td>
                  <td className="px-4 py-3 text-slate-500">{p.email || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/pacientes/${p.id}`}
                      className="font-medium text-blue-700 hover:underline whitespace-nowrap"
                    >
                      Ver ficha →
                    </Link>
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
