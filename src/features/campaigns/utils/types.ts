import z from "zod";

export const createCampaignSchema = z.object({
	name: z
		.string()
		.min(1, "Campaign name is required")
		.max(100, "Campaign name must be less than 100 characters"),
});

export const deleteCampaignSchema = z.object({
	id: z.string(),
});
