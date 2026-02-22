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

export const createCampaignInvitationParam = z.object({
	campaignId: z.string(),
});

export const createCampaignInvitationBody = z.object({
	invitedUserId: z.string(),
});

export const patchCampaignInvitationParam = z.object({
	invitationId: z.string(),
});
