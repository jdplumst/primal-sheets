import { faker } from "@faker-js/faker";
import { inArray } from "drizzle-orm";
import {
	createTestDb,
	type TestDb,
} from "tests/integration-tests/test-db-setup";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { campaign, user } from "@/db/schema";
import { createCampaignRepository } from "@/features/campaigns/repositories/create-campaign";

describe("createCampaignRepository", () => {
	let testDb: TestDb;

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
		testDb = await createTestDb();
		await testDb.db.insert(user).values(TEST_USERS.testUser);
	});

	afterAll(async () => {
		await testDb.db
			.delete(campaign)
			.where(inArray(campaign.id, insertedCampaignIds));

		const userIds = Object.values(TEST_USERS).map((u) => u.id);
		await testDb.db.delete(user).where(inArray(user.id, userIds));

		await testDb.client.end();
	});

	it("should create a campaign", async () => {
		const result = await createCampaignRepository(
			testDb.db,
			TEST_USERS.testUser.id,
			TEST_CAMPAIGNS.testCampaign.name,
		);

		expect(result).toHaveLength(1);
		expect(result[0]).toMatchObject(TEST_CAMPAIGNS.testCampaign);
		expect(result[0].id).toBeDefined();
		expect(result[0].createdAt).toBeInstanceOf(Date);
		expect(result[0].updatedAt).toBeInstanceOf(Date);

		insertedCampaignIds.push(result[0].id);
	});
});
