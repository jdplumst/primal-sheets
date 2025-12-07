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
import { createCampaignInvitationRepository } from "@/features/campaigns/repositories/create-campaign-invitation";
import { INVITATION_STATUS } from "@/features/campaigns/utils/constants";

describe("createCampaignRepository", () => {
	let testDb: TestDb;

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

	const insertedCampaignInvitationIds: string[] = [];

	beforeAll(async () => {
		testDb = await createTestDb();

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
		await testDb.db
			.delete(campaignInvitation)
			.where(inArray(campaignInvitation.id, insertedCampaignInvitationIds));

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

		await testDb.client.end();
	});

	it("should create a campaign invitation", async () => {
		const result = await createCampaignInvitationRepository(
			testDb.db,
			TEST_USERS.invitedByUser.id,
			{
				campaignId: TEST_CAMPAIGNS.testCampaign.id,
				invitedUserId: TEST_USERS.invitedUser.id,
			},
		);

		expect(result).toHaveLength(1);
		expect(result[0].id).toBeDefined();
		expect(result[0].campaignId).toBe(TEST_CAMPAIGNS.testCampaign.id);
		expect(result[0].invitedUserId).toBe(TEST_USERS.invitedUser.id);
		expect(result[0].invitedByUserId).toBe(TEST_USERS.invitedByUser.id);
		expect(result[0].createdAt).toBeInstanceOf(Date);
		expect(result[0].updatedAt).toBeInstanceOf(Date);
		expect(result[0].statusId).toBe(TEST_INVITATION_STATUSES.pending.id);

		insertedCampaignInvitationIds.push(result[0].id);
	});

	it("should throw an error if the campaign does not exist", async () => {
		await expect(
			createCampaignInvitationRepository(
				testDb.db,
				TEST_USERS.invitedByUser.id,
				{
					campaignId: faker.string.uuid(),
					invitedUserId: TEST_USERS.invitedUser.id,
				},
			),
		).rejects.toThrow(
			"You are not authorized to create an invitation for this campaign",
		);
	});

	it("should throw an error if the user did not create the campaign", async () => {
		await expect(
			createCampaignInvitationRepository(testDb.db, TEST_USERS.invitedUser.id, {
				campaignId: TEST_CAMPAIGNS.testCampaign.id,
				invitedUserId: TEST_USERS.invitedByUser.id,
			}),
		).rejects.toThrow(
			"You are not authorized to create an invitation for this campaign",
		);
	});

	it("should throw an error if the invited user does not exist", async () => {
		await expect(
			createCampaignInvitationRepository(
				testDb.db,
				TEST_USERS.invitedByUser.id,
				{
					campaignId: TEST_CAMPAIGNS.testCampaign.id,
					invitedUserId: faker.string.uuid(),
				},
			),
		).rejects.toThrow("The user you are trying to invite does not exist");
	});

	it("should throw an error if the invited user is already a member of the campaign", async () => {
		await expect(
			createCampaignInvitationRepository(
				testDb.db,
				TEST_USERS.invitedByUser.id,
				{
					campaignId: TEST_CAMPAIGNS.testCampaign.id,
					invitedUserId: TEST_USERS.existingMemberUser.id,
				},
			),
		).rejects.toThrow(
			"The user you are trying to invite is already a member of the campaign",
		);
	});
});
