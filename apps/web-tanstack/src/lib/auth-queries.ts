import { queryOptions } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const authQueryOptions = queryOptions({
	queryKey: ["auth"],
	queryFn: () => authClient.getSession(),
	retry: 3,
});
