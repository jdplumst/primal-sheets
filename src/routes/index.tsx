import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { Home } from "@/features/auth/pages/home";
import { LoadingLayout } from "@/layouts/loading-layout";
import { getSession } from "@/lib/get-session";

const searchSchema = z.object({
	error: z.string().optional(),
	error_description: z.string().optional(),
});

export const Route = createFileRoute("/")({
	pendingComponent: () => <LoadingLayout />,
	pendingMs: 0,
	beforeLoad: async () => {
		const session = await getSession();

		if (session?.user?.id) {
			throw redirect({
				to: "/campaigns",
			});
		}

		return { session };
	},
	component: Home,
	ssr: true,
	validateSearch: searchSchema,
});
