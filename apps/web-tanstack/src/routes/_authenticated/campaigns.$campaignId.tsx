import { createFileRoute } from "@tanstack/react-router";
import { CampaignId } from "@/features/campaigns/pages/campaignId";
import { campaignIdQueryOptions } from "@/features/campaigns/utils";
import { LoadingLayout } from "@/layouts/loading-layout";

export const Route = createFileRoute("/_authenticated/campaigns/$campaignId")({
	component: CampaignId,
	loader: async ({ context: { queryClient }, params: { campaignId } }) => {
		queryClient.ensureQueryData(campaignIdQueryOptions(campaignId));
	},
	pendingComponent: LoadingLayout,
});
