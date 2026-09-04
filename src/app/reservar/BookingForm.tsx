"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { clinic, services } from "@/config/clinic";

interface Created {
  id: string;
  serviceName: string;
  date: string;
  time: string;
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function BookingForm() {
  const params = useSearchParams();
  const preselected = params.get("servicio");

  const [serviceId, setServiceId] = useState(preselected ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsMsg, setSlotsMsg] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<Created | null>(null);

  const minDate = useMemo(() => todayStr(), []);

  function handleDateChange(value: string) {
    setDate(value);
    setTime("");
    setSlots([]);
    setSlotsMsg("");
    if (!value) return;
    fetch(`/api/appointments?date=${value}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error");
        return data as { slots: string[] };
      })
      .then((data) => {
        setSlots(data.slots);
        setSlotsMsg(data.slots.length === 0 ? "No hay horarios ese día." : "");
      })
      .catch((e: Error) => {
        setSlots([]);
        setSlotsMsg(e.message);
      });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!serviceId) return setError("Selecciona un servicio.");
    if (!date) return setError("Selecciona una fecha.");
    if (!time) return setError("Selecciona un horario.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, serviceId, date, time, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al reservar");
      setCreated({
        id: data.appointment.id,
        serviceName: data.appointment.serviceName,
        date: data.appointment.date,
        time: data.appointment.time,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return (
      <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-8 text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">¡Reserva registrada!</h2>
        <p className="mt-3 text-slate-700">
          <strong>{created.serviceName}</strong> — {created.date} a las{" "}
          <strong>{created.time}</strong>
        </p>
        <p className="mt-2 text-sm text-slate-500">Código de reserva: {created.id.slice(0, 8).toUpperCase()}</p>
        <p className="mt-4 text-sm text-slate-600">
          Confirma tu asistencia por WhatsApp:
        </p>
        <a
          href={`https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(
            `Hola Fisiomedi, reservé ${created.serviceName} el ${created.date} a las ${created.time}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 transition-colors"
        >
          Confirmar por WhatsApp
        </a>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-8">
      <fieldset>
        <legend className="font-semibold text-slate-900 mb-3">1. Servicio</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <label
              key={s.id}
              className={`cursor-pointer rounded-xl border p-4 text-sm transition-colors ${
                serviceId === s.id
                  ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                  : "border-slate-300 hover:border-blue-400"
              }`}
            >
              <input
                type="radio"
                name="serviceId"
                value={s.id}
                checked={serviceId === s.id}
                onChange={() => setServiceId(s.id)}
                className="sr-only"
              />
              <span className="font-medium text-slate-900">{s.name}</span>
              <span className="mt-1 block text-xs text-slate-500">{s.durationMin} min</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-semibold text-slate-900 mb-3">2. Fecha y hora</legend>
        <input
          type="date"
          value={date}
          min={minDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className={`${inputCls} max-w-xs`}
        />
        {slotsMsg && <p className="mt-2 text-sm text-slate-500">{slotsMsg}</p>}
        {slots.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {slots.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  time === t
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-slate-400">
          Atendemos de lunes a sábado de {clinic.schedule.startHour}:00 am a{" "}
          {clinic.schedule.endHour}:00 pm.
        </p>
      </fieldset>

      <fieldset>
        <legend className="font-semibold text-slate-900 mb-3">3. Tus datos</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Nombre completo *</span>
            <input
              type="text"
              required
              minLength={3}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              placeholder="Ej: María Torres"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-600">Teléfono *</span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputCls}
              placeholder="999 999 999"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm text-slate-600">Email (opcional)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              placeholder="tu@email.com"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm text-slate-600">
              Motivo de consulta (opcional)
            </span>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={inputCls}
              placeholder="Cuéntanos brevemente qué te gustaría tratar..."
            />
          </label>
        </div>
      </fieldset>

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto rounded-full bg-blue-600 px-10 py-3.5 font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Reservando..." : "Confirmar reserva"}
      </button>
    </form>
  );
}
