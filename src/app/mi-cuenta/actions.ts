"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { updatePatient } from "@/lib/store";

export async function updatePatientContactAction(
  formData: FormData
): Promise<void> {
  const session = await getSession();
  if (!session || session.role !== "paciente" || !session.patientId) {
    return;
  }

  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!phone) return;

  await updatePatient(session.patientId, {
    phone,
    email: email || undefined,
    address: address || undefined,
  });

  revalidatePath("/mi-cuenta");
}
