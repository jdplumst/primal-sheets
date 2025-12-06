import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { createCampaign } from "@/features/campaigns/handlers/create-campaign";

interface UseCreateCampaignOptions {
	userId: string;
	onSuccess?: () => void;
}

export const useCreateCampaign = ({
	userId,
	onSuccess,
}: UseCreateCampaignOptions) => {
	const queryClient = useQueryClient();
	const createCampaignFn = useServerFn(createCampaign);

	return useMutation({
		mutationFn: (data: { name: string }) => createCampaignFn({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["campaigns", userId] });
			onSuccess?.();
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to create campaign. Please try again.";
			toast.error("Failed to create campaign", {
				description: errorMessage,
			});
		},
	});
};
