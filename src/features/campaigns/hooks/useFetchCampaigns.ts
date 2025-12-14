import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { fetchCampaigns } from "@/features/campaigns/handlers/campaign-handler";
import { STALE_TIME } from "@/lib/constants";

export const useFetchCampaigns = (userId: string) => {
	const getCampaigns = useServerFn(fetchCampaigns);

	return useSuspenseQuery(
		queryOptions({
			queryKey: ["campaigns", userId],
			queryFn: () => getCampaigns(),
			staleTime: STALE_TIME.FIFTEEN_MINUTES,
		}),
	);
};
