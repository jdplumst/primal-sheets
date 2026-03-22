import { useFetchCampaignById } from "@/features/campaigns/hooks/useFetchCampaignById";
import { Route } from "@/routes/_authenticated/campaigns.$campaignId";

export const CampaignId = () => {
	const { campaignId } = Route.useParams();
	const { data: campaign } = useFetchCampaignById(campaignId ?? "");

	if (!campaign) {
		return <div>This campaign does not exist!</div>;
	}

	return <div>campaign id: {campaignId}</div>;
};
