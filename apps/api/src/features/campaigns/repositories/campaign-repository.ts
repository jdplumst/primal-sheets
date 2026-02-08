import { and, desc, eq, or } from "drizzle-orm";
import type { Database } from "@/db";
import { campaign, campaignMember } from "@/db/schema";

export async function fetchCampaignsRepository(db: Database, userId: string) {
	const campaigns = await db
		.selectDistinct()
		.from(campaign)
		.leftJoin(campaignMember, eq(campaignMember.campaignId, campaign.id))
		.where(
			or(eq(campaign.createdBy, userId), eq(campaignMember.userId, userId)),
		)
		.orderBy(desc(campaign.createdAt));

	return campaigns;
}

export async function fetchCampaignByIdRepository(
	db: Database,
	userId: string,
	campaignId: string,
) {
	const campaignData = (
		await db
			.select()
			.from(campaign)
			.leftJoin(campaignMember, eq(campaignMember.campaignId, campaign.id))
			.where(
				and(
					eq(campaign.id, campaignId),
					or(eq(campaign.createdBy, userId), eq(campaignMember.userId, userId)),
				),
			)
	)[0];
	return campaignData ?? null;
}

export async function createCampaignRepository(
	db: Database,
	userId: string,
	campaignName: string,
) {
	const createdCampaign = await db
		.insert(campaign)
		.values({
			id: crypto.randomUUID(),
			name: campaignName,
			createdBy: userId,
		})
		.returning();
	return createdCampaign[0] ?? null;
}

export async function deleteCampaignRepository(
	db: Database,
	userId: string,
	campaignId: string,
) {
	const deletedCampaign = (
		await db
			.delete(campaign)
			.where(and(eq(campaign.id, campaignId), eq(campaign.createdBy, userId)))
			.returning()
	)[0];

	return deletedCampaign ?? null;
}
