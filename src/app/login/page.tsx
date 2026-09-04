import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "Iniciar sesión — FisioMedi",
  description: "Accede a tu cuenta de paciente o al panel de gestión de FisioMedi.",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session) {
    if (session.role === "paciente") redirect("/mi-cuenta");
    else redirect("/admin");
  }
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-200">
            F
          </span>
          <h1 className="text-2xl font-bold text-slate-900">Bienvenido a FisioMedi</h1>
          <p className="mt-2 text-sm text-slate-500">
            Ingresa con tu usuario y contraseña
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 p-8">
          <form action={loginAction} className="space-y-5">
            <div>
              <label htmlFor="login-username" className="block text-sm font-medium text-slate-700 mb-1.5">
                Usuario
              </label>
              <input
                id="login-username"
                type="text"
                name="username"
                required
                autoFocus
                autoComplete="username"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Tu nombre de usuario"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                </svg>
                Usuario o contraseña incorrectos.
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              Ingresar
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          ¿No tienes cuenta?{" "}
          <a href="/contacto" className="text-blue-600 hover:underline">
            Contáctanos
          </a>
        </p>
      </div>
    </div>
  );
}
