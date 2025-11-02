import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/features/auth/pages/home";

export const Route = createFileRoute("/")({
	component: Home,
	ssr: true,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			error: (search.error as string) || undefined,
			error_description: (search.error_description as string) || undefined,
		};
	},
});
