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
import { fetchCampaignMemberRepository } from "@/features/campaigns/repositories/campaign-member-repository";

describe("campaign member repository", () => {
	let testDb: TestDb;

	beforeAll(async () => {
		testDb = await createTestDb();
	});

	afterAll(async () => {
		await testDb.cleanup();
	});

	describe("fetch campaign members", async () => {
		const TEST_USERS = {
			testUser: {
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
			},
		};

		const TEST_CAMPAIGN_MEMBER_ROLES = {
			member: {
				id: faker.string.uuid(),
				name: "member",
				description: "Campaign member",
			},
		};

		const TEST_CAMPAIGNS = {
			testCampaign: {
				id: faker.string.uuid(),
				name: "User Campaign 1",
				createdBy: TEST_USERS.testUser.id,
			},
		};

		const TEST_CAMPAIGN_MEMBERS = {
			testCampaignUser: {
				id: "campaign-member-1",
				campaignId: TEST_CAMPAIGNS.testCampaign.id,
				userId: TEST_USERS.testUser.id,
				roleId: TEST_CAMPAIGN_MEMBER_ROLES.member.id,
				joinedAt: new Date("2025-12-01"),
			},
		};

		beforeAll(async () => {
			await testDb.db.insert(user).values([TEST_USERS.testUser]);
			await testDb.db
				.insert(campaignMemberRole)
				.values([TEST_CAMPAIGN_MEMBER_ROLES.member]);
			await testDb.db.insert(campaign).values([TEST_CAMPAIGNS.testCampaign]);
			await testDb.db
				.insert(campaignMember)
				.values([TEST_CAMPAIGN_MEMBERS.testCampaignUser]);
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

			const campaignMemberRoleIds = Object.values(
				TEST_CAMPAIGN_MEMBER_ROLES,
			).map((c) => c.id);
			await testDb.db
				.delete(campaignMemberRole)
				.where(inArray(campaignMemberRole.id, campaignMemberRoleIds));

			const userIds = Object.values(TEST_USERS).map((u) => u.id);
			await testDb.db.delete(user).where(inArray(user.id, userIds));
		});

		it("fetches campaign member", async () => {
			const result = await fetchCampaignMemberRepository(
				testDb.db,
				TEST_USERS.testUser.id,
				TEST_CAMPAIGNS.testCampaign.id,
			);

			expect(result).toStrictEqual(TEST_CAMPAIGN_MEMBERS.testCampaignUser);
		});
	});
});
