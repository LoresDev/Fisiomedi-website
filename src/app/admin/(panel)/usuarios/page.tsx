import { getUsers } from "@/lib/store";
import { requireAdmin } from "@/lib/auth";
import { createUserAction, deleteUserAction, resetPasswordAction } from "../../actions";

const input =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { error } = await searchParams;
  const users = await getUsers();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Usuarios del sistema</h1>
      <p className="mt-1 text-sm text-slate-500">
        Cada miembro del personal accede con su propio usuario. Los administradores
        gestionan todo; los terapeutas gestionan pacientes, citas e historias.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error === "self"
            ? "No puedes eliminar tu propia cuenta."
            : error === "pass"
              ? "La contraseña debe tener al menos 6 caracteres."
              : "No se pudo crear el usuario: verifica que el nombre de usuario no exista y la contraseña tenga 6+ caracteres."}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 last:border-0 align-top">
                <td className="px-4 py-3 font-medium text-slate-800">@{u.username}</td>
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${u.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-slate-200 text-slate-700"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <form action={resetPasswordAction} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={u.id} />
                      <input
                        type="password"
                        name="password"
                        placeholder="Nueva contraseña"
                        minLength={6}
                        required
                        className="w-40 rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                      />
                      <button className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 whitespace-nowrap">
                        Cambiar clave
                      </button>
                    </form>
                    <form action={deleteUserAction}>
                      <input type="hidden" name="id" value={u.id} />
                      <button className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 whitespace-nowrap">
                        Eliminar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-8 rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Crear usuario</h2>
        <form action={createUserAction} className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs text-slate-500">Usuario *</span>
            <input type="text" name="username" required pattern="[a-zA-Z0-9_.]+" title="Solo letras, números, punto y guion bajo" className={input} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-slate-500">Nombre completo *</span>
            <input type="text" name="name" required className={input} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-slate-500">Rol *</span>
            <select name="role" className={input}>
              <option value="terapeuta">Terapeuta</option>
              <option value="admin">Administrador</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-slate-500">Contraseña * (mín. 6)</span>
            <input type="password" name="password" required minLength={6} className={input} />
          </label>
          <div className="sm:col-span-2">
            <button className="rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              Crear usuario
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
