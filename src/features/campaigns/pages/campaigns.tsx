import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { CreateCampaignForm } from "@/features/campaigns/components/create-campaign-form";
import { useFetchCampaigns } from "@/features/campaigns/hooks/useFetchCampaigns";
import { authClient } from "@/lib/auth-client";

interface CampaignsProps {
	userId: string;
}

export const Campaigns = ({ userId }: CampaignsProps) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { data: campaigns } = useFetchCampaigns(userId);

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = "/";
				},
			},
		});
	};

	const handleCampaignCreated = () => {
		setIsDialogOpen(false);
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
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button>Add Campaign</Button>
						</DialogTrigger>
						<DialogContent>
							<CreateCampaignForm
								userId={userId}
								onSuccess={handleCampaignCreated}
							/>
						</DialogContent>
					</Dialog>
					<Button onClick={handleSignOut}>Sign Out</Button>
				</EmptyContent>
			</Empty>
		);
	}

	return (
		<div className="flex flex-col gap-4 min-h-screen min-w-screen justify-center items-center">
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogTrigger asChild>
					<Button>Add Campaign</Button>
				</DialogTrigger>
				<DialogContent>
					<CreateCampaignForm
						userId={userId}
						onSuccess={handleCampaignCreated}
					/>
				</DialogContent>
			</Dialog>
			{campaigns.map((c) => (
				<div key={c.campaign.id}>{c.campaign.name}</div>
			))}
		</div>
	);
};
