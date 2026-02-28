import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { auth } from "@/features/auth/lib/auth";
import type { Context } from "@/types";
import authRouter, { requireAuth } from "./features/auth";
import campaignInvitationsRouter from "./features/campaigns/routes/campaign-invitation-routes";
import campaignsRouter from "./features/campaigns/routes/campaign-routes";
import invitationsRouter from "./features/campaigns/routes/invitation-routes";
import test from "./features/test";

const app = new Hono<Context>()
	.use("*", async (c, next) => {
		// Cloudflare Workers expose bindings on `c.env`. Vercel/Node exposes on `process.env`.
		// Normalize this so our existing process.env dependencies work properly.
		if (typeof process === "undefined") {
			globalThis.process = { env: {} } as any;
		} else if (!process.env) {
			process.env = {};
		}
		const requestEnv = env(c);
		Object.assign(process.env, requestEnv);
		await next();
	})
	.use("*", async (c, next) => {
		const { CLIENT_URL } = env<{ CLIENT_URL: string }>(c);
		return cors({
			origin: CLIENT_URL ?? "http://localhost:5173",
			allowHeaders: ["Content-Type", "Authorization"],
			allowMethods: ["POST", "GET", "DELETE", "OPTIONS"],
			exposeHeaders: ["Content-Length"],
			maxAge: 600,
			credentials: true,
		})(c, next);
	})
	.use("*", async (c, next) => {
		const session = await auth.api.getSession({ headers: c.req.raw.headers });
		if (!session) {
			c.set("userId", null);
			c.set("session", null);
			await next();
			return;
		}
		c.set("userId", session.user.id);
		c.set("session", session.session);
		await next();
	})
	.use("*", requireAuth)
	.route("/api", test)
	.route("/api/auth", authRouter)
	.route("/api/campaigns", campaignsRouter)
	.route("/api/invitations", invitationsRouter)
	.route("/api/campaigns/:campaignId/invitations", campaignInvitationsRouter);

export default app;
export type AppType = typeof app;
