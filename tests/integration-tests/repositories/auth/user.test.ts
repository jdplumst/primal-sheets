import { faker } from "@faker-js/faker";
import { inArray } from "drizzle-orm";
import {
	createTestDb,
	type TestDb,
} from "tests/integration-tests/test-db-setup";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { user } from "@/db/schema";
import { fetchUserById } from "@/features/auth/repositories/user-repository";

describe("user repository", () => {
	let testDb: TestDb;

	beforeAll(async () => {
		testDb = await createTestDb();
	});

	afterAll(async () => {
		await testDb.client.end();
		await testDb.container.stop();
	});

	describe("fetch user by id", async () => {
		const TEST_USERS = {
			testUser: {
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
				emailVerified: true,
				image: null,
				createdAt: new Date("2025-12-01"),
				updatedAt: new Date("2025-12-01"),
			},
		};

		beforeAll(async () => {
			await testDb.db.insert(user).values([TEST_USERS.testUser]);
		});

		afterAll(async () => {
			const userIds = Object.values(TEST_USERS).map((u) => u.id);
			await testDb.db.delete(user).where(inArray(user.id, userIds));
		});

		it("fetches user", async () => {
			const result = await fetchUserById(testDb.db, TEST_USERS.testUser.id);

			expect(result).toStrictEqual(TEST_USERS.testUser);
		});
	});
});
