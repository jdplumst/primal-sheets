import { useParams } from "@tanstack/react-router";
import { useFetchCampaignById } from "@/features/campaigns/hooks/useFetchCampaignById";

export const CampaignId = () => {
	const { campaignId } = useParams({ from: "/campaigns/$campaignId" });
	const { data: campaign } = useFetchCampaignById(campaignId);

	if (!campaign) {
		return <div>This campaign does not exist!</div>;
	}

	return <div>campaign id: {campaignId}</div>;
};
