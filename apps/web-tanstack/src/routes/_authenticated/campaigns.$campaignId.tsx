import { createFileRoute } from "@tanstack/react-router";
import { CampaignId } from "@/features/campaigns/pages/campaignId";

export const Route = createFileRoute("/_authenticated/campaigns/$campaignId")({
	component: CampaignId,
});
