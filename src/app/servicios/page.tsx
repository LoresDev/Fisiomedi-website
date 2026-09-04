import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/config/clinic";

export const metadata: Metadata = {
  title: "Servicios",
};

export default function ServiciosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        Nuestros servicios
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600 leading-relaxed">
        Contamos con tratamientos de terapia física y rehabilitación para toda la
        familia. Cada plan se adapta a tu diagnóstico y objetivos.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.id}
            className="group rounded-2xl border border-slate-200 p-6 flex flex-col hover:border-blue-400 hover:shadow-md transition-all"
          >
            <span className="w-10 h-1 rounded-full bg-blue-500 mb-4" />
            <h2 className="font-semibold text-lg text-slate-900">{s.name}</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">
              {s.description}
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-slate-400">{s.durationMin} min</span>
              <Link
                href={`/reservar?servicio=${s.id}`}
                className="text-sm font-medium text-blue-700 group-hover:underline"
              >
                Reservar →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
