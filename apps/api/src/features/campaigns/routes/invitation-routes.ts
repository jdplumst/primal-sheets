import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { patchCampaignInvitationParam } from "schemas";
import { fetchInvitationsService } from "@/features/campaigns/services/invitation-service";
import type { AuthenticatedContext } from "@/types";
import { acceptCampaignInvitationService } from "../services/campaign-invitation-service";

const app = new Hono<AuthenticatedContext>()
	.get("/", async (c) => {
		const userId = c.get("userId");
		const res = await fetchInvitationsService(userId);
		return c.json(res.data, res.code);
	})
	.patch(
		"/:invitationId",
		zValidator("param", patchCampaignInvitationParam),
		async (c) => {
			const userId = c.get("userId");
			const { invitationId } = c.req.valid("param");
			const res = await acceptCampaignInvitationService(userId, invitationId);
			if (!res.ok) {
				return c.json(res.error, res.code);
			}
			return c.json(res.data, res.code);
		},
	);

export default app;
