import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyCredentials, type User } from "@/lib/store";

const COOKIE_NAME = "fisiomedi_session";
const SESSION_DAYS = 7;

export interface Session {
  username: string;
  name: string;
  role: "admin" | "terapeuta" | "paciente";
  patientId?: string;
}

function secret(): string {
  return process.env.SESSION_SECRET || "fisiomedi-session-secret-2026";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

function createToken(session: Session): string {
  const payload = Buffer.from(
    JSON.stringify({
      ...session,
      exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
    })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function parseToken(token: string | undefined): Session | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || sign(payload) !== sig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    if (!(["admin", "terapeuta", "paciente"] as string[]).includes(data.role)) return null;
    return {
      username: data.username,
      name: data.name,
      role: data.role,
      patientId: data.patientId,
    };
  } catch {
    return null;
  }
}

export async function login(
  username: string,
  password: string
): Promise<User | null> {
  const user = await verifyCredentials(username, password);
  if (!user) return null;
  const store = await cookies();
  store.set(COOKIE_NAME, createToken({
    username: user.username,
    name: user.name,
    role: user.role,
    patientId: user.patientId,
  }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return user;
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return parseToken(store.get(COOKIE_NAME)?.value);
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireAdmin(): Promise<Session> {
  const session = await requireSession();
  if (session.role !== "admin") redirect("/admin");
  return session;
}
