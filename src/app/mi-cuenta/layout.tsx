import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function MiCuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "paciente") redirect("/admin");
  return <>{children}</>;
}
