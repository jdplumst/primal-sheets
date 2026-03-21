import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteCampaign } from "@/features/campaigns/hooks/useDeleteCampaign";

interface DeleteCampaignDialogProps {
	userId: string;
	campaignId: string | null;
	onClose: () => void;
}

export const DeleteCampaignDialog = ({
	userId,
	campaignId,
	onClose,
}: DeleteCampaignDialogProps) => {
	const deleteCampaign = useDeleteCampaign({ userId });

	return (
		<Dialog open={!!campaignId} onOpenChange={(open) => !open && onClose}>
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
						onClick={onClose}
						disabled={deleteCampaign.isPending}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={() => {
							if (campaignId) {
								deleteCampaign.mutate(
									{ id: campaignId },
									{
										onSuccess: onClose,
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
	);
};
