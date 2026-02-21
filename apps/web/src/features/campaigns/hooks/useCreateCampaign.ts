import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { hono } from "@/rpc";

interface UseCreateCampaignOptions {
	userId: string;
	closeDialog: () => void;
}

export const useCreateCampaign = ({
	userId,
	closeDialog,
}: UseCreateCampaignOptions) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { campaignName: string }) => {
			const res = await hono.api.campaigns.$post({ json: data });
			if (!res.ok) {
				const error = await res.json();
				throw error;
			}

			return await res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["campaigns", userId] });
			closeDialog();
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
