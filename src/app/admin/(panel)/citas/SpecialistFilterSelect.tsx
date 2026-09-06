"use client";

import { useRouter } from "next/navigation";

interface StaffMember {
  id: string;
  name: string;
  role: string;
}

interface Props {
  staff: StaffMember[];
  currentTherapist?: string;
  currentStatus?: string;
}

export function SpecialistFilterSelect({
  staff,
  currentTherapist,
  currentStatus,
}: Props) {
  const router = useRouter();

  function handleChange(val: string) {
    const params = new URLSearchParams();
    if (currentStatus) params.set("estado", currentStatus);
    if (val) params.set("terapeuta", val);
    const qs = params.toString();
    router.push(`/admin/citas${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-slate-500 font-medium">Filtrar por médico:</span>
      <select
        value={currentTherapist || ""}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
      >
        <option value="">Todos los especialistas</option>
        {staff.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.role === "admin" ? "Especialista" : "Fisioterapeuta"})
          </option>
        ))}
      </select>
    </div>
  );
}
