import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "@/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
	client: ReturnType<typeof createClient> | undefined;
};

const client =
	globalForDb.client ??
	createClient({
		url: env.DATABASE_URL,
		// Turso/libsql tokens are only required for remote DBs.
		authToken: env.DATABASE_AUTH_TOKEN,
	});
if (env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });

export type Database = typeof db;
