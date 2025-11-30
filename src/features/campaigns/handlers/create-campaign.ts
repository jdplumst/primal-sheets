import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { createCampaignRepository } from "@/features/campaigns/repositories/create-campaign";
import { createCampaignSchema } from "@/features/campaigns/utils/types";
import { authMiddleware } from "@/lib/auth-middleware";

export const createCampaign = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(createCampaignSchema)
	.handler(async ({ context, data }) => {
		const { user } = context;

		const campaign = await createCampaignRepository(db, user.id, data.name);
		return campaign;
	});
