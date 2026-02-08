import { execSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/db/schema";

export async function createTestDb() {
	const tempDir = await mkdtemp(path.join(tmpdir(), "primal-sheets-test-db-"));
	const dbFilePath = path.join(tempDir, "test.db");
	const databaseUrl = `file:${dbFilePath}`;

	await pushSchema(databaseUrl);

	const client = createClient({ url: databaseUrl });
	const db = drizzle(client, { schema });

	async function cleanup() {
		client.close();
		await rm(tempDir, { recursive: true, force: true });
	}

	return { db, client, databaseUrl, cleanup };
}

async function pushSchema(databaseUrl: string) {
	execSync(`bunx drizzle-kit push`, {
		env: {
			NODE_ENV: "test",
			DATABASE_URL: databaseUrl,
			PATH: process.env.PATH,
		},
		stdio: "inherit",
		cwd: path.join(process.cwd(), "apps/api"), // or wherever your app is
	});
}

export type TestDb = Awaited<ReturnType<typeof createTestDb>>;
