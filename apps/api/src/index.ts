import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "@/features/auth/lib/auth";
import type { Context } from "@/types";
import authRouter, { requireAuth } from "./features/auth";
import campaignsRouter from "./features/campaigns/routes/campaign-routes";
import test from "./features/test";

const app = new Hono<Context>()
	.use(
		"*",
		cors({
			origin: process.env.CLIENT_URL ?? "http://localhost:5173",
			allowHeaders: ["Content-Type", "Authorization"],
			allowMethods: ["POST", "GET", "OPTIONS"],
			exposeHeaders: ["Content-Length"],
			maxAge: 600,
			credentials: true,
		}),
	)
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
	.route("/api/campaigns", campaignsRouter);

export default app;
export type AppType = typeof app;
