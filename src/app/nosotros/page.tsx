import type { Metadata } from "next";
import Link from "next/link";
import { clinic, highlights } from "@/config/clinic";

export const metadata: Metadata = {
  title: "Nosotros",
};

const values = [
  {
    title: "Misión",
    text: "Brindar atención integral de terapia física y rehabilitación con estándares de calidad, ayudando a cada paciente a recuperar su funcionalidad y bienestar.",
  },
  {
    title: "Visión",
    text: "Ser el centro de referencia en rehabilitación de San Martín de Porres y Lima Norte, reconocido por la confianza de nuestros pacientes.",
  },
  {
    title: "Valores",
    text: "Empatía, responsabilidad, puntualidad y trato humano. Creemos que una buena recuperación empieza por sentirse bien atendido.",
  },
];

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        Sobre {clinic.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600 leading-relaxed">
        Somos un centro especializado en terapia física y rehabilitación ubicado en
        San Martín de Porres, Lima. Nuestro objetivo es acompañarte en cada etapa de
        tu recuperación con tratamientos modernos y un equipo humano cercano.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="rounded-2xl bg-slate-50 p-6">
            <h2 className="font-semibold text-blue-700 uppercase text-sm tracking-wide mb-2">
              {v.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">{v.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {highlights.map((h) => (
          <div key={h.title} className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-slate-900">{h.title}</h3>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">{h.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-3xl bg-slate-900 text-white p-10 text-center">
        <h2 className="text-2xl font-bold">Conócenos también en Instagram</h2>
        <p className="mt-2 text-slate-300">
          Síguenos como {clinic.instagramHandle} para tips de salud y novedades.
        </p>
        <a
          href={clinic.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-blue-500 px-7 py-3 font-semibold hover:bg-blue-400 transition-colors"
        >
          Seguir en Instagram
        </a>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/reservar"
          className="inline-block rounded-full bg-blue-600 px-8 py-3.5 font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Reserva tu cita
        </Link>
      </div>
    </div>
  );
}
