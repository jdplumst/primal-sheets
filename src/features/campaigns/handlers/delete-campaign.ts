import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { deleteCampaignRepository } from "@/features/campaigns/repositories/delete-campaign";
import { deleteCampaignSchema } from "@/features/campaigns/utils/types";
import { authMiddleware } from "@/lib/auth-middleware";

export const deleteCampaign = createServerFn({ method: "POST" })
	.inputValidator(deleteCampaignSchema)
	.middleware([authMiddleware])
	.handler(async ({ context, data }) => {
		const { user } = context;

		const campaign = await deleteCampaignRepository(db, user.id, data.id);
		return campaign;
	});
