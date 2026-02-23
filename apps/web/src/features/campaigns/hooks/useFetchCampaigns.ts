import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { STALE_TIME } from "@/lib/constants";
import { hono } from "@/rpc";

export const useFetchCampaigns = (userId: string) => {
	return useSuspenseQuery(
		queryOptions({
			queryKey: ["campaigns", userId],
			queryFn: async () => {
				const res = await hono.api.campaigns.$get();
				return await res.json();
			},
			staleTime: STALE_TIME.FIFTEEN_MINUTES,
		}),
	);
};
