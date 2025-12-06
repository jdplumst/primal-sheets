import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { CreateCampaignForm } from "@/features/campaigns/components/create-campaign-form";
import { useDeleteCampaign } from "@/features/campaigns/hooks/useDeleteCampaign";
import { useFetchCampaigns } from "@/features/campaigns/hooks/useFetchCampaigns";
import { authClient } from "@/lib/auth-client";

interface CampaignsProps {
	userId: string;
}

export const Campaigns = ({ userId }: CampaignsProps) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
	const { data: campaigns } = useFetchCampaigns(userId);
	const deleteCampaign = useDeleteCampaign({ userId });

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
								closeDialog={() => setIsDialogOpen(false)}
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
						closeDialog={() => setIsDialogOpen(false)}
					/>
				</DialogContent>
			</Dialog>
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

			<Dialog
				open={!!campaignToDelete}
				onOpenChange={(open) => !open && setCampaignToDelete(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete the
							campaign and remove all data associated with it.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setCampaignToDelete(null)}
							disabled={deleteCampaign.isPending}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								if (campaignToDelete) {
									deleteCampaign.mutate(
										{ id: campaignToDelete },
										{
											onSuccess: () => setCampaignToDelete(null),
										},
									);
								}
							}}
							isBusy={deleteCampaign.isPending}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
