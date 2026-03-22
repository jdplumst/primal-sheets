import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import type { Context } from "@/types";
import { createAuth } from "./lib/auth";

export const requireAuth = createMiddleware<Context>(async (c, next) => {
	if (c.req.path.startsWith("/api/auth/")) {
		await next();
		return;
	}
	const userId = c.get("userId");
	if (!userId) {
		return c.json({ error: "Unauthorized" }, 401);
	}
	await next();
});

const app = new Hono<Context>().on(["POST", "GET"], "/*", (c) =>
	createAuth(c.env).handler(c.req.raw),
);

export default app;
