import { queryOptions } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { QUERY_KEY } from "@/lib/constants";

export const authQueryOptions = queryOptions({
	queryKey: QUERY_KEY.AUTH,
	queryFn: () => authClient.getSession(),
	retry: 3,
});
