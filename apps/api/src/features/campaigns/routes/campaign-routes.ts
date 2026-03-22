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
		const db = c.get("db");
		const res = await fetchCampaignsService(db, userId);
		return c.json(res.data, res.code);
	})
	.get("/:id", zValidator("param", fetchCampaignByIdParam), async (c) => {
		const userId = c.get("userId");
		const db = c.get("db");
		const { id } = c.req.valid("param");
		const res = await fetchCampaignByIdService(db, userId, id);
		if (!res.ok) {
			return c.json(res.error, res.code);
		}
		return c.json(res.data, res.code);
	})
	.post(
		"/",
		zValidator("json", createCampaignBody, (result, c) => {
			if (!result.success) {
				return c.json(
					result.error.issues.map((i) => i.message).join(", "),
					400,
				);
			}
		}),
		async (c) => {
			const userId = c.get("userId");
			const db = c.get("db");
			const body = c.req.valid("json");
			const res = await createCampaignService(db, userId, body.campaignName);
			return c.json(res.data, res.code);
		},
	)
	.delete("/:id", zValidator("param", deleteCampaignParam), async (c) => {
		const userId = c.get("userId");
		const db = c.get("db");
		const param = c.req.valid("param");
		const res = await deleteCampaignService(db, userId, param.id);
		if (!res.ok) {
			return c.json(res.error, res.code);
		}
		return c.json(res.data, res.code);
	});

export default app;
