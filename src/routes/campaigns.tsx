import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { Campaigns } from "@/features/campaigns/pages/campaigns";
import { LoadingLayout } from "@/layouts/loading-layout";
import { authClient } from "@/lib/auth-client";

const CampaignsRoute = () => {
	const { userId } = Route.useRouteContext();

	return (
		<Suspense fallback={<LoadingLayout />}>
			<Campaigns userId={userId} />
		</Suspense>
	);
};

export const Route = createFileRoute("/campaigns")({
	component: CampaignsRoute,
	ssr: false,
	beforeLoad: async () => {
		const session = await authClient.getSession();

		if (!session.data?.user.id) {
			throw redirect({
				to: "/",
				search: {
					error: "Unauthorized",
					error_description: "You must be logged in to view content",
				},
			});
		}

		return {
			userId: session.data.user.id,
		};
	},
});
