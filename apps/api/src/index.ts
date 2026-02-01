import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono().use("*", cors()).get("/", (c) => {
	return c.json({ message: "Hello from Hono API" });
});

export default app;
export type AppType = typeof app;
