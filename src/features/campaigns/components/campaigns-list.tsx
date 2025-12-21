import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
} from "@/components/ui/card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { CreateCampaignDialog } from "@/features/campaigns/components/create-campaign-dialog";
import { DeleteCampaignDialog } from "@/features/campaigns/components/delete-campaign-dialog";
import { useFetchCampaigns } from "@/features/campaigns/hooks/useFetchCampaigns";

interface CampaignsListProps {
	userId: string;
}

export const CampaignsList = ({ userId }: CampaignsListProps) => {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
	const { data: campaigns } = useFetchCampaigns(userId);

	return (
		<>
			<Card>
				{campaigns.length === 0 ? (
					<Empty>
						<EmptyHeader>
							<EmptyTitle>No Campaigns</EmptyTitle>
							<EmptyDescription>
								You currently aren't part of any campaigns. Try creating one!
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button onClick={() => setIsCreateDialogOpen(true)}>
								Add Campaign
							</Button>
						</EmptyContent>
					</Empty>
				) : (
					<>
						<CardHeader>
							<CardAction>
								<Button onClick={() => setIsCreateDialogOpen(true)}>
									Add Campaign
								</Button>
							</CardAction>
						</CardHeader>
						<CardContent>
							{campaigns.map((c) => (
								<div key={c.campaign.id}>
									{c.campaign.name}
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setCampaignToDelete(c.campaign.id)}
									>
										<Trash2Icon />
									</Button>
								</div>
							))}
						</CardContent>
					</>
				)}
			</Card>
			<CreateCampaignDialog
				userId={userId}
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
			/>
			<DeleteCampaignDialog
				userId={userId}
				campaignId={campaignToDelete}
				onClose={() => setCampaignToDelete(null)}
			/>
		</>
	);
};
