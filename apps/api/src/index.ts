import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	return c.json({ message: "Hello from Hono API" });
});

export default app;
