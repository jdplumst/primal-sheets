import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEY, STALE_TIME } from "@/lib/constants";
import { AppError } from "@/lib/utils";
import { hono } from "@/rpc";

export const campaignsQueryOptions = queryOptions({
	queryKey: QUERY_KEY.CAMPAIGNS.CAMPAIGNS,
	queryFn: async () => {
		const res = await hono.api.campaigns.$get();
		return await res.json();
	},
	staleTime: STALE_TIME.FIFTEEN_MINUTES,
});

export const campaignIdQueryOptions = (campaignId: string) =>
	queryOptions({
		queryKey: QUERY_KEY.CAMPAIGNS.CAMPAIGN_ID(campaignId),
		queryFn: async () => {
			const res = await hono.api.campaigns[":id"].$get({
				param: { id: campaignId },
			});
			if (!res.ok) {
				// try using when adding error boundary
				const error = await res.json();
				throw new AppError(error as string);
			}
			return res.json();
		},
		staleTime: STALE_TIME.FIFTEEN_MINUTES,
		retry: false,
	});
