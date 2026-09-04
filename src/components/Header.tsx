import Link from "next/link";
import { getSession } from "@/lib/auth";
import { clinic } from "@/config/clinic";
import { MobileNav } from "./MobileNav";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export async function Header() {
  const session = await getSession();

  const userHref =
    !session ? "/login"
    : session.role === "paciente" ? "/mi-cuenta"
    : "/admin";

  const userLabel =
    !session ? "Iniciar sesión"
    : session.name;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
            F
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            {clinic.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-slate-600 hover:text-blue-700 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/reservar"
            className="rounded-full bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 transition-colors"
          >
            Reservar cita
          </Link>

          {/* User icon */}
          <Link
            href={userHref}
            title={userLabel}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-700 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 flex items-center justify-center transition-colors">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </span>
            {session && (
              <span className="max-w-[100px] truncate text-xs text-slate-500">
                {session.name}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile nav (client component) */}
        <MobileNav links={links} userHref={userHref} userLabel={userLabel} hasSession={!!session} />
      </div>
    </header>
  );
}
