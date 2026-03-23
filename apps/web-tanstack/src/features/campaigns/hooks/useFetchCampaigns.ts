import { useSuspenseQuery } from "@tanstack/react-query";
import { campaignsQueryOptions } from "@/features/campaigns/utils";

export const useFetchCampaigns = () => {
	return useSuspenseQuery(campaignsQueryOptions);
};
