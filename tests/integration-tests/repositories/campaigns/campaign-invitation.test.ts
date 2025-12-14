import { faker } from "@faker-js/faker";
import { inArray } from "drizzle-orm";
import {
	createTestDb,
	type TestDb,
} from "tests/integration-tests/test-db-setup";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
	campaign,
	campaignInvitation,
	campaignMember,
	campaignMemberRole,
	invitationStatus,
	user,
} from "@/db/schema";
import {
	createCampaignInvitationRepository,
	fetchCampaignInvitationsRepository,
} from "@/features/campaigns/repositories/campaign-invitation-repository";
import { INVITATION_STATUS } from "@/features/campaigns/utils/constants";

describe("campaigns repository", () => {
	let testDb: TestDb;

	beforeAll(async () => {
		testDb = await createTestDb();
	});

	afterAll(async () => {
		await testDb.client.end();
		await testDb.container.stop();
	});

	describe("fetch campaign invitations", () => {
		const TEST_USERS = {
			invitedUser: {
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
			},
			inviterUser: {
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
			},
			otherUser: {
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
			},
		};

		const TEST_INVITATION_STATUSES = {
			pending: {
				id: INVITATION_STATUS.PENDING,
				name: "pending",
				description: "Pending invitation",
			},
			accepted: {
				id: INVITATION_STATUS.ACCEPTED,
				name: "accepted",
				description: "Accepted invitation",
			},
		};

		const TEST_CAMPAIGNS = {
			campaign1: {
				id: faker.string.uuid(),
				name: "Test Campaign 1",
				createdBy: TEST_USERS.inviterUser.id,
			},
			campaign2: {
				id: faker.string.uuid(),
				name: "Test Campaign 2",
				createdBy: TEST_USERS.inviterUser.id,
			},
			campaign3: {
				id: faker.string.uuid(),
				name: "Test Campaign 3",
				createdBy: TEST_USERS.inviterUser.id,
			},
		};

		const TEST_INVITATIONS = {
			invitation1: {
				id: faker.string.uuid(),
				campaignId: TEST_CAMPAIGNS.campaign1.id,
				invitedUserId: TEST_USERS.invitedUser.id,
				invitedByUserId: TEST_USERS.inviterUser.id,
				statusId: TEST_INVITATION_STATUSES.pending.id,
			},
			invitation2: {
				id: faker.string.uuid(),
				campaignId: TEST_CAMPAIGNS.campaign2.id,
				invitedUserId: TEST_USERS.invitedUser.id,
				invitedByUserId: TEST_USERS.inviterUser.id,
				statusId: TEST_INVITATION_STATUSES.accepted.id,
			},
			otherUserInvitation: {
				id: faker.string.uuid(),
				campaignId: TEST_CAMPAIGNS.campaign3.id,
				invitedUserId: TEST_USERS.otherUser.id,
				invitedByUserId: TEST_USERS.inviterUser.id,
				statusId: TEST_INVITATION_STATUSES.pending.id,
			},
		};

		beforeAll(async () => {
			await testDb.db
				.insert(user)
				.values([
					TEST_USERS.invitedUser,
					TEST_USERS.inviterUser,
					TEST_USERS.otherUser,
				]);

			await testDb.db
				.insert(invitationStatus)
				.values([
					TEST_INVITATION_STATUSES.pending,
					TEST_INVITATION_STATUSES.accepted,
				]);

			await testDb.db
				.insert(campaign)
				.values([
					TEST_CAMPAIGNS.campaign1,
					TEST_CAMPAIGNS.campaign2,
					TEST_CAMPAIGNS.campaign3,
				]);

			await testDb.db
				.insert(campaignInvitation)
				.values([
					TEST_INVITATIONS.invitation1,
					TEST_INVITATIONS.invitation2,
					TEST_INVITATIONS.otherUserInvitation,
				]);
		});

		afterAll(async () => {
			const invitationIds = Object.values(TEST_INVITATIONS).map((i) => i.id);
			await testDb.db
				.delete(campaignInvitation)
				.where(inArray(campaignInvitation.id, invitationIds));

			const campaignIds = Object.values(TEST_CAMPAIGNS).map((c) => c.id);
			await testDb.db.delete(campaign).where(inArray(campaign.id, campaignIds));

			const statusIds = Object.values(TEST_INVITATION_STATUSES).map(
				(s) => s.id,
			);
			await testDb.db
				.delete(invitationStatus)
				.where(inArray(invitationStatus.id, statusIds));

			const userIds = Object.values(TEST_USERS).map((u) => u.id);
			await testDb.db.delete(user).where(inArray(user.id, userIds));
		});

		it("should fetch only pending invitations for the specified user", async () => {
			const result = await fetchCampaignInvitationsRepository(
				testDb.db,
				TEST_USERS.invitedUser.id,
			);

			expect(result).toHaveLength(1);
			const resultIds = result.map((i) => i.id);
			expect(resultIds).toContain(TEST_INVITATIONS.invitation1.id);
			expect(resultIds).not.toContain(TEST_INVITATIONS.invitation2.id);
			expect(resultIds).not.toContain(TEST_INVITATIONS.otherUserInvitation.id);

			const foundInvitation = result.find(
				(i) => i.id === TEST_INVITATIONS.invitation1.id,
			);
			expect(foundInvitation).toBeDefined();
			expect(foundInvitation?.campaignId).toBe(TEST_CAMPAIGNS.campaign1.id);
			expect(foundInvitation?.invitedUserId).toBe(TEST_USERS.invitedUser.id);
			expect(foundInvitation?.invitedByUserId).toBe(TEST_USERS.inviterUser.id);
			expect(foundInvitation?.statusId).toBe(
				TEST_INVITATION_STATUSES.pending.id,
			);
		});

		it("should return empty array when user has no invitations", async () => {
			const noInvitationsUserId = faker.string.uuid();

			const result = await fetchCampaignInvitationsRepository(
				testDb.db,
				noInvitationsUserId,
			);

			expect(result).toHaveLength(0);
		});
	});

	describe("create campaign invitation", () => {
		const TEST_USERS = {
			invitedByUser: {
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
			},
			invitedUser: {
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
			},
			existingMemberUser: {
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
			},
		};

		const TEST_CAMPAIGNS = {
			testCampaign: {
				id: faker.string.uuid(),
				name: "Test Campaign",
				createdBy: TEST_USERS.invitedByUser.id,
			},
		};

		const TEST_CAMPAIGN_MEMBER_ROLES = {
			testCampaignMemberRole: {
				id: faker.string.uuid(),
				name: "Test Campaign Member Role",
				description: "Test Campaign Member Role Description",
			},
		};

		const TEST_CAMPAIGN_MEMBERS = {
			testCampaignMember: {
				id: faker.string.uuid(),
				campaignId: TEST_CAMPAIGNS.testCampaign.id,
				userId: TEST_USERS.existingMemberUser.id,
				roleId: TEST_CAMPAIGN_MEMBER_ROLES.testCampaignMemberRole.id,
				joinedAt: new Date(),
			},
		};

		const TEST_INVITATION_STATUSES = {
			pending: {
				id: INVITATION_STATUS.PENDING,
				name: "Pending",
				description: "The invitation has not been accepted or declined",
			},
		};

		const TEST_CAMPAIGN_INVITATIONS = {
			testInvitation: {
				campaignId: TEST_CAMPAIGNS.testCampaign.id,
				invitedUserId: TEST_USERS.invitedUser.id,
				invitedByUserId: TEST_USERS.invitedByUser.id,
				createdAt: new Date(),
				updatedAt: new Date(),
				statusId: TEST_INVITATION_STATUSES.pending.id,
			},
		};

		beforeAll(async () => {
			await testDb.db
				.insert(user)
				.values([
					TEST_USERS.invitedByUser,
					TEST_USERS.invitedUser,
					TEST_USERS.existingMemberUser,
				]);

			await testDb.db.insert(campaign).values([TEST_CAMPAIGNS.testCampaign]);

			await testDb.db
				.insert(campaignMemberRole)
				.values([TEST_CAMPAIGN_MEMBER_ROLES.testCampaignMemberRole]);

			await testDb.db
				.insert(campaignMember)
				.values([TEST_CAMPAIGN_MEMBERS.testCampaignMember]);

			await testDb.db
				.insert(invitationStatus)
				.values([TEST_INVITATION_STATUSES.pending]);
		});

		afterAll(async () => {
			const campaignIdsWithInvitations = Object.values(
				TEST_CAMPAIGN_INVITATIONS,
			).map((c) => c.campaignId);
			await testDb.db
				.delete(campaignInvitation)
				.where(
					inArray(campaignInvitation.campaignId, campaignIdsWithInvitations),
				);

			const invitationStatusIds = Object.values(TEST_INVITATION_STATUSES).map(
				(s) => s.id,
			);
			await testDb.db
				.delete(invitationStatus)
				.where(inArray(invitationStatus.id, invitationStatusIds));

			const campaignIds = Object.values(TEST_CAMPAIGNS).map((c) => c.id);
			await testDb.db.delete(campaign).where(inArray(campaign.id, campaignIds));

			const userIds = Object.values(TEST_USERS).map((u) => u.id);
			await testDb.db.delete(user).where(inArray(user.id, userIds));
		});

		it("should create a campaign invitation", async () => {
			const result = await createCampaignInvitationRepository(
				testDb.db,
				TEST_USERS.invitedByUser.id,
				TEST_CAMPAIGNS.testCampaign.id,
				TEST_USERS.invitedUser.id,
			);

			expect(result?.id).toBeDefined();
			expect(result?.campaignId).toBe(
				TEST_CAMPAIGN_INVITATIONS.testInvitation.campaignId,
			);
			expect(result?.invitedUserId).toBe(
				TEST_CAMPAIGN_INVITATIONS.testInvitation.invitedUserId,
			);
			expect(result?.invitedByUserId).toBe(
				TEST_CAMPAIGN_INVITATIONS.testInvitation.invitedByUserId,
			);
			expect(result?.createdAt).toBeInstanceOf(Date);
			expect(result?.updatedAt).toBeInstanceOf(Date);
			expect(result?.statusId).toBe(
				TEST_CAMPAIGN_INVITATIONS.testInvitation.statusId,
			);
		});

		it("should throw an error if the campaign does not exist", async () => {
			await expect(
				createCampaignInvitationRepository(
					testDb.db,
					TEST_USERS.invitedByUser.id,
					faker.string.uuid(),
					TEST_USERS.invitedUser.id,
				),
			).rejects.toThrow();
		});
	});
});
