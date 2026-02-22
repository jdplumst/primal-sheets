import { and, eq } from "drizzle-orm";
import type { Database } from "@/db";
import { campaignInvitation } from "@/db/schema";
import { INVITATION_STATUS } from "@/features/campaigns/utils/constants";

export async function fetchCampaignInvitationByIdRepository(
	db: Database,
	userId: string,
	campaignInvitationId: string,
) {
	const invitationData = await db
		.select()
		.from(campaignInvitation)
		.where(
			and(
				eq(campaignInvitation.id, campaignInvitationId),
				eq(campaignInvitation.invitedUserId, userId),
			),
		);

	return invitationData[0] ?? null;
}

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

export async function acceptCampaignInvitationRepository(
	db: Database,
	campaignInvitationId: string,
) {
	const campaignInvitationData = await db
		.update(campaignInvitation)
		.set({ statusId: INVITATION_STATUS.ACCEPTED })
		.where(eq(campaignInvitation.id, campaignInvitationId))
		.returning();

	return campaignInvitationData[0] ?? null;
}
