import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const useSignIn = () => {
	return useMutation({
		mutationFn: async () => {
			const result = await authClient.signIn.social({
				provider: "discord",
				callbackURL: "/campaigns",
			});

			if (result.error) {
				throw result.error;
			}

			return { ...result };
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to sign in with Discord. Please try again.";
			toast.error("Sign in failed", {
				description: errorMessage,
			});
		},
	});
};
