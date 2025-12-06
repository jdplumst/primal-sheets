import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Button } from "@/components/ui/button";
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCampaign } from "@/features/campaigns/hooks/useCreateCampaign";
import { createCampaignSchema } from "@/features/campaigns/utils/types";

type FormData = z.infer<typeof createCampaignSchema>;

interface CreateCampaignFormProps {
	userId: string;
	onSuccess: () => void;
}

export const CreateCampaignForm = ({
	userId,
	onSuccess,
}: CreateCampaignFormProps) => {
	const nameInputId = useId();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(createCampaignSchema),
		defaultValues: {
			name: "",
		},
	});

	const { mutate: createCampaign, isPending } = useCreateCampaign({
		userId,
		onSuccess,
	});

	const onSubmit = (data: FormData) => {
		createCampaign(data);
	};

	return (
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
						aria-invalid={!!errors.name}
						{...register("name")}
					/>
					{errors.name && (
						<p className="text-sm text-destructive">{errors.name.message}</p>
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
	);
};
