"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { login, logout, requireAdmin, requireSession } from "@/lib/auth";
import { setAppointmentStatus, addAppointment, type AppointmentStatus } from "@/lib/appointments";
import {
  addExam,
  addHistoryEntry,
  changePassword,
  createPatient,
  createUser,
  deleteExam,
  deletePatient,
  deleteUser,
  getPatient,
  getUsers,
  saveExamFile,
} from "@/lib/store";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAction(formData: FormData): Promise<void> {
  const user = await login(str(formData, "username"), String(formData.get("password") ?? ""));
  if (!user) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect("/admin/login");
}

export async function updateStatusAction(formData: FormData): Promise<void> {
  await requireSession();
  const id = str(formData, "id");
  const status = str(formData, "status") as AppointmentStatus;
  const allowed: AppointmentStatus[] = ["pendiente", "confirmada", "cancelada", "completada"];
  if (id && allowed.includes(status)) {
    await setAppointmentStatus(id, status);
  }
  revalidatePath("/admin/citas");
  revalidatePath("/admin");
}

export async function createPatientAction(formData: FormData): Promise<void> {
  await requireSession();
  const name = str(formData, "name");
  if (!name || !str(formData, "phone")) {
    redirect("/admin/pacientes/nuevo?error=1");
  }
  const patient = await createPatient({
    name,
    docId: str(formData, "docId"),
    phone: str(formData, "phone"),
    email: str(formData, "email") || undefined,
    birthDate: str(formData, "birthDate") || undefined,
    gender: str(formData, "gender") || undefined,
    address: str(formData, "address") || undefined,
    notes: str(formData, "notes") || undefined,
  });
  revalidatePath("/admin/pacientes");
  redirect(`/admin/pacientes/${patient.id}`);
}

export async function deletePatientAction(formData: FormData): Promise<void> {
  await requireSession();
  await deletePatient(str(formData, "id"));
  revalidatePath("/admin/pacientes");
  redirect("/admin/pacientes");
}

export async function addHistoryEntryAction(formData: FormData): Promise<void> {
  const session = await requireSession();
  const patientId = str(formData, "patientId");
  const reason = str(formData, "reason");
  if (!patientId || !reason || !(await getPatient(patientId))) {
    redirect("/admin/pacientes");
  }
  await addHistoryEntry({
    patientId,
    date: str(formData, "date") || new Date().toISOString().slice(0, 10),
    professional: session.name,
    reason,
    diagnosis: str(formData, "diagnosis") || undefined,
    treatment: str(formData, "treatment") || undefined,
  });
  revalidatePath(`/admin/pacientes/${patientId}`);
  redirect(`/admin/pacientes/${patientId}#historia`);
}

export async function uploadExamAction(formData: FormData): Promise<void> {
  const session = await requireSession();
  const patientId = str(formData, "patientId");
  const title = str(formData, "title");
  const file = formData.get("file");
  if (!patientId || !title || !(file instanceof File) || !(await getPatient(patientId))) {
    redirect(`/admin/pacientes/${patientId}?error=examen`);
  }
  const saved = await saveExamFile(file);
  if (!saved) {
    redirect(`/admin/pacientes/${patientId}?error=examen`);
  }
  await addExam({
    patientId,
    title,
    examDate: str(formData, "examDate") || undefined,
    notes: str(formData, "notes") || undefined,
    fileName: saved.fileName,
    originalName: file.name,
    mimeType: saved.mimeType,
    size: saved.size,
    createdBy: session.name,
  });
  revalidatePath(`/admin/pacientes/${patientId}`);
  redirect(`/admin/pacientes/${patientId}#examenes`);
}

export async function deleteExamAction(formData: FormData): Promise<void> {
  await requireSession();
  const id = str(formData, "id");
  const patientId = str(formData, "patientId");
  await deleteExam(id);
  revalidatePath(`/admin/pacientes/${patientId}`);
  redirect(`/admin/pacientes/${patientId}#examenes`);
}

export async function createInternalAppointmentAction(formData: FormData): Promise<void> {
  await requireSession();
  const patientId = str(formData, "patientId");
  let patientName = str(formData, "name");
  let phone = str(formData, "phone");
  if (patientId) {
    const patient = await getPatient(patientId);
    if (patient) {
      patientName = patient.name;
      phone = phone || patient.phone;
    }
  }
  if (!patientName || !phone) {
    redirect("/admin/citas?error=datos");
  }
  try {
    await addAppointment({
      name: patientName,
      phone,
      serviceId: str(formData, "serviceId"),
      date: str(formData, "date"),
      time: str(formData, "time"),
      notes: str(formData, "notes"),
      patientId: patientId || undefined,
      source: "interno",
    });
  } catch {
    redirect("/admin/citas?error=servicio");
  }
  revalidatePath("/admin/citas");
  redirect("/admin/citas");
}

export async function createUserAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const username = str(formData, "username");
  const password = String(formData.get("password") ?? "");
  const role = str(formData, "role") === "admin" ? "admin" : "terapeuta";
  const created = await createUser({ username, name: str(formData, "name"), role, password });
  if (!created) redirect("/admin/usuarios?error=1");
  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const id = str(formData, "id");
  const users = await getUsers();
  const self = users.find((u) => u.id === id);
  if (self && self.username === session.username) {
    redirect("/admin/usuarios?error=self");
  }
  await deleteUser(id);
  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function resetPasswordAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const ok = await changePassword(
    str(formData, "id"),
    String(formData.get("password") ?? "")
  );
  if (!ok) redirect("/admin/usuarios?error=pass");
  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}
