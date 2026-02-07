import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const Campaigns = () => {
	const queryClient = useQueryClient();

	return (
		<div>
			<div>Campaigns page!</div>
			<Button
				onClick={() =>
					authClient.signOut({
						fetchOptions: {
							onSuccess: async () => {
								await queryClient.invalidateQueries({ queryKey: ["auth"] });
							},
						},
					})
				}
			>
				Sign out
			</Button>
		</div>
	);
};
