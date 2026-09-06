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

  const resultadosHref =
    !session ? "/login"
    : session.role === "paciente" ? "/mi-cuenta#resultados"
    : "/admin/pacientes";

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
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-slate-600 hover:text-blue-700 transition-colors"
            >
              {l.label}
            </Link>
          ))}

          {/* Ver mis resultados */}
          <Link
            href={resultadosHref}
            className="flex items-center gap-1.5 rounded-full border border-blue-600/30 bg-blue-50/60 hover:bg-blue-100 hover:border-blue-600 text-blue-700 px-3.5 py-1.5 text-xs font-semibold transition-all shadow-xs"
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
            </svg>
            <span>Ver mis resultados</span>
          </Link>

          <Link
            href="/reservar"
            className="rounded-full bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            Reservar cita
          </Link>

          {/* User icon */}
          <Link
            href={userHref}
            title={userLabel}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-700 transition-colors ml-1"
          >
            <span className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 flex items-center justify-center transition-colors">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </span>
            {session && (
              <span className="max-w-[90px] truncate text-xs text-slate-500 font-normal">
                {session.name}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href={resultadosHref}
            className="flex items-center gap-1 rounded-full border border-blue-600/30 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
            </svg>
            <span>Resultados</span>
          </Link>
          <MobileNav
            links={links}
            userHref={userHref}
            userLabel={userLabel}
            hasSession={!!session}
            resultadosHref={resultadosHref}
          />
        </div>
      </div>
    </header>
  );
}
