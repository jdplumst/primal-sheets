import { useParams } from "@tanstack/react-router";
import { useFetchCampaignById } from "@/features/campaigns/hooks/useFetchCampaignById";

interface CampaignIdProps {
	userId: string;
}

//@ts-expect-error will likely use prop later on
export const CampaignId = ({ userId }: CampaignIdProps) => {
	const { campaignId } = useParams({ from: "/_authed/campaigns/$campaignId" });
	const { data: campaign } = useFetchCampaignById(campaignId);

	if (!campaign) {
		return <div>This campaign does not exist!</div>;
	}

	return <div>campaign id: {campaignId}</div>;
};
