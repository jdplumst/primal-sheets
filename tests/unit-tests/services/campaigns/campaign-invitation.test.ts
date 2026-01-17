import { beforeEach, describe, expect, it, vi } from "vitest";
import * as userRepository from "@/features/auth/repositories/user-repository";
import * as campaignMemberRepository from "@/features/campaigns/repositories/campaign-member-repository";
import {
	acceptCampaignInvitationService,
	createCampaignInvitationService,
	fetchCampaignInvitationsService,
} from "@/features/campaigns/services/campaign-invitation-service";
import { INVITATION_STATUS } from "@/features/campaigns/utils/constants";
import * as campaignInvitationRepository from "../../../../src/features/campaigns/repositories/campaign-invitation-repository";
import * as campaignRepository from "../../../../src/features/campaigns/repositories/campaign-repository";

vi.mock("../../../../src/features/campaigns/repositories/campaign-repository");
vi.mock(
	"../../../../src/features/campaigns/repositories/campaign-invitation-repository",
);
vi.mock("../../../../src/features/auth/repositories/user-repository");
vi.mock(
	"../../../../src/features/campaigns/repositories/campaign-member-repository",
);

describe("campaign invitation repository", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("fetch campaign invitations", async () => {
		it("fetches campaign invitations", async () => {
			vi.mocked(
				campaignInvitationRepository.fetchCampaignInvitationsRepository,
			).mockResolvedValue([
				{
					id: "campaign-invitation-1",
					campaignId: "campaign-1",
					invitedUserId: "invited-user-1",
					invitedByUserId: "invited-by-user-1",
					statusId: "status-1",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "campaign-invitation-2",
					campaignId: "campaign-2",
					invitedUserId: "invited-user-1",
					invitedByUserId: "invited-by-user-2",
					statusId: "status-1",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]);

			const result = await fetchCampaignInvitationsService("user-1");
			expect(result).toHaveLength(2);
		});
	});

	describe("create campaign invitation", async () => {
		it("creates campaign invitation", async () => {
			vi.mocked(
				campaignRepository.fetchCampaignByIdRepository,
			).mockResolvedValue({
				campaign: {
					id: "campaign-1",
					name: "campaign-name",
					createdBy: "user-1",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				campaign_member: null,
			});

			vi.mocked(userRepository.fetchUserById).mockResolvedValue({
				id: "user-2",
				name: "user-2-name",
				email: "user-2@email.com",
				emailVerified: true,
				image: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			vi.mocked(
				campaignMemberRepository.fetchCampaignMemberRepository,
			).mockResolvedValue(null);

			vi.mocked(
				campaignInvitationRepository.createCampaignInvitationRepository,
			).mockResolvedValue({
				id: "campaign-invitation-1",
				createdAt: new Date(),
				updatedAt: new Date(),
				campaignId: "campaign-1",
				invitedUserId: "user-2",
				invitedByUserId: "user-1",
				statusId: "status-1",
			});

			const result = await createCampaignInvitationService(
				"user-1",
				"campaign-1",
				"user-2",
			);

			expect(result).toBeDefined();
			expect(result?.id).toEqual("campaign-invitation-1");
			expect(result?.campaignId).toEqual("campaign-1");
			expect(result?.invitedUserId).toEqual("user-2");
			expect(result?.invitedByUserId).toEqual("user-1");
			expect(result?.statusId).toEqual("status-1");
			expect(result?.createdAt).toBeInstanceOf(Date);
			expect(result?.updatedAt).toBeInstanceOf(Date);
		});

		it("campaign does not exist", async () => {
			vi.mocked(
				campaignRepository.fetchCampaignByIdRepository,
			).mockResolvedValue(null);

			await expect(
				createCampaignInvitationService("user-1", "campaign-1", "user-2"),
			).rejects.toThrow(
				"You are not authorized to create an invitation for this campaign",
			);
		});

		it("did not create the campaign", async () => {
			vi.mocked(
				campaignRepository.fetchCampaignByIdRepository,
			).mockResolvedValue({
				campaign: {
					id: "campaign-1",
					name: "campaign-name",
					createdBy: "user-2",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				campaign_member: null,
			});

			await expect(
				createCampaignInvitationService("user-1", "campaign-1", "user-3"),
			).rejects.toThrow(
				"You are not authorized to create an invitation for this campaign",
			);
		});
	});

	it("user trying to invite does not exist", async () => {
		vi.mocked(campaignRepository.fetchCampaignByIdRepository).mockResolvedValue(
			{
				campaign: {
					id: "campaign-1",
					name: "campaign-name",
					createdBy: "user-1",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				campaign_member: null,
			},
		);

		vi.mocked(userRepository.fetchUserById).mockResolvedValue(null);

		await expect(
			createCampaignInvitationService("user-1", "campaign-1", "user-2"),
		).rejects.toThrow("The user you are trying to invite does not exist");
	});

	it("user is already a member of the campaign", async () => {
		vi.mocked(campaignRepository.fetchCampaignByIdRepository).mockResolvedValue(
			{
				campaign: {
					id: "campaign-1",
					name: "campaign-name",
					createdBy: "user-1",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				campaign_member: {
					id: "campaign-member-1",
					campaignId: "campaign-1",
					userId: "user-2",
					roleId: "role-1",
					joinedAt: new Date(),
				},
			},
		);

		vi.mocked(userRepository.fetchUserById).mockResolvedValue({
			id: "user-2",
			name: "user-2-name",
			email: "user-2@email.com",
			emailVerified: true,
			image: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		vi.mocked(
			campaignMemberRepository.fetchCampaignMemberRepository,
		).mockResolvedValue({
			id: "campaign-member-1",
			campaignId: "campaign-id",
			userId: "user-2",
			roleId: "role-1",
			joinedAt: new Date(),
		});

		await expect(
			createCampaignInvitationService("user-1", "campaign-1", "user-2"),
		).rejects.toThrow(
			"The user you are trying to invite is already a member of the campaign",
		);
	});

	describe("accept campaign invitation", () => {
		const mockPendingInvitation = {
			id: "invitation-1",
			campaignId: "campaign-1",
			invitedUserId: "user-1",
			invitedByUserId: "user-2",
			statusId: INVITATION_STATUS.PENDING,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const mockAcceptedInvitation = {
			...mockPendingInvitation,
			statusId: INVITATION_STATUS.ACCEPTED,
		};

		it("successfully accepts a pending invitation", async () => {
			vi.mocked(
				campaignInvitationRepository.fetchCampaignInvitationByIdRepository,
			).mockResolvedValue(mockPendingInvitation);

			vi.mocked(
				campaignInvitationRepository.acceptCampaignInvitationRepository,
			).mockResolvedValue(mockAcceptedInvitation);

			const result = await acceptCampaignInvitationService(
				"user-1",
				"invitation-1",
			);

			expect(result).toEqual(mockAcceptedInvitation);
			expect(
				campaignInvitationRepository.fetchCampaignInvitationByIdRepository,
			).toHaveBeenCalledWith(expect.anything(), "user-1", "invitation-1");
			expect(
				campaignInvitationRepository.acceptCampaignInvitationRepository,
			).toHaveBeenCalledWith(expect.anything(), "invitation-1");
		});

		it("throws error when invitation does not exist", async () => {
			vi.mocked(
				campaignInvitationRepository.fetchCampaignInvitationByIdRepository,
			).mockResolvedValue(null);

			await expect(
				acceptCampaignInvitationService("user-1", "non-existent-invitation"),
			).rejects.toThrow(
				"The invitation you are trying to accept does not exist",
			);

			expect(
				campaignInvitationRepository.acceptCampaignInvitationRepository,
			).not.toHaveBeenCalled();
		});

		it("throws error when invitation is not pending", async () => {
			vi.mocked(
				campaignInvitationRepository.fetchCampaignInvitationByIdRepository,
			).mockResolvedValue(mockAcceptedInvitation);

			await expect(
				acceptCampaignInvitationService("user-1", "invitation-1"),
			).rejects.toThrow("This invitation can no longer be accepted");

			expect(
				campaignInvitationRepository.acceptCampaignInvitationRepository,
			).not.toHaveBeenCalled();
		});

		it("throws error when repository fails to accept the invitation", async () => {
			vi.mocked(
				campaignInvitationRepository.fetchCampaignInvitationByIdRepository,
			).mockResolvedValue(mockPendingInvitation);

			vi.mocked(
				campaignInvitationRepository.acceptCampaignInvitationRepository,
			).mockResolvedValue(null);

			await expect(
				acceptCampaignInvitationService("user-1", "invitation-1"),
			).rejects.toThrow(
				"Failed to update the invitation status. Please try again.",
			);

			expect(
				campaignInvitationRepository.fetchCampaignInvitationByIdRepository,
			).toHaveBeenCalledWith(expect.anything(), "user-1", "invitation-1");
			expect(
				campaignInvitationRepository.acceptCampaignInvitationRepository,
			).toHaveBeenCalledWith(expect.anything(), "invitation-1");
		});

		it("throws error when accepting another user's invitation", async () => {
			vi.mocked(
				campaignInvitationRepository.fetchCampaignInvitationByIdRepository,
			).mockResolvedValue(null);

			await expect(
				acceptCampaignInvitationService("user-1", "invitation-1"),
			).rejects.toThrow(
				"The invitation you are trying to accept does not exist",
			);

			expect(
				campaignInvitationRepository.acceptCampaignInvitationRepository,
			).not.toHaveBeenCalled();
		});
	});
});
