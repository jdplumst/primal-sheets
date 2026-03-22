import type { Database } from "@/db";
import {
	createCampaignRepository,
	deleteCampaignRepository,
	fetchCampaignByIdRepository,
	fetchCampaignsRepository,
} from "@/features/campaigns/repositories/campaign-repository";
import { errResult, okResult } from "@/utils/result";

export async function fetchCampaignsService(db: Database, userId: string) {
	const campaigns = await fetchCampaignsRepository(db, userId);
	return okResult(campaigns, 200);
}

export async function fetchCampaignByIdService(
	db: Database,
	userId: string,
	campaignId: string,
) {
	const campaign = await fetchCampaignByIdRepository(db, userId, campaignId);
	if (!campaign) {
		return errResult(
			"The campaign you are trying to fetch does not exist or you don't have permission to fetch it",
			404,
		);
	}
	return okResult(campaign, 200);
}

export async function createCampaignService(
	db: Database,
	userId: string,
	campaignName: string,
) {
	const createdCampaign = await createCampaignRepository(
		db,
		userId,
		campaignName,
	);
	return okResult(createdCampaign, 200);
}

export async function deleteCampaignService(
	db: Database,
	userId: string,
	campaignId: string,
) {
	const deletedCampaign = await deleteCampaignRepository(
		db,
		userId,
		campaignId,
	);

	if (!deletedCampaign) {
		return errResult(
			"The campaign you are trying delete either doesn't exist or you don't have permission to delete it",
			404,
		);
	}

	return okResult(deletedCampaign, 200);
}
