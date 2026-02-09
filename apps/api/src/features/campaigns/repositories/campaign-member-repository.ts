import { and, eq } from "drizzle-orm";
import type { Database } from "@/db";
import { campaignMember } from "@/db/schema";

export async function fetchCampaignMemberRepository(
	db: Database,
	userId: string,
	campaignId: string,
) {
	const campaignMemberData = (
		await db
			.select()
			.from(campaignMember)
			.where(
				and(
					eq(campaignMember.campaignId, campaignId),
					eq(campaignMember.userId, userId),
				),
			)
	)[0];
	return campaignMemberData ?? null;
}
