import { createServerOnlyFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import type { Database } from "@/db";
import { campaignMember } from "@/db/schema";

export const fetchCampaignMemberRepository = createServerOnlyFn(
	async (db: Database, userId: string, campaignId: string) => {
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
	},
);
