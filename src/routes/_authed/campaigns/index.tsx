import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { Campaigns } from "@/features/campaigns/pages/campaigns";
import { LoadingLayout } from "@/layouts/loading-layout";

const searchSchema = z.object({
	code: z.string().optional(),
	state: z.string().optional(),
});

const CampaignsRoute = () => {
	const { userId } = Route.useRouteContext();

	return (
		<Suspense fallback={<LoadingLayout />}>
			<Campaigns userId={userId} />
		</Suspense>
	)
};

export const Route = createFileRoute("/_authed/campaigns/")({
	component: CampaignsRoute,
	ssr: false,
	validateSearch: searchSchema,
	beforeLoad: ({ search }) => {
		if (search.code || search.state) {
			throw redirect({ to: "/campaigns" });
		}
	},
});
