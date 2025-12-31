import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { fetchCampaignById } from "@/features/campaigns/handlers/campaign-handler";
import { QUERY_KEY, STALE_TIME } from "@/lib/constants";

export const useFetchCampaignById = (campaignId: string) => {
	const getCampaign = useServerFn(fetchCampaignById);

	return useSuspenseQuery(
		queryOptions({
			queryKey: QUERY_KEY.CAMPAIGNS.CAMPAIGN_ID(campaignId),
			queryFn: () => getCampaign({ data: { campaignId } }),
			staleTime: STALE_TIME.FIFTEEN_MINUTES,
		}),
	);
};
