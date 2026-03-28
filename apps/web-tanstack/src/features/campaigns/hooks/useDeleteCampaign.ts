import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEY } from "@/lib/constants";
import { hono } from "@/rpc";

export const useDeleteCampaign = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { id: string }) => {
			const res = await hono.api.campaigns[":id"].$delete({
				param: { id: data.id },
			});
			if (!res.ok) {
				const error = await res.json();
				throw new Error(error as string);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEY.CAMPAIGNS.CAMPAIGNS,
			});
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
