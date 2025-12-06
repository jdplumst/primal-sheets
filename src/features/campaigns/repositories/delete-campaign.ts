import { createServerOnlyFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import type { Database } from "@/db";
import { campaign } from "@/db/schema";

export const deleteCampaignRepository = createServerOnlyFn(
	async (db: Database, userId: string, campaignId: string) => {
		const deletedCampaign = (
			await db
				.delete(campaign)
				.where(and(eq(campaign.id, campaignId), eq(campaign.createdBy, userId)))
				.returning()
		)[0];

		if (!deletedCampaign) {
			throw new Error(
				"The campaign you are trying delete either doesn't exist or you don't have permission to delete it",
			);
		}

		return deletedCampaign;
	},
);
