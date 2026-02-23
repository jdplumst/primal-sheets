import { createClient as createHttpClient } from "@libsql/client/http";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

let _db: ReturnType<typeof drizzle> | undefined;

function getDb() {
	if (_db) return _db;

	const url = process.env.DATABASE_URL as string;
	const authToken = process.env.DATABASE_AUTH_TOKEN as string;

	// Use HTTP client for remote URLs (Cloudflare/production) and standard client for local file URLs
	let createClientFn: typeof createHttpClient = createHttpClient;

	if (url?.startsWith("file:")) {
		createClientFn = require("@libsql/client").createClient;
	}

	const client = createClientFn({ url, authToken });
	_db = drizzle(client, { schema });
	return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
	get: (_, prop) => {
		const target = getDb();
		const val = (target as any)[prop];
		return typeof val === "function" ? val.bind(target) : val;
	},
});

export type Database = ReturnType<typeof drizzle>;
