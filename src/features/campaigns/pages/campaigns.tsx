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
import { authClient } from "@/lib/auth-client";

interface CampaignsProps {
	userId: string;
}

export const Campaigns = ({ userId }: CampaignsProps) => {
	const { data: campaigns } = useSuspenseQuery({
		queryKey: ["campaigns", userId],
		queryFn: () => fetchCampaigns(),
	});

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = "/";
				},
			},
		});
	};

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
					<Button onClick={handleSignOut}>Sign Out</Button>
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
