"use server";

import { redirect } from "next/navigation";
import { login } from "@/lib/auth";

export async function loginAction(formData: FormData): Promise<void> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const user = await login(username, password);
  if (!user) redirect("/login?error=1");
  if (user.role === "paciente") redirect("/mi-cuenta");
  redirect("/admin");
}
