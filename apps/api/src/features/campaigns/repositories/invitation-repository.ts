import { and, eq } from "drizzle-orm";
import type { Database } from "@/db";
import { campaignInvitation } from "@/db/schema";
import { INVITATION_STATUS } from "@/features/campaigns/utils/constants";

export async function fetchInvitationsRepository(db: Database, userId: string) {
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
}
