import { DATABASE_URL } from "@/consts/config";
import pg from "pg"

const { Pool } = pg

const pool = new Pool({
  connectionString: DATABASE_URL,
})

export const query = (text: string, params?: any[]) => pool.query(text, params);