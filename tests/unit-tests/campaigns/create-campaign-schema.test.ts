import { describe, expect, it } from "vitest";
import { createCampaignSchema } from "@/features/campaigns/utils/types";

describe("createCampaignSchema", () => {
	it("should validate a valid campaign name", () => {
		const result = createCampaignSchema.safeParse({
			name: "Valid Campaign Name",
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.name).toBe("Valid Campaign Name");
		}
	});

	it("should reject an empty campaign name", () => {
		const result = createCampaignSchema.safeParse({
			name: "",
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Campaign name is required");
		}
	});

	it("should reject a campaign name that is too long", () => {
		const longName = "a".repeat(101);
		const result = createCampaignSchema.safeParse({
			name: longName,
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe(
				"Campaign name must be less than 100 characters",
			);
		}
	});

	it("should accept a campaign name at the maximum length", () => {
		const maxLengthName = "a".repeat(100);
		const result = createCampaignSchema.safeParse({
			name: maxLengthName,
		});

		expect(result.success).toBe(true);
	});

	it("should accept a campaign name at the minimum length", () => {
		const result = createCampaignSchema.safeParse({
			name: "a",
		});

		expect(result.success).toBe(true);
	});
});
