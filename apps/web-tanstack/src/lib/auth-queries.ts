import { queryOptions } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { QUERY_KEY, STALE_TIME } from "@/lib/constants";

export const authQueryOptions = queryOptions({
	queryKey: QUERY_KEY.AUTH,
	queryFn: () => authClient.getSession(),
	staleTime: STALE_TIME.FIVE_MINUTES,
	retry: 3,
});
