import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import { Campaigns } from "@/features/campaigns/pages/campaigns";
import { campaignsQueryOptions } from "@/features/campaigns/utils";
import { LoadingLayout } from "@/layouts/loading-layout";

const searchSchema = z.object({
	code: z.string().optional(),
	state: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/campaigns/")({
	validateSearch: searchSchema,
	component: Campaigns,
	beforeLoad: ({ search }) => {
		if (search.code || search.state) {
			throw redirect({
				to: "/campaigns",
				search: {},
				replace: true,
			});
		}
	},
	loader: async ({ context: { queryClient } }) => {
		queryClient.ensureQueryData(campaignsQueryOptions);
	},
	pendingComponent: LoadingLayout,
});
