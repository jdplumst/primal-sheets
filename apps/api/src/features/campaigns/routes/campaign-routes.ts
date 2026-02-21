import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { db } from "@/db";
import {
	createCampaignRepository,
	fetchCampaignsRepository,
} from "@/features/campaigns/repositories/campaign-repository";
import type { AuthenticatedContext } from "@/types";

const app = new Hono<AuthenticatedContext>()
	.get("/", async (c) => {
		const userId = c.get("userId");
		const campaigns = await fetchCampaignsRepository(db, userId);
		return c.json(campaigns);
	})
	.post(
		"/",
		zValidator("json", z.object({ campaignName: z.string().min(1).max(64) })),
		async (c) => {
			const userId = c.get("userId");
			const body = c.req.valid("json");
			const createdCampaign = await createCampaignRepository(
				db,
				userId,
				body.campaignName,
			);
			return c.json(createdCampaign);
		},
	);

export default app;
