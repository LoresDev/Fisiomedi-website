import { Pool } from "pg";

const globalForPg = globalThis as unknown as { pool?: Pool };

export const pool =
  globalForPg.pool ??
  new Pool({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://postgres:fisiomedi2026@localhost:5432/fisiomedi",
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pool = pool;
}

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export async function queryOne<T>(
  text: string,
  params?: unknown[]
): Promise<T | undefined> {
  const rows = await query<T>(text, params);
  return rows[0];
}
