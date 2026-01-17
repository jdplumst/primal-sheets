import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const TEST_DB_URL =
	process.env.DATABASE_URL ?? `file:${process.cwd()}/tmp/primal-sheets-tests.db`;

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: TEST_DB_URL,
	},
});