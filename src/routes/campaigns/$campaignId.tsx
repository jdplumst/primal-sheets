import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { CampaignId } from "@/features/campaigns/pages/campaignId";
import { LoadingLayout } from "@/layouts/loading-layout";

const CampaignsIdRoute = () => {
	return (
		<Suspense fallback={<LoadingLayout />}>
			<CampaignId />
		</Suspense>
	);
};
export const Route = createFileRoute("/campaigns/$campaignId")({
	component: CampaignsIdRoute,
	ssr: false,
});
