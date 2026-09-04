import Link from "next/link";
import { clinic } from "@/config/clinic";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold">
              F
            </span>
            <span className="text-lg font-bold text-white">{clinic.name}</span>
          </div>
          <p className="text-sm leading-relaxed">{clinic.tagline}.</p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
            Contacto
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={clinic.phoneHref} className="hover:text-blue-400">
                {clinic.phone}
              </a>
            </li>
            <li>
              <a
                href={clinic.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400"
              >
                {clinic.address}
              </a>
            </li>
            <li>
              <a
                href={clinic.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400"
              >
                Instagram {clinic.instagramHandle}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
            Horario
          </h3>
          <ul className="space-y-2 text-sm">
            {clinic.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span>{h.days}</span>
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {clinic.name}. Todos los derechos reservados.{" "}
        <Link href="/admin" className="hover:text-blue-400">
          Panel interno
        </Link>
      </div>
    </footer>
  );
}
