import { db } from "@/db";
import { fetchUserById } from "@/features/auth/repositories/user-repository";
import {
	acceptCampaignInvitationRepository,
	createCampaignInvitationRepository,
	fetchCampaignInvitationByIdRepository,
	fetchCampaignInvitationsRepository,
} from "@/features/campaigns/repositories/campaign-invitation-repository";
import { fetchCampaignMemberRepository } from "@/features/campaigns/repositories/campaign-member-repository";
import { fetchCampaignByIdRepository } from "@/features/campaigns/repositories/campaign-repository";
import { INVITATION_STATUS } from "@/features/campaigns/utils/constants";

export async function fetchCampaignInvitationsService(userId: string) {
	const invitations = await fetchCampaignInvitationsRepository(db, userId);
	return invitations;
}

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
		throw new Error(
			"You are not authorized to create an invitation for this campaign",
		);
	}

	const invitedUserData = await fetchUserById(db, userId);

	if (!invitedUserData) {
		throw new Error("The user you are trying to invite does not exist");
	}

	const campaignMemberData = await fetchCampaignMemberRepository(
		db,
		invitedUserId,
		campaignId,
	);

	if (campaignMemberData) {
		throw new Error(
			"The user you are trying to invite is already a member of the campaign",
		);
	}

	const campaignInvitationData = await createCampaignInvitationRepository(
		db,
		userId,
		campaignId,
		invitedUserId,
	);
	return campaignInvitationData;
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
		throw new Error("The invitation you are trying to accept does not exist");
	}

	if (campaignInvitationData.statusId !== INVITATION_STATUS.PENDING) {
		throw new Error("This invitation can no longer be accepted");
	}

	const acceptedInvitation = await acceptCampaignInvitationRepository(
		db,
		campaignInvitationId,
	);

	if (!acceptedInvitation) {
		throw new Error(
			"Failed to update the invitation status. Please try again.",
		);
	}

	return acceptedInvitation;
}
