import { Pool, type PoolClient } from "pg";

declare global {
  var nordPool: Pool | undefined;
}

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required. Copy .env.example and configure PostgreSQL before starting the store.");
  }

  if (!globalThis.nordPool) {
    globalThis.nordPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: true },
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  return globalThis.nordPool;
}

export async function query<T = Record<string, unknown>>(text: string, values: unknown[] = []) {
  const result = await getPool().query(text, values);
  return { ...result, rows: result.rows as T[] };
}

export async function queryInTransaction<T = Record<string, unknown>>(
  client: PoolClient,
  text: string,
  values: unknown[] = [],
) {
  const result = await client.query(text, values);
  return { ...result, rows: result.rows as T[] };
}

export async function withTransaction<T>(run: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await run(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
