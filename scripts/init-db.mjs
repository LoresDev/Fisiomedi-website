import { readFile } from "fs/promises";
import path from "path";
import pg from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:fisiomedi2026@localhost:5432/fisiomedi";

async function main() {
  const sql = await readFile(
    path.join(process.cwd(), "scripts", "schema.sql"),
    "utf-8"
  );
  const pool = new pg.Pool({ connectionString });
  try {
    await pool.query(sql);
    console.log("Base de datos inicializada: tablas creadas.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Error inicializando la base de datos:", err.message);
  process.exit(1);
});
