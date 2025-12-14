import { beforeEach, describe, expect, it, vi } from "vitest";
import * as userRepository from "@/features/auth/repositories/user-repository";
import * as campaignMemberRepository from "@/features/campaigns/repositories/campaign-member-repository";
import {
	createCampaignInvitationService,
	fetchCampaignInvitationsService,
} from "@/features/campaigns/services/campaign-invitation-service";
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
				id: "campaign-1",
				name: "campaign-name",
				createdBy: "user-1",
				createdAt: new Date(),
				updatedAt: new Date(),
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
			).mockResolvedValue(undefined);

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
			).mockResolvedValue(undefined);

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
				id: "campaign-1",
				name: "campaign-name",
				createdBy: "user-2",
				createdAt: new Date(),
				updatedAt: new Date(),
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
				id: "campaign-1",
				name: "campaign-name",
				createdBy: "user-1",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		);

		vi.mocked(userRepository.fetchUserById).mockResolvedValue(undefined);

		await expect(
			createCampaignInvitationService("user-1", "campaign-1", "user-2"),
		).rejects.toThrow("The user you are trying to invite does not exist");
	});

	it("user is already a member of the campaign", async () => {
		vi.mocked(campaignRepository.fetchCampaignByIdRepository).mockResolvedValue(
			{
				id: "campaign-1",
				name: "campaign-name",
				createdBy: "user-1",
				createdAt: new Date(),
				updatedAt: new Date(),
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
});
