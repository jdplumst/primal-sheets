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
	return (
		<Suspense fallback={<LoadingLayout />}>
			<Campaigns />
		</Suspense>
	);
};

export const Route = createFileRoute("/campaigns/")({
	component: CampaignsRoute,
	validateSearch: searchSchema,
	ssr: false,
	beforeLoad: ({ search }) => {
		if (search.code || search.state) {
			throw redirect({ to: "/campaigns" });
		}
	},
});
