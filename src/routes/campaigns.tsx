import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Campaigns } from "@/features/campaigns/pages/campaigns";
import { AuthenticatedLayout } from "@/layouts/authenticated-layout";
import { LoadingLayout } from "@/layouts/loading-layout";

const CampaignsRoute = () => {
	return (
		<Suspense fallback={<LoadingLayout />}>
			<AuthenticatedLayout>
				<Campaigns />
			</AuthenticatedLayout>
		</Suspense>
	);
};

export const Route = createFileRoute("/campaigns")({
	component: CampaignsRoute,
	ssr: false,
});
