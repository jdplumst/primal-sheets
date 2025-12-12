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
	invitationStatus,
	user,
} from "@/db/schema";
import { INVITATION_STATUS } from "@/features/campaigns/utils/constants";
import { fetchCampaignInvitationsRepository } from "../../../src/features/campaigns/repositories/fetch-campaign-invitations";

describe("fetchCampaignInvitationsRepository", () => {
	let testDb: TestDb;

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
		testDb = await createTestDb();

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

		const statusIds = Object.values(TEST_INVITATION_STATUSES).map((s) => s.id);
		await testDb.db
			.delete(invitationStatus)
			.where(inArray(invitationStatus.id, statusIds));

		const userIds = Object.values(TEST_USERS).map((u) => u.id);
		await testDb.db.delete(user).where(inArray(user.id, userIds));

		await testDb.client.end();
		await testDb.container.stop();
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
		expect(foundInvitation?.statusId).toBe(TEST_INVITATION_STATUSES.pending.id);
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
