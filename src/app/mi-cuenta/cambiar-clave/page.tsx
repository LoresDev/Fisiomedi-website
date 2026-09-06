import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { changePasswordAction } from "./actions";

export const metadata: Metadata = {
  title: "Cambiar contraseña — FisioMedi",
  robots: { index: false },
};

export default async function CambiarClavePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "paciente") redirect("/login");
  if (!session.mustChangePassword) redirect("/mi-cuenta");

  const { error } = await searchParams;

  const errorMsg =
    error === "short" ? "La contraseña debe tener al menos 8 caracteres." :
    error === "mismatch" ? "Las contraseñas no coinciden." :
    error === "fail" ? "No se pudo actualizar la contraseña. Intenta de nuevo." :
    null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-200">
            F
          </span>
          <h1 className="text-2xl font-bold text-slate-900">Elige tu contraseña</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
            Es tu primer ingreso. Por seguridad, elige una contraseña personal antes de continuar.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
          <form action={changePasswordAction} className="space-y-5">
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Nueva contraseña
              </label>
              <input
                id="new-password"
                type="password"
                name="newPassword"
                required
                minLength={8}
                autoFocus
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Confirmar contraseña
              </label>
              <input
                id="confirm-password"
                type="password"
                name="confirmPassword"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Repite la contraseña"
              />
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                </svg>
                {errorMsg}
              </div>
            )}

            {/* Password rules */}
            <ul className="text-xs text-slate-400 space-y-1 pl-1">
              <li>• Mínimo 8 caracteres</li>
              <li>• Usa letras y números para mayor seguridad</li>
            </ul>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              Guardar contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
