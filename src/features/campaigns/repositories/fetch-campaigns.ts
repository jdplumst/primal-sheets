import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { campaign } from "@/features/campaigns/db/campaigns-schema";

export const fetchCampaigns = async (userId: string) => {
	const campaigns = await db
		.select()
		.from(campaign)
		.where(eq(campaign.createdBy, userId))
		.orderBy(desc(campaign.createdAt));
	return campaigns;
};
