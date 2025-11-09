import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { fetchCampaignsRepository } from "@/features/campaigns/repositories/fetch-campaigns";
import { authMiddleware } from "@/lib/auth-middleware";

export const fetchCampaigns = createServerFn()
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const { user } = context;
		const campaigns = await fetchCampaignsRepository(db, user.id);
		return campaigns;
	});
