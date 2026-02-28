import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
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

	const userId = session.data?.session.userId;

	if (!userId && isProtected) {
		navigate("/");
		return null;
	}

	if (userId && !isProtected) {
		navigate("/campaigns");
		return null;
	}

	return <Outlet context={{ userId: session.data?.session.userId }} />;
};
