import { createServerOnlyFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import type { Database } from "@/db";
import {
	campaign,
	campaignInvitation,
	campaignMember,
	user,
} from "@/db/schema";
import { INVITATION_STATUS } from "@/features/campaigns/utils/constants";
import { generateId } from "@/lib/id";

export const createCampaignInvitationRepository = createServerOnlyFn(
	async (
		db: Database,
		userId: string,
		data: { campaignId: string; invitedUserId: string },
	) => {
		const { campaignId, invitedUserId } = data;

		const campaignData = (
			await db.select().from(campaign).where(eq(campaign.id, campaignId))
		)[0];

		if (!campaignData || campaignData.createdBy !== userId) {
			throw new Error(
				"You are not authorized to create an invitation for this campaign",
			);
		}

		const invitedUserData = (
			await db.select().from(user).where(eq(user.id, invitedUserId))
		)[0];

		if (!invitedUserData) {
			throw new Error("The user you are trying to invite does not exist");
		}

		const campaignMemberData = (
			await db
				.select()
				.from(campaignMember)
				.where(
					and(
						eq(campaignMember.campaignId, campaignId),
						eq(campaignMember.userId, invitedUserId),
					),
				)
		)[0];

		if (campaignMemberData) {
			throw new Error(
				"The user you are trying to invite is already a member of the campaign",
			);
		}

		const campaignInvitationData = await db
			.insert(campaignInvitation)
			.values({
				id: generateId(),
				campaignId,
				invitedUserId,
				invitedByUserId: userId,
				statusId: INVITATION_STATUS.PENDING,
			})
			.returning();

		return campaignInvitationData;
	},
);
