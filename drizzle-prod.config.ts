import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "turso",
	dbCredentials: {
		url: process.env.PROD_DATABASE_URL as string,
		authToken: process.env.PROD_DATABASE_AUTH_TOKEN as string,
	},
});
