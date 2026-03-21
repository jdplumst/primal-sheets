import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { LoadingLayout } from "@/layouts/loading-layout";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const { data: session, isPending } = authClient.useSession();

	if (isPending) return <LoadingLayout />;
	if (!session?.user?.id) return <Navigate to="/" />;

	return <Outlet />;
}
