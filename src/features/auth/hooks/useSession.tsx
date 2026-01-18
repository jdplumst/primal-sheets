import { useSuspenseQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const useSession = () => {
	return useSuspenseQuery({
		queryKey: ["session"],
		queryFn: async () => {
			const session = await authClient.getSession();
			return session;
		},
	});
};
