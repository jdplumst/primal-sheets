import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { createDb } from "@/db";

export function createAuth(env: {
	BETTER_AUTH_URL?: string;
	BETTER_AUTH_SECRET?: string;
	DISCORD_CLIENT_ID?: string;
	DISCORD_CLIENT_SECRET?: string;
	CLIENT_URL?: string;
	DATABASE_URL?: string;
	DATABASE_AUTH_TOKEN?: string;
}) {
	const db = createDb(env);

	return betterAuth({
		baseURL:
			env.BETTER_AUTH_URL ??
			process.env.BETTER_AUTH_URL ??
			"http://localhost:3000",
		secret:
			env.BETTER_AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET ?? "secret",
		database: drizzleAdapter(db, { provider: "sqlite" }),
		socialProviders: {
			discord: {
				clientId: env.DISCORD_CLIENT_ID ?? process.env.DISCORD_CLIENT_ID ?? "",
				clientSecret:
					env.DISCORD_CLIENT_SECRET ?? process.env.DISCORD_CLIENT_SECRET ?? "",
			},
		},
		trustedOrigins: [
			env.CLIENT_URL ?? process.env.CLIENT_URL ?? "http://localhost:5173",
		],
		plugins: [openAPI()],
		advanced: {
			defaultCookieAttributes: {
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production",
			},
			crossSubDomainCookies: {
				enabled: false,
			},
		},
	});
}
