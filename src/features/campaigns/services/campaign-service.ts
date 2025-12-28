import { createServerOnlyFn } from "@tanstack/react-start";
import { db } from "@/db";
import {
	createCampaignRepository,
	deleteCampaignRepository,
	fetchCampaignByIdRepository,
	fetchCampaignsRepository,
} from "@/features/campaigns/repositories/campaign-repository";

export const fetchCampaignsService = createServerOnlyFn(
	async (userId: string) => {
		const campaigns = await fetchCampaignsRepository(db, userId);
		return campaigns;
	},
);

export const fetchCampaignByIdService = createServerOnlyFn(
	async (userId: string, campaignId: string) => {
		const campaign = await fetchCampaignByIdRepository(db, userId, campaignId);
		return campaign;
	},
);

export const createCampaignService = createServerOnlyFn(
	async (userId: string, campaignName: string) => {
		const createdCampaign = await createCampaignRepository(
			db,
			userId,
			campaignName,
		);
		return createdCampaign;
	},
);

export const deleteCampaignService = createServerOnlyFn(
	async (userId: string, campaignId: string) => {
		const deletedCampaign = await deleteCampaignRepository(
			db,
			userId,
			campaignId,
		);

		if (!deletedCampaign) {
			throw new Error(
				"The campaign you are trying delete either doesn't exist or you don't have permission to delete it",
			);
		}

		return deletedCampaign;
	},
);
