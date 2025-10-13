import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();
app.use(
	"*",
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:5173",
		maxAge: 600,
		credentials: true,
	}),
);

app.get("/", (c) => {
	return c.json("Hello Hono!");
});

export default app;
