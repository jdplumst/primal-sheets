import { beforeEach, describe, expect, it, type Mock, mock } from "bun:test";
import assert from "node:assert";

mock.module("@/db", () => ({ db: {} }));

mock.module(
	"../../../src/features/campaigns/repositories/campaign-repository",
	() => ({
		fetchCampaignsRepository: mock(() => {}),
		fetchCampaignByIdRepository: mock(() => {}),
		createCampaignRepository: mock(() => {}),
		deleteCampaignRepository: mock(() => {}),
	}),
);

const campaignRepository = await import(
	"../../../src/features/campaigns/repositories/campaign-repository"
);
const {
	createCampaignService,
	deleteCampaignService,
	fetchCampaignByIdService,
	fetchCampaignsService,
} = await import("@/features/campaigns/services/campaign-service");

const mockedCampaignRepository = campaignRepository as unknown as {
	[K in keyof typeof campaignRepository]: Mock<(typeof campaignRepository)[K]>;
};

describe("campaign service", () => {
	beforeEach(() => {
		mock.restore();
	});

	describe("fetch campaigns", () => {
		it("fetches campaigns", async () => {
			mockedCampaignRepository.fetchCampaignsRepository.mockResolvedValue([
				{
					campaign: {
						id: "campaign-1",
						name: "campaign-1-name",
						createdBy: "user-1",
						createdAt: new Date("2025-12-01"),
						updatedAt: new Date("2025-12-01"),
					},
					campaign_member: {
						id: "member-1",
						campaignId: "campaign-1",
						userId: "user-1",
						roleId: "role-1",
						joinedAt: new Date("2025-12-01"),
					},
				},
				{
					campaign: {
						id: "campaign-2",
						name: "campaign-2-name",
						createdBy: "user-2",
						createdAt: new Date("2025-12-01"),
						updatedAt: new Date("2025-12-01"),
					},
					campaign_member: {
						id: "member-1",
						campaignId: "campaign-2",
						userId: "user-1",
						roleId: "role-1",
						joinedAt: new Date(),
					},
				},
			]);

			const result = await fetchCampaignsService("user-1");
			expect(result.ok).toBe(true);
			expect(result.data).toHaveLength(2);
		});
	});

	describe("fetch campaign by id", async () => {
		it("fetches campaign by id", async () => {
			const mockedCampaign = {
				campaign: {
					id: "campaign-1",
					name: "campaign-name",
					createdBy: "user-1",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				campaign_member: null,
			};

			mockedCampaignRepository.fetchCampaignByIdRepository.mockResolvedValue(
				mockedCampaign,
			);

			const result = await fetchCampaignByIdService("user-1", "campaign-1");
			expect(result.ok).toBe(true);
			assert(result.ok);
			expect(result.data).toStrictEqual(mockedCampaign);
		});
	});

	describe("create campaign", async () => {
		it("creates campaign", async () => {
			mockedCampaignRepository.createCampaignRepository.mockResolvedValue({
				id: "campaign-1",
				name: "campaign-name",
				createdAt: new Date("2025-12-01"),
				updatedAt: new Date("2025-12-01"),
				createdBy: "user-1",
			});

			const result = await createCampaignService("user-1", "campaign-name");
			expect(result.data).toStrictEqual({
				id: "campaign-1",
				name: "campaign-name",
				createdAt: new Date("2025-12-01"),
				updatedAt: new Date("2025-12-01"),
				createdBy: "user-1",
			});
		});
	});

	describe("delete campaign", async () => {
		it("deletes campaign", async () => {
			mockedCampaignRepository.deleteCampaignRepository.mockResolvedValue({
				id: "campaign-1",
				name: "campaign-name",
				createdAt: new Date("2025-12-01"),
				updatedAt: new Date("2025-12-01"),
				createdBy: "user-1",
			});

			const result = await deleteCampaignService("user-1", "campaign-1");
			assert(result.ok);
			expect(result.data).toStrictEqual({
				id: "campaign-1",
				name: "campaign-name",
				createdAt: new Date("2025-12-01"),
				updatedAt: new Date("2025-12-01"),
				createdBy: "user-1",
			});
		});

		it("throws error if campaign with campaign does not exist or don't have permission to delete", async () => {
			mockedCampaignRepository.deleteCampaignRepository.mockResolvedValue(null);

			const result = await deleteCampaignService("user-1", "campaign-1");
			assert(!result.ok);
			await expect(result.error).toBe(
				"The campaign you are trying delete either doesn't exist or you don't have permission to delete it",
			);
		});
	});
});
