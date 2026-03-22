import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { createDb } from "@/db";
import { createAuth } from "@/features/auth/lib/auth";
import type { Context } from "@/types";
import authRouter, { requireAuth } from "./features/auth";
import campaignInvitationsRouter from "./features/campaigns/routes/campaign-invitation-routes";
import campaignsRouter from "./features/campaigns/routes/campaign-routes";
import invitationsRouter from "./features/campaigns/routes/invitation-routes";
import test from "./features/test";

const app = new Hono<Context>()
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
		const auth = createAuth(c.env);
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
	.use("*", async (c, next) => {
		c.set("db", createDb(c.env));
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
