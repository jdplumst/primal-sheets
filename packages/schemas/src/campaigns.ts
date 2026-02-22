import z from "zod";

export const fetchCampaignByIdParam = z.object({
	id: z.string(),
});

export const createCampaignBody = z.object({
	campaignName: z
		.string()
		.min(1, "Campaign name is required")
		.max(100, "Campaign name must be less than 100 characters"),
});

export const deleteCampaignParam = z.object({
	id: z.string(),
});

export const createCampaignInvitationSchema = z.object({
	campaignId: z.string(),
	invitedUserId: z.string(),
});

export const acceptCampaignInvitationSchema = z.object({
	campaignInvitationId: z.string(),
});
