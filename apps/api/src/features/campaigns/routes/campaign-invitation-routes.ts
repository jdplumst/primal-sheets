import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	createCampaignInvitationBody,
	createCampaignInvitationParam,
} from "schemas";
import type { AuthenticatedContext } from "@/types";
import { createCampaignInvitationService } from "../services/campaign-invitation-service";

const app = new Hono<AuthenticatedContext>().post(
	"/",
	zValidator("param", createCampaignInvitationParam),
	zValidator("json", createCampaignInvitationBody),
	async (c) => {
		const userId = c.get("userId");
		const { campaignId } = c.req.valid("param");
		const { invitedUserId } = c.req.valid("json");
		const res = await createCampaignInvitationService(
			userId,
			campaignId,
			invitedUserId,
		);
		if (!res.ok) {
			return c.json(res.error, res.code);
		}
		return c.json(res.data, res.code);
	},
);

export default app;
