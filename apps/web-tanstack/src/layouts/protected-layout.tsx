import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router";
import { authClient } from "@/lib/auth-client";

interface ProtectedLayoutProps {
	isProtected: boolean;
}

export const ProtectedLayout = ({ isProtected }: ProtectedLayoutProps) => {
	const { data: session } = useSuspenseQuery(
		queryOptions({
			queryKey: ["auth"],
			queryFn: () => authClient.getSession(),
		}),
	);

	const userId = session.data?.session?.userId;

	if (!userId && isProtected) {
		return <Navigate to="/" replace />;
	}

	if (userId && !isProtected) {
		return <Navigate to="/campaigns" replace />;
	}

	return <Outlet context={{ userId: session.data?.session?.userId }} />;
};
