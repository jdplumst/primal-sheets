import { beforeEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import {
	createCampaignService,
	deleteCampaignService,
	fetchCampaignByIdService,
	fetchCampaignsService,
} from "@/features/campaigns/services/campaign-service";
import * as campaignRepository from "../../../../src/features/campaigns/repositories/campaign-repository";

vi.mock("../../../../src/features/campaigns/repositories/campaign-repository");

describe("campaign service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("fetch campaigns", () => {
		it("fetches campaigns", async () => {
			vi.mocked(campaignRepository.fetchCampaignsRepository).mockResolvedValue([
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
			expect(result).toHaveLength(2);
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

			vi.mocked(
				campaignRepository.fetchCampaignByIdRepository,
			).mockResolvedValue(mockedCampaign);

			const result = await fetchCampaignByIdService("user-1", "campaign-1");
			expect(result).toStrictEqual(mockedCampaign);
		});
	});

	describe("create campaign", async () => {
		it("creates campaign", async () => {
			vi.mocked(campaignRepository.createCampaignRepository).mockResolvedValue({
				id: "campaign-1",
				name: "campaign-name",
				createdAt: new Date("2025-12-01"),
				updatedAt: new Date("2025-12-01"),
				createdBy: "user-1",
			});

			const result = await createCampaignService("user-1", "campaign-name");
			expect(result).toStrictEqual({
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
			vi.mocked(campaignRepository.deleteCampaignRepository).mockResolvedValue({
				id: "campaign-1",
				name: "campaign-name",
				createdAt: new Date("2025-12-01"),
				updatedAt: new Date("2025-12-01"),
				createdBy: "user-1",
			});

			const result = await deleteCampaignService("user-1", "campaign-1");
			expect(result).toStrictEqual({
				id: "campaign-1",
				name: "campaign-name",
				createdAt: new Date("2025-12-01"),
				updatedAt: new Date("2025-12-01"),
				createdBy: "user-1",
			});
		});

		it("throws error if campaign with campaign does not exist or don't have permission to delete", async () => {
			vi.mocked(campaignRepository.deleteCampaignRepository).mockResolvedValue(
				undefined,
			);

			await expect(
				deleteCampaignService("user-1", "campaign-1"),
			).rejects.toThrow(
				"The campaign you are trying delete either doesn't exist or you don't have permission to delete it",
			);
		});
	});
});
