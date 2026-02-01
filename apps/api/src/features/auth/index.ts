import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth";

const app = new Hono().on(["POST", "GET"], "/*", (c) =>
	auth.handler(c.req.raw),
);

export default app;
