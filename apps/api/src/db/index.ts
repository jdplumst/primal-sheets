import { createClient as createHttpClient } from "@libsql/client/http";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export function createDb(env: {
	DATABASE_URL?: string;
	DATABASE_AUTH_TOKEN?: string;
}) {
	const url = env.DATABASE_URL ?? (process.env.DATABASE_URL as string);
	const authToken =
		env.DATABASE_AUTH_TOKEN ?? (process.env.DATABASE_AUTH_TOKEN as string);

	let createClientFn: typeof createHttpClient = createHttpClient;
	if (url?.startsWith("file:")) {
		createClientFn = require("@libsql/client").createClient;
	}

	const client = createClientFn({ url, authToken });
	return drizzle(client, { schema });
}

export type Database = ReturnType<typeof createDb>;
