import { db } from "@/db";
import { fetchUserById } from "@/features/auth/repositories/user-repository";
import {
	acceptCampaignInvitationRepository,
	createCampaignInvitationRepository,
	fetchCampaignInvitationByIdRepository,
} from "@/features/campaigns/repositories/campaign-invitation-repository";
import { fetchCampaignMemberRepository } from "@/features/campaigns/repositories/campaign-member-repository";
import { fetchCampaignByIdRepository } from "@/features/campaigns/repositories/campaign-repository";
import { INVITATION_STATUS } from "@/features/campaigns/utils/constants";
import { errResult, okResult } from "@/utils/result";

export async function createCampaignInvitationService(
	userId: string,
	campaignId: string,
	invitedUserId: string,
) {
	const campaignData = await fetchCampaignByIdRepository(
		db,
		userId,
		campaignId,
	);

	if (!campaignData || campaignData.campaign.createdBy !== userId) {
		return errResult(
			"The campaign either does not exist or you are not authorized to create an invitation for the campaign",
			422,
		);
	}

	const invitedUserData = await fetchUserById(db, userId);

	if (!invitedUserData) {
		return errResult("The user you are trying to invite does not exist", 404);
	}

	const campaignMemberData = await fetchCampaignMemberRepository(
		db,
		invitedUserId,
		campaignId,
	);

	if (campaignMemberData) {
		return errResult(
			"The user you are trying to invite is already a member of the campaign",
			409,
		);
	}

	const campaignInvitationData = await createCampaignInvitationRepository(
		db,
		userId,
		campaignId,
		invitedUserId,
	);
	return okResult(campaignInvitationData, 200);
}

export async function acceptCampaignInvitationService(
	userId: string,
	campaignInvitationId: string,
) {
	const campaignInvitationData = await fetchCampaignInvitationByIdRepository(
		db,
		userId,
		campaignInvitationId,
	);

	if (!campaignInvitationData) {
		return errResult(
			"The invitation you are trying to accept does not exist",
			404,
		);
	}

	if (campaignInvitationData.statusId !== INVITATION_STATUS.PENDING) {
		return errResult("This invitation can no longer be accepted", 409);
	}

	const acceptedInvitation = await acceptCampaignInvitationRepository(
		db,
		campaignInvitationId,
	);

	if (!acceptedInvitation) {
		return errResult(
			"Failed to update the invitation status. Please try again.",
			500,
		);
	}

	return okResult(acceptedInvitation, 200);
}
