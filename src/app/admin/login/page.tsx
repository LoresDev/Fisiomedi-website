import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { loginAction } from "../actions";

export const metadata: Metadata = {
  title: "Acceso staff",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  if (await getSession()) {
    redirect("/admin");
  }
  const { error } = await searchParams;

  return (
    <div className="bg-slate-100 flex-1 flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="mx-auto mb-4 w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl">
            F
          </span>
          <h1 className="text-2xl font-bold text-slate-900">
            Sistema de gestión clínica
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Acceso exclusivo para el personal de Fisiomedi.
          </p>
        </div>

        <form action={loginAction} className="mt-8 space-y-4 rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Usuario</span>
            <input
              type="text"
              name="username"
              required
              autoFocus
              autoComplete="username"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: admin"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Contraseña</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
              Usuario o contraseña incorrectos.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
