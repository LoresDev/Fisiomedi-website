"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/login-slide1.jpg",
    alt: "Sesión de fisioterapia",
    caption: "Tratamiento especializado",
    sub: "Fisioterapia manual con profesionales certificados",
  },
  {
    src: "/login-slide2.jpg",
    alt: "Sala de rehabilitación",
    caption: "Equipamiento de última generación",
    sub: "Instalaciones modernas para tu rehabilitación",
  },
  {
    src: "/login-slide3.jpg",
    alt: "Rehabilitación de rodilla",
    caption: "Atención personalizada",
    sub: "Acompañamiento cercano en cada etapa de tu recuperación",
  },
];

export function LoginCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setAnimating(false);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (index: number) => {
    if (index === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 400);
  };

  return (
    <div className="relative w-full h-full min-h-screen">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? (animating ? 0 : 1) : 0 }}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="60vw"
          />
        </div>
      ))}

      {/* Caption overlay */}
      <div className="absolute bottom-32 left-10 right-10 text-white transition-all duration-500"
           style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(8px)" : "translateY(0)" }}>
        <p className="text-lg font-bold drop-shadow">{slides[current].caption}</p>
        <p className="text-sm text-white/75 mt-1 drop-shadow">{slides[current].sub}</p>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-10 left-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              backgroundColor: i === current ? "white" : "rgba(255,255,255,0.45)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
