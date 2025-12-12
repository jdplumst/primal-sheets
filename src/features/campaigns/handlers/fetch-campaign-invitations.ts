import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { fetchCampaignInvitationsRepository } from "@/features/campaigns/repositories/fetch-campaign-invitations";
import { authMiddleware } from "@/lib/auth-middleware";

export const fetchCampaignInvitations = createServerFn()
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const { user } = context;
		const invitations = await fetchCampaignInvitationsRepository(db, user.id);
		return invitations;
	});
