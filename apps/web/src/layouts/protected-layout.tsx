import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";

interface ProtectedLayoutProps {
	isProtected: boolean;
}

export const ProtectedLayout = ({ isProtected }: ProtectedLayoutProps) => {
	const navigate = useNavigate();

	const { data: session } = useSuspenseQuery(
		queryOptions({
			queryKey: ["auth"],
			queryFn: () => authClient.getSession(),
		}),
	);

	useEffect(() => {
		if (!session.data?.session.userId && isProtected) {
			navigate("/");
		} else if (session.data?.session.userId && !isProtected) {
			navigate("/campaigns");
		}
	}, [navigate, session, isProtected]);

	return <Outlet context={{ userId: session.data?.session.userId }} />;
};
