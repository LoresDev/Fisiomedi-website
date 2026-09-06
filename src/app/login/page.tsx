import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { loginAction } from "./actions";
import { LoginCarousel } from "./LoginCarousel";

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
    <div className="min-h-screen flex">
      {/* Left — carousel (hidden on mobile) */}
      <div className="hidden lg:block lg:w-[55%] xl:w-[60%] relative overflow-hidden">
        <LoginCarousel />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-blue-900/20 to-transparent pointer-events-none" />
        {/* Brand overlay */}
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-xl">
              F
            </span>
            <span className="text-xl font-bold tracking-tight">FisioMedi</span>
          </div>
          <p className="text-sm text-white/80 max-w-xs leading-relaxed">
            Cuidamos tu salud con atención fisioterapéutica profesional y personalizada.
          </p>
          {/* Slide dots */}
          <div id="carousel-dots" className="flex gap-2 mt-5" />
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white lg:bg-slate-50/60">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-200">
              F
            </span>
            <h1 className="text-2xl font-bold text-slate-900">FisioMedi</h1>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Bienvenido</h1>
            <p className="mt-2 text-slate-500">Ingresa a tu cuenta para continuar</p>
          </div>

          {/* Card */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
            <form action={loginAction} className="space-y-5">
              <div>
                <label
                  htmlFor="login-username"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Usuario o DNI
                </label>
                <input
                  id="login-username"
                  type="text"
                  name="username"
                  required
                  autoFocus
                  autoComplete="username"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Tu DNI (paciente) o usuario"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
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

              {/* Patient info badge */}
              <div className="rounded-xl bg-blue-50/80 border border-blue-100 p-3 text-xs text-blue-800 flex items-start gap-2.5">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5 text-blue-600">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4m0-4h.01" strokeLinecap="round" />
                </svg>
                <span>
                  <strong>¿Deseas ver tus resultados?</strong> Si eres paciente, ingresa con tu <strong>DNI</strong> y la contraseña proporcionada en clínica.
                </span>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="shrink-0"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                  </svg>
                  Usuario o contraseña incorrectos.
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
              >
                Ingresar a mi cuenta
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
    </div>
  );
}
