import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { createCampaignInvitationRepository } from "@/features/campaigns/repositories/create-campaign-invitation";
import { createCampaignInvitationSchema } from "@/features/campaigns/utils/types";
import { authMiddleware } from "@/lib/auth-middleware";

export const createCampaignInvitation = createServerFn({ method: "POST" })
	.inputValidator(createCampaignInvitationSchema)
	.middleware([authMiddleware])
	.handler(async ({ context, data }) => {
		const { user } = context;

		const campaignInvitation = await createCampaignInvitationRepository(
			db,
			user.id,
			{
				campaignId: data.campaignId,
				invitedUserId: data.invitedUserId,
			},
		);

		return campaignInvitation;
	});
