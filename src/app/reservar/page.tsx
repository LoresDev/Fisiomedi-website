import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "./BookingForm";

export const metadata: Metadata = {
  title: "Reservar cita",
};

export default function ReservarPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        Reserva tu cita
      </h1>
      <p className="mt-3 text-slate-600">
        Elige el servicio, la fecha y la hora. Te contactaremos para confirmar tu
        asistencia.
      </p>
      <Suspense>
        <BookingForm />
      </Suspense>
    </div>
  );
}
