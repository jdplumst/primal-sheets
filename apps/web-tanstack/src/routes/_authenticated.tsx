import {
	createFileRoute,
	Navigate,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { getContext } from "@/integrations/tanstack-query/root-provider";
import { LoadingLayout } from "@/layouts/loading-layout";
import { authQueryOptions } from "@/lib/auth-queries";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		const { queryClient } = getContext();
		const session = await queryClient.fetchQuery(authQueryOptions);

		if (!session?.data?.user?.id) {
			throw redirect({ to: "/", replace: true });
		}
		return { userId: session.data.user.id };
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const { userId } = Route.useRouteContext();

	if (!userId) return <Navigate to="/" />;

	return (
		<ErrorBoundary>
			<Suspense fallback={<LoadingLayout />}>
				<Outlet />
			</Suspense>
		</ErrorBoundary>
	);
}
