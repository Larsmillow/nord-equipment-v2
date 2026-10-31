import { hash } from "bcryptjs";
import pg from "pg";

const { Pool } = pg;
const login = process.env.ADMIN_LOGIN?.trim();
const password = process.env.ADMIN_PASSWORD;
if (!process.env.DATABASE_URL || !login || !password || password.length < 12) {
  throw new Error("Set DATABASE_URL, ADMIN_LOGIN and ADMIN_PASSWORD (at least 12 characters) in the environment.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const passwordHash = await hash(password, 12);
  await pool.query(
    `INSERT INTO admin_users (login, password_hash, role)
     VALUES ($1, $2, 'owner')
     ON CONFLICT (login) DO UPDATE SET password_hash = EXCLUDED.password_hash, active = true`,
    [login, passwordHash],
  );
  console.log(`Admin account created or updated for ${login}.`);
} finally {
  await pool.end();
}
