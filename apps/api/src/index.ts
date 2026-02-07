import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./features/auth";
import test from "./features/test";

const app = new Hono()
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
	.route("/api", test)
	.route("/api/auth", auth);

export default app;
export type AppType = typeof app;
