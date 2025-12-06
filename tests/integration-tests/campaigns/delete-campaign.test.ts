import { faker } from "@faker-js/faker";
import { inArray } from "drizzle-orm";
import {
	createTestDb,
	type TestDb,
} from "tests/integration-tests/test-db-setup";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { campaign, user } from "@/db/schema";
import { deleteCampaignRepository } from "@/features/campaigns/repositories/delete-campaign";

describe("createCampaignRepository", () => {
	let testDb: TestDb;

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
		testDb = await createTestDb();
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

		await testDb.client.end();
	});

	it("should delete a campaign", async () => {
		const result = await deleteCampaignRepository(
			testDb.db,
			TEST_USERS.testUser.id,
			TEST_CAMPAIGNS.testCampaign.id,
		);

		expect(result).toBeDefined();
	});

	it("should throw an error if the campaign does not belong to the user", async () => {
		await expect(
			deleteCampaignRepository(
				testDb.db,
				TEST_USERS.testUser.id,
				TEST_CAMPAIGNS.doesNotBelongToUserCampaign.id,
			),
		).rejects.toThrowError(
			"The campaign you are trying delete either doesn't exist or you don't have permission to delete it",
		);
	});

	it("should throw an error if the campaign does not exist", async () => {
		await expect(
			deleteCampaignRepository(
				testDb.db,
				TEST_USERS.testUser.id,
				faker.string.uuid(),
			),
		).rejects.toThrowError(
			"The campaign you are trying delete either doesn't exist or you don't have permission to delete it",
		);
	});
});
