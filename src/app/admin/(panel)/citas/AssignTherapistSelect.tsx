"use client";

import { assignTherapistAction } from "../../actions";

interface StaffMember {
  id: string;
  name: string;
  role: string;
}

interface Props {
  appointmentId: string;
  currentTherapistId?: string;
  therapistName?: string;
  staff: StaffMember[];
}

export function AssignTherapistSelect({
  appointmentId,
  currentTherapistId,
  staff,
}: Props) {
  return (
    <form action={assignTherapistAction} className="inline-block">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <select
        name="therapistId"
        defaultValue={currentTherapistId || ""}
        onChange={(e) => e.target.form?.requestSubmit()}
        className={`text-xs rounded-lg border py-1 px-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors ${
          currentTherapistId
            ? "border-slate-300 bg-white text-slate-800 hover:border-slate-400"
            : "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
        }`}
        title="Asignar especialista para esta cita"
      >
        <option value="">— Sin asignar —</option>
        {staff.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.role === "admin" ? "Especialista" : "Fisioterapeuta"})
          </option>
        ))}
      </select>
    </form>
  );
}
