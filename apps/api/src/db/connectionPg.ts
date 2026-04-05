import pg from "pg";
import { DATABASE_URL } from "@consts/config";
import { drizzle } from "drizzle-orm/node-postgres";

const { Pool } = pg

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const db = drizzle(pool);