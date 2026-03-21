import { useParams } from "react-router";
import { useFetchCampaignById } from "@/features/campaigns/hooks/useFetchCampaignById";

export const CampaignId = () => {
	const { campaignId } = useParams();
	const { data: campaign } = useFetchCampaignById(campaignId ?? "");

	if (!campaign) {
		return <div>This campaign does not exist!</div>;
	}

	return <div>campaign id: {campaignId}</div>;
};
