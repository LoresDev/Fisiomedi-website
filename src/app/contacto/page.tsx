import type { Metadata } from "next";
import { clinic } from "@/config/clinic";

export const metadata: Metadata = {
  title: "Contacto",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        Contáctanos
      </h1>
      <p className="mt-3 text-slate-600">
        Estamos listos para atenderte. Visítanos o escríbenos por cualquier canal.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-1">Dirección</h2>
            <p className="text-sm text-slate-600">{clinic.address}</p>
            <a
              href={clinic.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-blue-700 hover:underline"
            >
              Ver en Google Maps →
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-1">Teléfono / WhatsApp</h2>
            <a href={clinic.phoneHref} className="text-sm text-slate-600 hover:text-blue-700">
              {clinic.phone}
            </a>
            <div className="mt-3">
              <a
                href={`https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(
                  "Hola Fisiomedi, quisiera información sobre sus servicios."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
              >
                Escribir por WhatsApp
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Horario de atención</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              {clinic.hours.map((h) => (
                <li key={h.days} className="flex justify-between gap-4">
                  <span>{h.days}</span>
                  <span className="font-medium text-slate-800">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-200 min-h-[420px]">
          <iframe
            title="Ubicación Fisiomedi"
            src="https://www.google.com/maps?q=Av.%20Universitaria%20954%2C%20San%20Martin%20de%20Porres%2C%20Lima%2C%20Peru&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 420 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
