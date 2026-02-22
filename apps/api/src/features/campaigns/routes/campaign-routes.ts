import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	createCampaignBody,
	deleteCampaignParam,
	fetchCampaignByIdParam,
} from "schemas";
import {
	createCampaignService,
	deleteCampaignService,
	fetchCampaignByIdService,
	fetchCampaignsService,
} from "@/features/campaigns/services/campaign-service";
import type { AuthenticatedContext } from "@/types";

const app = new Hono<AuthenticatedContext>()
	.get("/", async (c) => {
		const userId = c.get("userId");
		const res = await fetchCampaignsService(userId);
		return c.json(res.data, res.code);
	})
	.get("/:id", zValidator("param", fetchCampaignByIdParam), async (c) => {
		const userId = c.get("userId");
		const { id } = c.req.valid("param");
		const res = await fetchCampaignByIdService(userId, id);
		if (!res.ok) {
			return c.json({ message: res.error }, res.code);
		}
		return c.json(res.data, res.code);
	})
	.post("/", zValidator("json", createCampaignBody), async (c) => {
		const userId = c.get("userId");
		const body = c.req.valid("json");
		const res = await createCampaignService(userId, body.campaignName);
		return c.json(res.data, res.code);
	})
	.delete("/:id", zValidator("param", deleteCampaignParam), async (c) => {
		const userId = c.get("userId");
		const param = c.req.valid("param");
		const res = await deleteCampaignService(userId, param.id);
		if (!res.ok) {
			return c.json({ message: res.error }, res.code);
		}
		return c.json(res.data, res.code);
	});

export default app;
