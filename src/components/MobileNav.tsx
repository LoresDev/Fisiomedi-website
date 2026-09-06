"use client";

import Link from "next/link";
import { useState } from "react";

interface Props {
  links: { href: string; label: string }[];
  userHref: string;
  userLabel: string;
  hasSession: boolean;
  resultadosHref: string;
}

export function MobileNav({ links, userHref, userLabel, hasSession, resultadosHref }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Abrir menú"
        onClick={() => setOpen(!open)}
        className="p-2 text-slate-700 hover:text-blue-600 transition-colors"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <nav className="md:hidden absolute top-16 left-0 right-0 border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-3 text-sm font-medium shadow-xl z-50">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-slate-700 hover:text-blue-700 py-1"
            >
              {l.label}
            </Link>
          ))}

          <hr className="border-slate-100 my-1" />

          {/* Ver mis resultados */}
          <Link
            href={resultadosHref}
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 border border-blue-200 py-2.5 text-blue-700 font-semibold transition-colors hover:bg-blue-100"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
            </svg>
            Ver mis resultados
          </Link>

          <Link
            href="/reservar"
            onClick={() => setOpen(false)}
            className="rounded-xl bg-blue-600 py-2.5 text-center text-white font-semibold shadow-sm hover:bg-blue-700"
          >
            Reservar cita
          </Link>

          <Link
            href={userHref}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-slate-700 hover:text-blue-700 pt-1 text-xs"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            {hasSession ? userLabel : "Iniciar sesión"}
          </Link>
        </nav>
      )}
    </>
  );
}
