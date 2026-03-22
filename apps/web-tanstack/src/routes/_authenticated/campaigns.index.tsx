import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import { Campaigns } from "@/features/campaigns/pages/campaigns";

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
});
