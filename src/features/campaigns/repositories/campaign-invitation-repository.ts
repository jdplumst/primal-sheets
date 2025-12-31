import { createServerOnlyFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import type { Database } from "@/db";
import { campaignInvitation } from "@/db/schema";
import { INVITATION_STATUS } from "@/features/campaigns/utils/constants";
import { generateId } from "@/lib/id";

export const fetchCampaignInvitationsRepository = createServerOnlyFn(
	async (db: Database, userId: string) => {
		const invitations = await db
			.select()
			.from(campaignInvitation)
			.where(
				and(
					eq(campaignInvitation.invitedUserId, userId),
					eq(campaignInvitation.statusId, INVITATION_STATUS.PENDING),
				),
			);

		return invitations;
	},
);

export const createCampaignInvitationRepository = createServerOnlyFn(
	async (
		db: Database,
		userId: string,
		campaignId: string,
		invitedUserId: string,
	) => {
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

		return campaignInvitationData[0] ?? null;
	},
);
