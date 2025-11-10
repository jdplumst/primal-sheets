import { useSuspenseQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export function useSuspenseSession() {
	return useSuspenseQuery({
		queryKey: ["session"],
		queryFn: async () => {
			const session = await authClient.getSession();
			return session;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		// Refetch on window focus to keep session fresh
		refetchOnWindowFocus: true,
	});
}
