import { createClient as createHttpClient } from "@libsql/client/http";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
	client: ReturnType<typeof createHttpClient> | undefined;
};

const url = process.env.DATABASE_URL as string;
const authToken = process.env.DATABASE_AUTH_TOKEN as string;

// Use HTTP client for remote URLs (Vercel/production) and standard client for local file URLs
let createClient: typeof createHttpClient;

if (url?.startsWith("file:")) {
	const mod = await import("@libsql/client");
	createClient = mod.createClient;
} else {
	createClient = createHttpClient;
}

const client = globalForDb.client ?? createClient({ url, authToken });
if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });

export type Database = typeof db;
