import { db } from "@/db";
import {
	createCampaignRepository,
	deleteCampaignRepository,
	fetchCampaignByIdRepository,
	fetchCampaignsRepository,
} from "@/features/campaigns/repositories/campaign-repository";
import { errResult, okResult } from "@/utils/result";

export async function fetchCampaignsService(userId: string) {
	const campaigns = await fetchCampaignsRepository(db, userId);
	return campaigns;
}

export async function fetchCampaignByIdService(
	userId: string,
	campaignId: string,
) {
	const campaign = await fetchCampaignByIdRepository(db, userId, campaignId);
	return campaign;
}

export async function createCampaignService(
	userId: string,
	campaignName: string,
) {
	const createdCampaign = await createCampaignRepository(
		db,
		userId,
		campaignName,
	);
	return createdCampaign;
}

export async function deleteCampaignService(
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
