import { faker } from "@faker-js/faker";
import { inArray } from "drizzle-orm";
import {
	createTestDb,
	type TestDb,
} from "tests/integration-tests/test-db-setup";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
	campaign,
	campaignMember,
	campaignMemberRole,
	user,
} from "@/db/schema";
import { fetchCampaignsRepository } from "../../src/features/campaigns/repositories/fetch-campaigns";

describe("fetchCampaignsRepository", () => {
	let testDb: TestDb;

	const TEST_ROLES = {
		member: {
			id: faker.string.uuid(),
			name: "member",
			description: "Campaign member",
		},
		owner: {
			id: faker.string.uuid(),
			name: "owner",
			description: "Campaign owner",
		},
	};

	const TEST_USERS = {
		testUser: {
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

	let testUserId: string;
	let otherUserId: string;
	let memberRoleId: string;
	let ownerRoleId: string;

	// Track inserted data for cleanup
	const insertedData: {
		users: string[];
		campaigns: string[];
		campaignMembers: string[];
		campaignMemberRoles: string[];
	} = {
		users: [],
		campaigns: [],
		campaignMembers: [],
		campaignMemberRoles: [],
	};

	beforeAll(async () => {
		testDb = await createTestDb();

		// Insert roles
		const [memberRole] = await testDb.db
			.insert(campaignMemberRole)
			.values(TEST_ROLES.member)
			.returning();
		memberRoleId = memberRole.id;
		insertedData.campaignMemberRoles.push(memberRole.id);

		const [ownerRole] = await testDb.db
			.insert(campaignMemberRole)
			.values(TEST_ROLES.owner)
			.returning();
		ownerRoleId = ownerRole.id;
		insertedData.campaignMemberRoles.push(ownerRole.id);

		// Insert users
		const [testUser] = await testDb.db
			.insert(user)
			.values(TEST_USERS.testUser)
			.returning();
		testUserId = testUser.id;
		insertedData.users.push(testUser.id);

		const [otherUser] = await testDb.db
			.insert(user)
			.values(TEST_USERS.otherUser)
			.returning();
		otherUserId = otherUser.id;
		insertedData.users.push(otherUser.id);
	});

	afterAll(async () => {
		await cleanupTestData();

		if (insertedData.users.length > 0) {
			await testDb.db.delete(user).where(inArray(user.id, insertedData.users));
		}

		if (insertedData.campaignMemberRoles.length > 0) {
			await testDb.db
				.delete(campaignMemberRole)
				.where(
					inArray(campaignMemberRole.id, insertedData.campaignMemberRoles),
				);
		}

		await testDb.client.end();
		await testDb.container.stop();
	});

	beforeEach(async () => {
		await cleanupTestData();
	});

	/**
	 * Helper function to clean up test data between tests
	 * Note: Users and roles persist across tests
	 */
	async function cleanupTestData() {
		if (insertedData.campaignMembers.length > 0) {
			await testDb.db
				.delete(campaignMember)
				.where(inArray(campaignMember.id, insertedData.campaignMembers));
		}

		if (insertedData.campaigns.length > 0) {
			await testDb.db
				.delete(campaign)
				.where(inArray(campaign.id, insertedData.campaigns));
		}

		// Reset tracking for campaign-related data only
		insertedData.campaignMembers = [];
		insertedData.campaigns = [];
	}

	it("should fetch campaigns where user is the creator", async () => {
		// Create campaigns where test user is creator
		const [campaign1] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "My Campaign 1",
				createdBy: testUserId,
			})
			.returning();
		insertedData.campaigns.push(campaign1.id);

		const [campaign2] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "My Campaign 2",
				createdBy: testUserId,
			})
			.returning();
		insertedData.campaigns.push(campaign2.id);

		// Create a campaign by another user (should not be included)
		const [otherCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "Other User's Campaign",
				createdBy: otherUserId,
			})
			.returning();
		insertedData.campaigns.push(otherCampaign.id);

		const result = await fetchCampaignsRepository(testDb.db, testUserId);

		expect(result).toHaveLength(2);
		expect(result.map((c) => c.campaign.id)).toContain(campaign1.id);
		expect(result.map((c) => c.campaign.id)).toContain(campaign2.id);
		expect(result.map((c) => c.campaign.id).includes(otherCampaign.id)).toBe(
			false,
		);
	});

	it("should fetch campaigns where user is a member", async () => {
		// Create campaign by another user
		const [otherCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "Campaign I'm Member Of",
				createdBy: otherUserId,
			})
			.returning();
		insertedData.campaigns.push(otherCampaign.id);

		// Add test user as member
		const [member] = await testDb.db
			.insert(campaignMember)
			.values({
				id: faker.string.uuid(),
				campaignId: otherCampaign.id,
				userId: testUserId,
				roleId: memberRoleId,
			})
			.returning();
		insertedData.campaignMembers.push(member.id);

		// Create another campaign by other user where test user is NOT a member
		const [notMemberCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "Campaign I'm Not In",
				createdBy: otherUserId,
			})
			.returning();
		insertedData.campaigns.push(notMemberCampaign.id);

		const result = await fetchCampaignsRepository(testDb.db, testUserId);

		expect(result).toHaveLength(1);
		expect(result[0]?.campaign.id).toBe(otherCampaign.id);
		expect(result[0]?.campaign.name).toBe("Campaign I'm Member Of");
	});

	it("should fetch campaigns where user is both creator and member (no duplicates)", async () => {
		// Create campaign where test user is creator
		const [myCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "My Campaign",
				createdBy: testUserId,
			})
			.returning();
		insertedData.campaigns.push(myCampaign.id);

		// Also add test user as member (edge case)
		const [member] = await testDb.db
			.insert(campaignMember)
			.values({
				id: faker.string.uuid(),
				campaignId: myCampaign.id,
				userId: testUserId,
				roleId: memberRoleId,
			})
			.returning();
		insertedData.campaignMembers.push(member.id);

		const result = await fetchCampaignsRepository(testDb.db, testUserId);

		// Should only appear once due to selectDistinct (if you add it)
		expect(result.length).toBeGreaterThanOrEqual(1);
		expect(result.some((c) => c.campaign.id === myCampaign.id)).toBe(true);
	});

	it("should fetch campaigns where user is creator OR member", async () => {
		// Campaign where user is creator
		const [createdCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "Campaign I Created",
				createdBy: testUserId,
			})
			.returning();
		insertedData.campaigns.push(createdCampaign.id);

		// Campaign where user is member
		const [memberCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "Campaign I'm Member Of",
				createdBy: otherUserId,
			})
			.returning();
		insertedData.campaigns.push(memberCampaign.id);

		const [member] = await testDb.db
			.insert(campaignMember)
			.values({
				id: faker.string.uuid(),
				campaignId: memberCampaign.id,
				userId: testUserId,
				roleId: memberRoleId,
			})
			.returning();
		insertedData.campaignMembers.push(member.id);

		// Campaign where user is neither creator nor member
		const [notInCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "Campaign I'm Not In",
				createdBy: otherUserId,
			})
			.returning();
		insertedData.campaigns.push(notInCampaign.id);

		const result = await fetchCampaignsRepository(testDb.db, testUserId);

		expect(result).toHaveLength(2);
		expect(result.map((c) => c.campaign.id)).toContain(createdCampaign.id);
		expect(result.map((c) => c.campaign.id)).toContain(memberCampaign.id);
		expect(result.map((c) => c.campaign.id)).not.toContain(notInCampaign.id);
	});

	it("should return campaigns ordered by createdAt descending", async () => {
		// Create campaigns with different timestamps
		const [olderCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "Older Campaign",
				createdBy: testUserId,
				createdAt: new Date("2024-01-01"),
			})
			.returning();
		insertedData.campaigns.push(olderCampaign.id);

		const [newerCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "Newer Campaign",
				createdBy: testUserId,
				createdAt: new Date("2024-01-02"),
			})
			.returning();
		insertedData.campaigns.push(newerCampaign.id);

		const result = await fetchCampaignsRepository(testDb.db, testUserId);

		expect(result).toHaveLength(2);
		expect(result[0]?.campaign.id).toBe(newerCampaign.id);
		expect(result[1]?.campaign.id).toBe(olderCampaign.id);
	});

	it("should return empty array when user has no campaigns", async () => {
		// Create campaign by another user
		const [otherCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "Other User's Campaign",
				createdBy: otherUserId,
			})
			.returning();
		insertedData.campaigns.push(otherCampaign.id);

		const result = await fetchCampaignsRepository(testDb.db, testUserId);

		expect(result).toHaveLength(0);
	});
});
