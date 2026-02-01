import type { AppType } from "api";
import { hc } from "hono/client";

export const hono = hc<AppType>(
	import.meta.env.VITE_API_URL ?? "http://localhost:3000",
);
