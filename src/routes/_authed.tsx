import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/lib/get-session";

// In your _authed.tsx layout route
export const Route = createFileRoute("/_authed")({
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
