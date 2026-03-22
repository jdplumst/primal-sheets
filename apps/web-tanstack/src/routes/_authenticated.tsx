import {
	createFileRoute,
	Navigate,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingLayout } from "@/layouts/loading-layout";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		let session = await authClient.getSession();
		let retries = 0;

		while (!session?.data?.user?.id && retries < 3) {
			session = await authClient.getSession();
			retries++;
		}

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
