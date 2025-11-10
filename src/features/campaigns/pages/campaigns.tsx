import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { fetchCampaigns } from "@/features/campaigns/handlers/fetch-campaigns";
import { useAuth } from "@/hooks/useAuth";

export const Campaigns = () => {
	const { userId } = useAuth();

	const { data: campaigns } = useSuspenseQuery({
		queryKey: ["campaigns", userId],
		queryFn: () => fetchCampaigns(),
	});

	if (campaigns.length === 0) {
		return (
			<Empty className="h-screen w-screen flex justify-center items-center">
				<EmptyHeader>
					<EmptyTitle>No Campaigns</EmptyTitle>
					<EmptyDescription>
						You currently aren't part of any campaigns. Try creating one!
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button>Add Campaign</Button>
				</EmptyContent>
			</Empty>
		);
	}

	return (
		<div>
			{campaigns.map((c) => (
				<div key={c.campaign.id}>{c.campaign.name}</div>
			))}
		</div>
	);
};
