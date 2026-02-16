import { Hono } from "hono";
import { db } from "@/db";
import { fetchCampaignsRepository } from "@/features/campaigns/repositories/campaign-repository";
import type { AuthenticatedContext } from "@/types";

const app = new Hono<AuthenticatedContext>().get("/", async (c) => {
	const userId = c.get("userId");
	const campaigns = await fetchCampaignsRepository(db, userId);
	return c.json(campaigns);
});

export default app;
