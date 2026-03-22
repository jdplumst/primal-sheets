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
		console.log("beforeLoad running");
		const session = await authClient.getSession();
		console.log("session:", session);
		if (!session?.data?.user?.id) {
			throw redirect({ to: "/" });
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
