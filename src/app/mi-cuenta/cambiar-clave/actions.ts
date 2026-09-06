"use server";

import { redirect } from "next/navigation";
import { getSession, refreshSession } from "@/lib/auth";
import { changePassword, findUser, setMustChangePassword } from "@/lib/store";

export async function changePasswordAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session || session.role !== "paciente") redirect("/login");

  const newPassword = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) redirect("/mi-cuenta/cambiar-clave?error=short");
  if (newPassword !== confirm) redirect("/mi-cuenta/cambiar-clave?error=mismatch");

  const user = await findUser(session.username);
  if (!user) redirect("/login");

  const ok = await changePassword(user.id, newPassword);
  if (!ok) redirect("/mi-cuenta/cambiar-clave?error=fail");

  await setMustChangePassword(user.id, false);
  await refreshSession();
  redirect("/mi-cuenta");
}
