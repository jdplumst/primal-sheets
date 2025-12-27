import { useParams } from "@tanstack/react-router";

interface CampaignIdProps {
	userId: string;
}

export const CampaignId = ({ userId }: CampaignIdProps) => {
	const { campaignId } = useParams({ from: "/_authed/campaigns/$campaignId" });
	return <div>campaign id: {campaignId}</div>;
};
