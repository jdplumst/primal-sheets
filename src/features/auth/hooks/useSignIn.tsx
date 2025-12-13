import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const useSignIn = () => {
	const router = useRouter();

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
		onSuccess: () => {
			router.navigate({ to: "/campaigns" });
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
