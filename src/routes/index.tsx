import { createFileRoute, redirect } from "@tanstack/react-router";
import { Home } from "@/features/auth/pages/home";
import { getSession } from "@/lib/get-session";

export const Route = createFileRoute("/")({
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
	validateSearch: (search: Record<string, unknown>) => {
		return {
			error: (search.error as string) || undefined,
			error_description: (search.error_description as string) || undefined,
		};
	},
});
