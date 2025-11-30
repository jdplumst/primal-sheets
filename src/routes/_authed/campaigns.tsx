import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Campaigns } from "@/features/campaigns/pages/campaigns";
import { LoadingLayout } from "@/layouts/loading-layout";

const CampaignsRoute = () => {
	const { userId } = Route.useRouteContext();

	return (
		<Suspense fallback={<LoadingLayout />}>
			<Campaigns userId={userId} />
		</Suspense>
	);
};

export const Route = createFileRoute("/_authed/campaigns")({
	component: CampaignsRoute,
	ssr: false,
});
