import { createServerFn } from "@tanstack/react-start";
import {
	acceptCampaignInvitationService,
	createCampaignInvitationService,
	fetchCampaignInvitationsService,
} from "@/features/campaigns/services/campaign-invitation-service";
import {
	acceptCampaignInvitationSchema,
	createCampaignInvitationSchema,
} from "@/features/campaigns/utils/types";
import { authMiddleware } from "@/lib/auth-middleware";

export const fetchCampaignInvitations = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const { user } = context;
		const invitations = await fetchCampaignInvitationsService(user.id);
		return invitations;
	});

export const createCampaignInvitation = createServerFn({ method: "POST" })
	.inputValidator(createCampaignInvitationSchema)
	.middleware([authMiddleware])
	.handler(async ({ context, data }) => {
		const { user } = context;
		const campaignInvitation = await createCampaignInvitationService(
			user.id,
			data.campaignId,
			data.invitedUserId,
		);
		return campaignInvitation;
	});

export const acceptCampaignInvitation = createServerFn({ method: "POST" })
	.inputValidator(acceptCampaignInvitationSchema)
	.middleware([authMiddleware])
	.handler(async ({ context, data }) => {
		const { user } = context;
		const campaignInvitation = await acceptCampaignInvitationService(
			user.id,
			data.campaignInvitationId,
		);
		return campaignInvitation;
	});
