import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { createCampaignSchema, deleteCampaignSchema } from "schemas";
import {
	createCampaignService,
	deleteCampaignService,
	fetchCampaignsService,
} from "@/features/campaigns/services/campaign-service";
import type { AuthenticatedContext } from "@/types";

const app = new Hono<AuthenticatedContext>()
	.get("/", async (c) => {
		const userId = c.get("userId");
		const campaigns = await fetchCampaignsService(userId);
		return c.json(campaigns);
	})
	.post("/", zValidator("json", createCampaignSchema), async (c) => {
		const userId = c.get("userId");
		const body = c.req.valid("json");
		const createdCampaign = await createCampaignService(
			userId,
			body.campaignName,
		);
		return c.json(createdCampaign);
	})
	.delete("/:id", zValidator("param", deleteCampaignSchema), async (c) => {
		const userId = c.get("userId");
		const param = c.req.valid("param");
		const result = await deleteCampaignService(userId, param.id);
		if (!result.ok) {
			return c.json({ error: result.error }, result.code);
		}
		return c.json(result.data, result.code);
	});

export default app;
