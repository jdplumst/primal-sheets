import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { createCampaignSchema } from "schemas";
import type z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCampaign } from "@/features/campaigns/hooks/useCreateCampaign";

type FormData = z.infer<typeof createCampaignSchema>;

interface CreateCampaignDialogProps {
	userId: string;
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateCampaignDialog = ({
	userId,
	open,
	onOpenChange,
}: CreateCampaignDialogProps) => {
	const nameInputId = useId();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(createCampaignSchema),
		defaultValues: {
			campaignName: "",
		},
	});

	const { mutate: createCampaign, isPending } = useCreateCampaign({
		userId,
		closeDialog: () => handleOpenChange(false),
	});

	const onSubmit = (data: FormData) => {
		createCampaign(data);
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			reset();
		}
		onOpenChange(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Create Campaign</DialogTitle>
						<DialogDescription>
							Enter a name for your new campaign.
						</DialogDescription>
					</DialogHeader>

					<div className="py-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor={nameInputId}>Campaign Name</Label>
							<Input
								id={nameInputId}
								placeholder="Enter campaign name"
								aria-invalid={!!errors.campaignName}
								{...register("campaignName")}
							/>
							{errors.campaignName && (
								<p className="text-sm text-destructive">
									{errors.campaignName.message}
								</p>
							)}
						</div>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline" disabled={isPending}>
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" isBusy={isPending}>
							Create Campaign
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
