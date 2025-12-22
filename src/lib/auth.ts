import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@/db";
import { env } from "@/env";

export const auth = betterAuth({
	...(env.BETTER_AUTH_URL && { baseURL: env.BETTER_AUTH_URL }),
	trustedOrigins: [
		"http://localhost:3000",
		...(env.BETTER_AUTH_URL ? [env.BETTER_AUTH_URL] : []),
	],
	socialProviders: {
		discord: {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		},
	},
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	plugins: [tanstackStartCookies()],
});
