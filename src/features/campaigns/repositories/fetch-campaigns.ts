import { createServerOnlyFn } from "@tanstack/react-start";
import { desc, eq, or } from "drizzle-orm";
import type { Database } from "@/db";
import {
	campaign,
	campaignMember,
} from "@/features/campaigns/db/campaigns-schema";

export const fetchCampaignsRepository = createServerOnlyFn(
	async (db: Database, userId: string) => {
		const campaigns = await db
			.selectDistinct()
			.from(campaign)
			.leftJoin(campaignMember, eq(campaignMember.campaignId, campaign.id))
			.where(
				or(eq(campaign.createdBy, userId), eq(campaignMember.userId, userId)),
			)
			.orderBy(desc(campaign.createdAt));
		return campaigns;
	},
);
