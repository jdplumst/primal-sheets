import { createServerFn } from "@tanstack/react-start";
import {
	createCampaignService,
	deleteCampaignService,
	fetchCampaignByIdService,
	fetchCampaignsService,
} from "@/features/campaigns/services/campaign-service";
import {
	createCampaignSchema,
	deleteCampaignSchema,
	fetchCampaignByIdSchema,
} from "@/features/campaigns/utils/types";
import { authMiddleware } from "@/lib/auth-middleware";

export const fetchCampaigns = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const { user } = context;
		const campaigns = await fetchCampaignsService(user.id);
		return campaigns;
	});

export const fetchCampaignById = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(fetchCampaignByIdSchema)
	.handler(async ({ context, data }) => {
		const { user } = context;
		const campaign = await fetchCampaignByIdService(user.id, data.campaignId);
		return campaign;
	});

export const createCampaign = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(createCampaignSchema)
	.handler(async ({ context, data }) => {
		const { user } = context;
		const campaign = await createCampaignService(user.id, data.name);
		return campaign;
	});

export const deleteCampaign = createServerFn({ method: "POST" })
	.inputValidator(deleteCampaignSchema)
	.middleware([authMiddleware])
	.handler(async ({ context, data }) => {
		const { user } = context;
		const campaign = await deleteCampaignService(user.id, data.id);
		return campaign;
	});
