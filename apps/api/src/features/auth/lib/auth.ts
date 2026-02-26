import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { db } from "@/db";

let _auth: ReturnType<typeof betterAuth> | undefined;

function getAuth() {
	if (_auth) return _auth;
	_auth = betterAuth({
		database: drizzleAdapter(db, {
			provider: "sqlite",
		}),
		socialProviders: {
			discord: {
				clientId: process.env.DISCORD_CLIENT_ID as string,
				clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
			},
		},
		trustedOrigins: [
			process.env.CLIENT_URL ?? "http://localhost:5173",
			// Allows us to trust .vercel.app origins implicitly if dynamic origins are needed
		],
		plugins: [openAPI()],
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				partitioned: true,
			},
		},
	});
	return _auth;
}

export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
	get: (_, prop) => {
		const target = getAuth();
		const val = (target as any)[prop];
		return typeof val === "function" ? val.bind(target) : val;
	},
});
