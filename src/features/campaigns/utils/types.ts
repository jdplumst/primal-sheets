import z from "zod";

export const fetchCampaignByIdSchema = z.object({
	campaignId: z.string(),
});

export const createCampaignSchema = z.object({
	name: z
		.string()
		.min(1, "Campaign name is required")
		.max(100, "Campaign name must be less than 100 characters"),
});

export const deleteCampaignSchema = z.object({
	id: z.string(),
});

export const createCampaignInvitationSchema = z.object({
	campaignId: z.string(),
	invitedUserId: z.string(),
});

export const acceptCampaignInvitationSchema = z.object({
	campaignInvitationId: z.string(),
});
