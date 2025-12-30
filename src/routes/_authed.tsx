import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoadingLayout } from "@/layouts/loading-layout";
import { getSession } from "@/lib/get-session";

export const Route = createFileRoute("/_authed")({
	pendingComponent: () => <LoadingLayout />,
	pendingMs: 0,
	beforeLoad: async () => {
		const session = await getSession();

		if (!session?.user.id) {
			throw redirect({
				to: "/",
				search: {
					error: "Unauthorized",
					error_description: "You must be logged in to view content",
				},
			});
		}
		return {
			userId: session?.user.id,
		};
	},
});
