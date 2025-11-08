import { desc, eq, or } from "drizzle-orm";
import { db } from "@/db";
import {
	campaign,
	campaignMember,
} from "@/features/campaigns/db/campaigns-schema";

export const fetchCampaignsRepository = async (userId: string) => {
	const campaigns = await db
		.selectDistinct()
		.from(campaign)
		.leftJoin(campaignMember, eq(campaignMember.campaignId, campaign.id))
		.where(
			or(eq(campaign.createdBy, userId), eq(campaignMember.userId, userId)),
		)
		.orderBy(desc(campaign.createdAt));
	return campaigns;
};
