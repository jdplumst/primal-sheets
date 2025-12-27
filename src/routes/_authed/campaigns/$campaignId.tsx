import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { CampaignId } from "@/features/campaigns/pages/campaignId";
import { LoadingLayout } from "@/layouts/loading-layout";

const CampaignsIdRoute = () => {
	const { userId } = Route.useRouteContext();

	return (
		<Suspense fallback={<LoadingLayout />}>
			<CampaignId userId={userId} />
		</Suspense>
	);
};
export const Route = createFileRoute("/_authed/campaigns/$campaignId")({
	component: CampaignsIdRoute,
	ssr: false,
});
