import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export function useUserId() {
	const { data: session, isPending } = authClient.useSession();
	const navigate = useNavigate();
	const userId = session?.user?.id;

	useEffect(() => {
		if (!isPending && !userId) {
			navigate({ to: "/" });
		}
	}, [isPending, userId, navigate]);

	return { userId, isPending };
}
