import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema"

console.log("POSTGRES_URL:", process.env.POSTGRES_URL);

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is required");
}

const sql = neon(process.env.POSTGRES_URL);
export const db = drizzle(sql, {schema, logger: true});