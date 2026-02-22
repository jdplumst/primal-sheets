import type { Database } from "@/db";
import { campaignInvitation } from "@/db/schema";
import { INVITATION_STATUS } from "@/features/campaigns/utils/constants";

export async function createCampaignInvitationRepository(
	db: Database,
	userId: string,
	campaignId: string,
	invitedUserId: string,
) {
	const campaignInvitationData = await db
		.insert(campaignInvitation)
		.values({
			id: crypto.randomUUID(),
			campaignId,
			invitedUserId,
			invitedByUserId: userId,
			statusId: INVITATION_STATUS.PENDING,
		})
		.returning();

	return campaignInvitationData[0] ?? null;
}
