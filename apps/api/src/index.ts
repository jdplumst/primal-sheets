import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./features/auth";
import test from "./features/test";

const app = new Hono()
	.use("*", cors())
	.route("/api", test)
	.route("/api/auth", auth);

export default app;
export type AppType = typeof app;
