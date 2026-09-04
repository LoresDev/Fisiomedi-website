"use client";

import Link from "next/link";
import { useState } from "react";
import { clinic } from "@/config/clinic";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const [open, setOpen] = useState(false);

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
        </nav>

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
      </div>

      {open && (
        <nav className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-3 text-sm font-medium">
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
        </nav>
      )}
    </header>
  );
}
