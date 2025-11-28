import { faker } from "@faker-js/faker";
import { inArray } from "drizzle-orm";
import {
	createTestDb,
	type TestDb,
} from "tests/integration-tests/test-db-setup";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
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

	// Test campaigns
	let userCampaign1: typeof campaign.$inferSelect;
	let userCampaign2: typeof campaign.$inferSelect;
	let membershipCampaign: typeof campaign.$inferSelect;
	let dualRoleCampaign: typeof campaign.$inferSelect;
	let otherUserCampaign: typeof campaign.$inferSelect;
	let notMemberCampaign: typeof campaign.$inferSelect;
	let olderCampaign: typeof campaign.$inferSelect;
	let newerCampaign: typeof campaign.$inferSelect;

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

		// Campaigns where testUser is creator
		[userCampaign1] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "User Campaign 1",
				createdBy: testUserId,
			})
			.returning();
		insertedData.campaigns.push(userCampaign1.id);

		[userCampaign2] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "User Campaign 2",
				createdBy: testUserId,
			})
			.returning();
		insertedData.campaigns.push(userCampaign2.id);

		// Campaign where testUser is member (but not creator)
		[membershipCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "Membership Campaign",
				createdBy: otherUserId,
			})
			.returning();
		insertedData.campaigns.push(membershipCampaign.id);

		const [member1] = await testDb.db
			.insert(campaignMember)
			.values({
				id: faker.string.uuid(),
				campaignId: membershipCampaign.id,
				userId: testUserId,
				roleId: memberRoleId,
			})
			.returning();
		insertedData.campaignMembers.push(member1.id);

		// Campaign where testUser is both creator AND member
		[dualRoleCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "Dual Role Campaign",
				createdBy: testUserId,
			})
			.returning();
		insertedData.campaigns.push(dualRoleCampaign.id);

		const [member2] = await testDb.db
			.insert(campaignMember)
			.values({
				id: faker.string.uuid(),
				campaignId: dualRoleCampaign.id,
				userId: testUserId,
				roleId: memberRoleId,
			})
			.returning();
		insertedData.campaignMembers.push(member2.id);

		// Campaigns where testUser has no access (created by otherUser, testUser not a member)
		[otherUserCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "Other User Campaign",
				createdBy: otherUserId,
			})
			.returning();
		insertedData.campaigns.push(otherUserCampaign.id);

		[notMemberCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "Not Member Campaign",
				createdBy: otherUserId,
			})
			.returning();
		insertedData.campaigns.push(notMemberCampaign.id);

		// Campaigns with different timestamps for ordering test
		[olderCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "Older Campaign",
				createdBy: testUserId,
				createdAt: new Date("2024-01-01"),
			})
			.returning();
		insertedData.campaigns.push(olderCampaign.id);

		[newerCampaign] = await testDb.db
			.insert(campaign)
			.values({
				id: faker.string.uuid(),
				name: "Newer Campaign",
				createdBy: testUserId,
				createdAt: new Date("2024-01-02"),
			})
			.returning();
		insertedData.campaigns.push(newerCampaign.id);
	});

	afterAll(async () => {
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

	it("should fetch campaigns where user is the creator", async () => {
		const result = await fetchCampaignsRepository(testDb.db, testUserId);

		const resultIds = result.map((c) => c.campaign.id);
		expect(resultIds).toContain(userCampaign1.id);
		expect(resultIds).toContain(userCampaign2.id);
		expect(resultIds).not.toContain(otherUserCampaign.id);
	});

	it("should fetch campaigns where user is a member", async () => {
		const result = await fetchCampaignsRepository(testDb.db, testUserId);

		const resultIds = result.map((c) => c.campaign.id);
		expect(resultIds).toContain(membershipCampaign.id);
		expect(resultIds).not.toContain(notMemberCampaign.id);

		const memberCampaign = result.find(
			(c) => c.campaign.id === membershipCampaign.id,
		);
		expect(memberCampaign?.campaign.name).toBe("Membership Campaign");
	});

	it("should fetch campaigns where user is both creator and member (no duplicates)", async () => {
		const result = await fetchCampaignsRepository(testDb.db, testUserId);

		// Filter to only the dual role campaign
		const filteredResults = result.filter(
			(c) => c.campaign.id === dualRoleCampaign.id,
		);

		// Should only appear once due to distinct campaign IDs
		expect(filteredResults).toHaveLength(1);
		expect(filteredResults[0]?.campaign.name).toBe("Dual Role Campaign");
	});

	it("should fetch campaigns where user is creator OR member", async () => {
		const result = await fetchCampaignsRepository(testDb.db, testUserId);

		const resultIds = result.map((c) => c.campaign.id);

		// Should include campaigns where user is creator
		expect(resultIds).toContain(userCampaign1.id);
		expect(resultIds).toContain(userCampaign2.id);

		// Should include campaign where user is member
		expect(resultIds).toContain(membershipCampaign.id);

		// Should NOT include campaigns where user has no access
		expect(resultIds).not.toContain(otherUserCampaign.id);
		expect(resultIds).not.toContain(notMemberCampaign.id);
	});

	it("should return campaigns ordered by createdAt descending", async () => {
		const result = await fetchCampaignsRepository(testDb.db, testUserId);

		// Find the positions of our test campaigns
		const newerIndex = result.findIndex(
			(c) => c.campaign.id === newerCampaign.id,
		);
		const olderIndex = result.findIndex(
			(c) => c.campaign.id === olderCampaign.id,
		);

		// Newer campaign should come before older campaign
		expect(newerIndex).toBeGreaterThanOrEqual(0);
		expect(olderIndex).toBeGreaterThanOrEqual(0);
		expect(newerIndex).toBeLessThan(olderIndex);
	});

	it("should return empty array when user has no campaigns", async () => {
		// Use a new user ID that has no campaigns
		const noAccessUserId = faker.string.uuid();

		const result = await fetchCampaignsRepository(testDb.db, noAccessUserId);

		expect(result).toHaveLength(0);
	});
});
