import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { deleteCampaign } from "@/features/campaigns/handlers/delete-campaign";

interface UseDeleteCampaignOptions {
	userId: string;
}

export const useDeleteCampaign = ({ userId }: UseDeleteCampaignOptions) => {
	const queryClient = useQueryClient();
	const deleteCampaignFn = useServerFn(deleteCampaign);

	return useMutation({
		mutationFn: (data: { id: string }) => deleteCampaignFn({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["campaigns", userId] });
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to delete campaign. Please try again.";
			toast.error("Failed to delete campaign", {
				description: errorMessage,
			});
		},
	});
};
