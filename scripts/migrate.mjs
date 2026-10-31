import { readFile } from "node:fs/promises";
import pg from "pg";

const { Pool } = pg;
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const migration = await readFile(new URL("../database/migrations/001_initial.sql", import.meta.url), "utf8");
  await pool.query(migration);
  console.log("Database schema created.");
} finally {
  await pool.end();
}
