"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clinic } from "@/config/clinic";

const slides = [
  {
    src: "/hero-slide1.jpg",
    alt: "Recepción clínica FisioMedi",
    heading: "Tu recuperación es\nnuestro compromiso",
    sub: clinic.heroText,
  },
  {
    src: "/hero-slide2.jpg",
    alt: "Fisioterapia manual",
    heading: "Atención profesional\ny personalizada",
    sub: "Nuestros fisioterapeutas certificados te acompañan en cada etapa del tratamiento.",
  },
  {
    src: "/hero-slide3.jpg",
    alt: "Rehabilitación activa",
    heading: "Recupera tu movilidad\ny calidad de vida",
    sub: "Programas de rehabilitación diseñados para que vuelvas a moverte con libertad.",
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = (idx: number) => {
    if (idx === current) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 500);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((p) => (p + 1) % slides.length);
        setFading(false);
      }, 500);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-[580px] md:h-[680px] overflow-hidden">
      {/* Background images — all mounted, opacity toggled */}
      {slides.map((s, i) => (
        <div
          key={s.src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? (fading ? 0 : 1) : 0 }}
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            className="object-cover object-center"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-blue-900/60 to-transparent" />

      {/* Content */}
      <div
        className="relative h-full flex flex-col justify-center mx-auto max-w-6xl px-4 md:px-8 transition-all duration-500"
        style={{ opacity: fading ? 0 : 1, transform: fading ? "translateY(10px)" : "translateY(0)" }}
      >
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
          {clinic.tagline}
        </p>

        <h1 className="max-w-xl text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white tracking-tight whitespace-pre-line">
          {slide.heading}
        </h1>

        <p className="mt-5 max-w-md text-base md:text-lg text-blue-100 leading-relaxed">
          {slide.sub}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/reservar"
            className="rounded-full bg-white px-7 py-3.5 font-semibold text-blue-700 hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/30"
          >
            Reservar cita online
          </Link>
          <a
            href={`https://wa.me/${clinic.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/50 bg-white/10 backdrop-blur-sm px-7 py-3.5 font-semibold text-white hover:bg-white/20 transition-colors"
          >
            WhatsApp
          </a>
        </div>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-12">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                height: "6px",
                width: i === current ? "32px" : "6px",
                backgroundColor: i === current ? "white" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Arrow buttons */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        aria-label="Anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        aria-label="Siguiente"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}
