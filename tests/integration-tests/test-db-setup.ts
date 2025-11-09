import { execSync } from "node:child_process";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

export async function createTestDb() {
	const container = await new PostgreSqlContainer("postgres:16")
		.withDatabase("test_db")
		.withUsername("test")
		.withPassword("test")
		.withStartupTimeout(120000)
		.start();

	const connectionString = container.getConnectionUri();

	await waitForDatabase(connectionString);

	const client = postgres(connectionString);
	const db = drizzle(client, { schema });

	await pushSchema(connectionString);

	return { db, client, container };
}

async function waitForDatabase(connectionString: string, maxRetries = 10) {
	for (let i = 0; i < maxRetries; i++) {
		try {
			const testClient = postgres(connectionString, { max: 1 }); // Connection pool of 1
			await testClient`SELECT 1`;
			await testClient.end();
			console.log("Database is ready!");
			return;
		} catch (_) {
			console.log(`Waiting for database... (attempt ${i + 1}/${maxRetries})`);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}
	throw new Error("Database did not become ready in time");
}

async function pushSchema(databaseUrl: string) {
	await execSync(`pnpm exec drizzle-kit push --config=drizzle-test.config.ts`, {
		env: {
			// ...process.env,
			NODE_ENV: "test",
			DATABASE_URL: databaseUrl,
			PATH: process.env.PATH,
		},
		stdio: "inherit",
	});
}

export type TestDb = Awaited<ReturnType<typeof createTestDb>>;
