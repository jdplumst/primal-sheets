import { faker } from "@faker-js/faker";
import { inArray } from "drizzle-orm";
import {
	createTestDb,
	type TestDb,
} from "tests/integration-tests/test-db-setup";
import { afterAll, assert, beforeAll, describe, expect, it } from "vitest";
import {
	campaign,
	campaignMember,
	campaignMemberRole,
	user,
} from "@/db/schema";
import {
	createCampaignRepository,
	deleteCampaignRepository,
	fetchCampaignByIdRepository,
	fetchCampaignsRepository,
} from "../../../../src/features/campaigns/repositories/campaign-repository";

describe("campaign repository", () => {
	let testDb: TestDb;

	beforeAll(async () => {
		testDb = await createTestDb();
	});

	afterAll(async () => {
		await testDb.client.end();
		await testDb.container.stop();
	});

	describe("fetch campaigns", () => {
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

		const TEST_CAMPAIGNS = {
			userCampaign1: {
				id: faker.string.uuid(),
				name: "User Campaign 1",
				createdBy: TEST_USERS.testUser.id,
			},
			userCampaign2: {
				id: faker.string.uuid(),
				name: "User Campaign 2",
				createdBy: TEST_USERS.testUser.id,
			},
			membershipCampaign: {
				id: faker.string.uuid(),
				name: "Membership Campaign",
				createdBy: TEST_USERS.otherUser.id,
			},
			notMemberCampaign: {
				id: faker.string.uuid(),
				name: "Not Member Campaign",
				createdBy: TEST_USERS.otherUser.id,
			},
			olderCampaign: {
				id: faker.string.uuid(),
				name: "Older Campaign",
				createdBy: TEST_USERS.testUser.id,
				createdAt: new Date("2024-01-01"),
			},
			newerCampaign: {
				id: faker.string.uuid(),
				name: "Newer Campaign",
				createdBy: TEST_USERS.testUser.id,
				createdAt: new Date("2024-01-02"),
			},
		};

		const TEST_CAMPAIGN_MEMBERS = {
			member: {
				id: faker.string.uuid(),
				campaignId: TEST_CAMPAIGNS.membershipCampaign.id,
				userId: TEST_USERS.testUser.id,
				roleId: TEST_ROLES.member.id,
				joinedAt: new Date(),
			},
		};

		beforeAll(async () => {
			await testDb.db
				.insert(campaignMemberRole)
				.values([TEST_ROLES.member, TEST_ROLES.owner]);
			await testDb.db
				.insert(user)
				.values([TEST_USERS.testUser, TEST_USERS.otherUser]);
			await testDb.db
				.insert(campaign)
				.values([
					TEST_CAMPAIGNS.userCampaign1,
					TEST_CAMPAIGNS.userCampaign2,
					TEST_CAMPAIGNS.membershipCampaign,
					TEST_CAMPAIGNS.notMemberCampaign,
					TEST_CAMPAIGNS.olderCampaign,
					TEST_CAMPAIGNS.newerCampaign,
				]);
			await testDb.db
				.insert(campaignMember)
				.values([TEST_CAMPAIGN_MEMBERS.member]);
		});

		afterAll(async () => {
			const campaignMemberIds = Object.values(TEST_CAMPAIGN_MEMBERS).map(
				(c) => c.id,
			);
			await testDb.db
				.delete(campaignMember)
				.where(inArray(campaignMember.id, campaignMemberIds));

			const campaignIds = Object.values(TEST_CAMPAIGNS).map((c) => c.id);
			await testDb.db.delete(campaign).where(inArray(campaign.id, campaignIds));

			const userIds = Object.values(TEST_USERS).map((u) => u.id);
			await testDb.db.delete(user).where(inArray(user.id, userIds));

			const roleIds = Object.values(TEST_ROLES).map((r) => r.id);
			await testDb.db
				.delete(campaignMemberRole)
				.where(inArray(campaignMemberRole.id, roleIds));
		});

		it("should fetch campaigns where user is the creator or a member", async () => {
			const result = await fetchCampaignsRepository(
				testDb.db,
				TEST_USERS.testUser.id,
			);

			const resultIds = result.map((c) => c.campaign.id);
			expect(resultIds).toContain(TEST_CAMPAIGNS.userCampaign1.id);
			expect(resultIds).toContain(TEST_CAMPAIGNS.userCampaign2.id);
			expect(resultIds).toContain(TEST_CAMPAIGNS.membershipCampaign.id);
			expect(resultIds).toContain(TEST_CAMPAIGNS.olderCampaign.id);
			expect(resultIds).toContain(TEST_CAMPAIGNS.newerCampaign.id);
			expect(resultIds).not.toContain(TEST_CAMPAIGNS.notMemberCampaign.id);
		});

		it("should return campaigns ordered by createdAt descending", async () => {
			const result = await fetchCampaignsRepository(
				testDb.db,
				TEST_USERS.testUser.id,
			);

			const newerIndex = result.findIndex(
				(c) => c.campaign.id === TEST_CAMPAIGNS.newerCampaign.id,
			);
			const olderIndex = result.findIndex(
				(c) => c.campaign.id === TEST_CAMPAIGNS.olderCampaign.id,
			);

			expect(newerIndex).toBeGreaterThanOrEqual(0);
			expect(olderIndex).toBeGreaterThanOrEqual(0);
			expect(newerIndex).toBeLessThan(olderIndex);
		});

		it("should return empty array when user has no campaigns", async () => {
			const noAccessUserId = faker.string.uuid();

			const result = await fetchCampaignsRepository(testDb.db, noAccessUserId);

			expect(result).toHaveLength(0);
		});
	});

	describe("fetch campaign by id", () => {
		const TEST_USERS = {
			testUser: {
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
			},
		};

		const TEST_CAMPAIGNS = {
			testCampaign: {
				campaign: {
					id: faker.string.uuid(),
					name: "Test Campaign",
					createdBy: TEST_USERS.testUser.id,
					createdAt: new Date("2025-12-01"),
					updatedAt: new Date("2025-12-01"),
				},
				campaign_member: null,
			},
		};

		beforeAll(async () => {
			await testDb.db.insert(user).values(TEST_USERS.testUser);
			await testDb.db
				.insert(campaign)
				.values(TEST_CAMPAIGNS.testCampaign.campaign);
		});

		afterAll(async () => {
			const campaignIds = Object.values(TEST_CAMPAIGNS).map(
				(c) => c.campaign.id,
			);
			await testDb.db.delete(campaign).where(inArray(campaign.id, campaignIds));

			const userIds = Object.values(TEST_USERS).map((u) => u.id);
			await testDb.db.delete(user).where(inArray(user.id, userIds));
		});

		it("fetch campaign by id", async () => {
			const result = await fetchCampaignByIdRepository(
				testDb.db,
				TEST_USERS.testUser.id,
				TEST_CAMPAIGNS.testCampaign.campaign.id,
			);

			expect(result).toStrictEqual(TEST_CAMPAIGNS.testCampaign);
		});
	});

	describe("create campaigns", () => {
		const TEST_USERS = {
			testUser: {
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
			},
		};

		const TEST_CAMPAIGNS = {
			testCampaign: {
				name: "Test Campaign",
				createdBy: TEST_USERS.testUser.id,
			},
		};

		const insertedCampaignIds: string[] = [];

		beforeAll(async () => {
			await testDb.db.insert(user).values(TEST_USERS.testUser);
		});

		afterAll(async () => {
			await testDb.db
				.delete(campaign)
				.where(inArray(campaign.id, insertedCampaignIds));

			const userIds = Object.values(TEST_USERS).map((u) => u.id);
			await testDb.db.delete(user).where(inArray(user.id, userIds));
		});

		it("should create a campaign", async () => {
			const result = await createCampaignRepository(
				testDb.db,
				TEST_USERS.testUser.id,
				TEST_CAMPAIGNS.testCampaign.name,
			);

			assert(result !== undefined);
			expect(result).toMatchObject(TEST_CAMPAIGNS.testCampaign);
			expect(result.id).toBeDefined();
			expect(result.createdAt).toBeInstanceOf(Date);
			expect(result.updatedAt).toBeInstanceOf(Date);

			insertedCampaignIds.push(result.id);
		});
	});

	describe("delete campaign", () => {
		const TEST_USERS = {
			testUser: {
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
			},
			testUser2: {
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
			},
		};

		const TEST_CAMPAIGNS = {
			testCampaign: {
				id: faker.string.uuid(),
				name: "Test Campaign",
				createdBy: TEST_USERS.testUser.id,
			},
			doesNotBelongToUserCampaign: {
				id: faker.string.uuid(),
				name: "Does Not Belong To User Campaign",
				createdBy: TEST_USERS.testUser2.id,
			},
		};

		beforeAll(async () => {
			await testDb.db
				.insert(user)
				.values([TEST_USERS.testUser, TEST_USERS.testUser2]);
			await testDb.db
				.insert(campaign)
				.values([
					TEST_CAMPAIGNS.testCampaign,
					TEST_CAMPAIGNS.doesNotBelongToUserCampaign,
				]);
		});

		afterAll(async () => {
			const campaignIds = Object.values(TEST_CAMPAIGNS).map((c) => c.id);
			await testDb.db.delete(campaign).where(inArray(campaign.id, campaignIds));

			const userIds = Object.values(TEST_USERS).map((u) => u.id);
			await testDb.db.delete(user).where(inArray(user.id, userIds));
		});

		it("should delete a campaign", async () => {
			const result = await deleteCampaignRepository(
				testDb.db,
				TEST_USERS.testUser.id,
				TEST_CAMPAIGNS.testCampaign.id,
			);

			expect(result).toBeDefined();
		});

		it("should return undefined if the campaign does not belong to the user", async () => {
			const result = await deleteCampaignRepository(
				testDb.db,
				TEST_USERS.testUser.id,
				TEST_CAMPAIGNS.doesNotBelongToUserCampaign.id,
			);

			expect(result).not.toBeDefined();
		});

		it("should return undefined if the campaign does not exist", async () => {
			const result = await deleteCampaignRepository(
				testDb.db,
				TEST_USERS.testUser.id,
				faker.string.uuid(),
			);

			expect(result).not.toBeDefined();
		});
	});
});
