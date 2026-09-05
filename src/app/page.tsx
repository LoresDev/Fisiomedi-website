import Link from "next/link";
import { clinic, services, highlights } from "@/config/clinic";
import { HeroBanner } from "@/components/HeroBanner";

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {highlights.map((h) => (
            <div key={h.title} className="rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg text-slate-900 mb-2">{h.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Nuestros servicios
              </h2>
              <p className="mt-2 text-slate-600">
                Terapias diseñadas para cada tipo de necesidad.
              </p>
            </div>
            <Link
              href="/servicios"
              className="hidden sm:inline-block text-blue-700 font-medium hover:underline"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col"
              >
                <span className="w-10 h-1 rounded-full bg-blue-500 mb-4" />
                <h3 className="font-semibold text-lg text-slate-900">{s.name}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">
                  {s.description}
                </p>
                <p className="mt-4 text-xs text-slate-400">
                  Duración aprox.: {s.durationMin} min
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-3xl bg-blue-700 text-white px-8 py-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            ¿Listo para empezar tu recuperación?
          </h2>
          <p className="mt-3 text-blue-100 max-w-xl mx-auto">
            Reserva tu cita en menos de un minuto. Te esperamos de lunes a sábado,
            de 9:00 am a 8:00 pm.
          </p>
          <Link
            href="/reservar"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
          >
            Reservar ahora
          </Link>
        </div>
      </section>
    </>
  );
}
