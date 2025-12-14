import { createServerOnlyFn } from "@tanstack/react-start";
import { db } from "@/db";
import { fetchUserById } from "@/features/auth/repositories/user-repository";
import {
	createCampaignInvitationRepository,
	fetchCampaignInvitationsRepository,
} from "@/features/campaigns/repositories/campaign-invitation-repository";
import { fetchCampaignMemberRepository } from "@/features/campaigns/repositories/campaign-member-repository";
import { fetchCampaignByIdRepository } from "@/features/campaigns/repositories/campaign-repository";

export const fetchCampaignInvitationsService = createServerOnlyFn(
	async (userId: string) => {
		const invitations = await fetchCampaignInvitationsRepository(db, userId);
		return invitations;
	},
);

export const createCampaignInvitationService = createServerOnlyFn(
	async (userId: string, campaignId: string, invitedUserId: string) => {
		const campaignData = await fetchCampaignByIdRepository(
			db,
			userId,
			campaignId,
		);

		if (!campaignData || campaignData.createdBy !== userId) {
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
	},
);
