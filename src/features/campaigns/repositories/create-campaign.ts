import { createServerOnlyFn } from "@tanstack/react-start";
import type { Database } from "@/db";
import { campaign } from "@/db/schema";
import { generateId } from "@/lib/id";

export const createCampaignRepository = createServerOnlyFn(
	async (db: Database, userId: string, campaignName: string) => {
		const createdCampaign = await db
			.insert(campaign)
			.values({
				id: generateId(),
				name: campaignName,
				createdBy: userId,
			})
			.returning();
		return createdCampaign;
	},
);
