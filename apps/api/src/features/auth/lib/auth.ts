// auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { db } from "@/db";

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	socialProviders: {
		discord: {
			clientId: process.env.DISCORD_CLIENT_ID as string,
			clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
		},
	},
	trustedOrigins: [process.env.CLIENT_URL ?? "http://localhost:5173"],
	plugins: [openAPI()],
	advanced: {
		defaultCookieAttributes: {
			sameSite: "lax",
			secure: true,
		},
		crossSubDomainCookies: {
			enabled: false,
		},
	},
});
