"use client";

import Link from "next/link";
import { useState } from "react";

interface Props {
  links: { href: string; label: string }[];
  userHref: string;
  userLabel: string;
  hasSession: boolean;
}

export function MobileNav({ links, userHref, userLabel, hasSession }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Abrir menú"
        onClick={() => setOpen(!open)}
        className="md:hidden p-2 text-slate-700"
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
        <nav className="md:hidden absolute top-16 left-0 right-0 border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-3 text-sm font-medium shadow-lg">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-slate-700 hover:text-blue-700"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/reservar"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-full bg-blue-600 px-5 py-2.5 text-center text-white"
          >
            Reservar cita
          </Link>
          <Link
            href={userHref}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-slate-700 hover:text-blue-700"
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
