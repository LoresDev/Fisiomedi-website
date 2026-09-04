import { NextRequest, NextResponse } from "next/server";
import {
  addAppointment,
  getAvailableSlots,
  isValidBookingDate,
} from "@/lib/appointments";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? "";
  if (!isValidBookingDate(date)) {
    return NextResponse.json(
      { error: "Fecha no válida o fuera del horario de atención" },
      { status: 400 }
    );
  }
  const slots = await getAvailableSlots(date);
  return NextResponse.json({ date, slots });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const serviceId = String(body.serviceId ?? "");
  const date = String(body.date ?? "");
  const time = String(body.time ?? "");
  const notes = String(body.notes ?? "").trim();

  if (name.length < 3) {
    return NextResponse.json({ error: "Ingresa tu nombre completo" }, { status: 400 });
  }
  if (phone.length < 6) {
    return NextResponse.json({ error: "Ingresa un teléfono válido" }, { status: 400 });
  }
  if (!isValidBookingDate(date)) {
    return NextResponse.json(
      { error: "Selecciona una fecha válida (lunes a sábado)" },
      { status: 400 }
    );
  }

  const available = await getAvailableSlots(date);
  if (!available.includes(time)) {
    return NextResponse.json(
      { error: "Ese horario ya no está disponible, elige otro" },
      { status: 409 }
    );
  }

  try {
    const appointment = await addAppointment({
      name,
      phone,
      email: email || undefined,
      serviceId,
      date,
      time,
      notes: notes || undefined,
    });
    return NextResponse.json({ ok: true, appointment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo crear la cita" }, { status: 400 });
  }
}
