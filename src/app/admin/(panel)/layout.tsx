import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { logoutAction } from "../actions";

const nav = [
  { href: "/admin", label: "Inicio", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/admin/citas", label: "Citas", icon: "M8 7V3m8 4V3M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" },
  { href: "/admin/pacientes", label: "Pacientes", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
];

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-blue-700 text-white">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 min-w-0">
            <Link href="/admin" className="font-bold text-lg whitespace-nowrap">
              Fisiomedi
            </Link>
            <nav className="flex items-center gap-1 overflow-x-auto text-sm">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="whitespace-nowrap rounded-full px-4 py-1.5 hover:bg-blue-600 transition-colors"
                >
                  {n.label}
                </Link>
              ))}
              {session.role === "admin" && (
                <Link
                  href="/admin/usuarios"
                  className="whitespace-nowrap rounded-full px-4 py-1.5 hover:bg-blue-600 transition-colors"
                >
                  Usuarios
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-sm">
            <span className="hidden sm:inline text-blue-100">
              {session.name}
              <span className="ml-1.5 rounded-full bg-blue-500/60 px-2 py-0.5 text-xs capitalize">
                {session.role}
              </span>
            </span>
            <form action={logoutAction}>
              <button className="rounded-full border border-white/40 px-4 py-1.5 hover:bg-white/10">
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>

      <footer className="pb-8 text-center text-xs text-slate-400">
        <Link href="/" className="hover:text-blue-600">
          ← Volver a la web pública
        </Link>
      </footer>
    </div>
  );
}
