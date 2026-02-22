import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEY, STALE_TIME } from "@/lib/constants";
import { hono } from "@/rpc";

export const useFetchCampaignById = (campaignId: string) => {
	return useSuspenseQuery(
		queryOptions({
			queryKey: QUERY_KEY.CAMPAIGNS.CAMPAIGN_ID(campaignId),
			queryFn: async () => {
				const res = await hono.api.campaigns[":id"].$get({
					param: { id: campaignId },
				});
				if (!res.ok) {
					// try using when adding error boundary
					// const error = await res.json();
					// throw new Error(error as string);
					return null;
				}
				return res.json();
			},
			staleTime: STALE_TIME.FIFTEEN_MINUTES,
		}),
	);
};
