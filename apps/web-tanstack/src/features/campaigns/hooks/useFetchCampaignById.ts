import { useSuspenseQuery } from "@tanstack/react-query";
import { campaignIdQueryOptions } from "@/features/campaigns/utils";

export const useFetchCampaignById = (campaignId: string) => {
	return useSuspenseQuery(campaignIdQueryOptions(campaignId));
};
