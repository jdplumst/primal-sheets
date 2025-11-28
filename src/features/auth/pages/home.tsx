import { useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const Home = () => {
	const { error, error_description } = useSearch({ from: "/" });

	if (error) {
		const message =
			error_description || error || "Failed to sign in with Discord";
		toast.error("Sign in failed", {
			description: message,
		});
	}

	const handleDiscordSignIn = async () => {
		try {
			await authClient.signIn.social({
				provider: "discord",
				callbackURL: "/campaigns",
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to sign in with Discord. Please try again.";
			toast.error("Sign in failed", {
				description: errorMessage,
			});
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-blue-400/5"></div>
				<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-yellow-400/3 to-transparent"></div>
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/2 to-transparent"></div>
			</div>

			{/* Main content */}
			<div className="relative z-10 text-center max-w-4xl mx-auto px-4">
				<div className="mb-8">
					<h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
						Primal Sheets
					</h1>
					<p className="text-xl text-gray-200 mb-2">
						Pokemon D&D Campaign Manager
					</p>
					<p className="text-lg text-gray-300 max-w-2xl mx-auto">
						Create and manage Pokemon D&D campaigns, build character sheets, and
						embark on epic adventures with your friends.
					</p>
				</div>

				<div className="space-y-4">
					<Button
						onClick={handleDiscordSignIn}
						size="lg"
						className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
					>
						<svg
							className="w-6 h-6 mr-3"
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-hidden="true"
						>
							<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0003 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
						</svg>
						Sign in with Discord
					</Button>

					<div className="text-gray-400 text-sm">
						Join other trainers in epic Pokemon D&D adventures
					</div>
				</div>
			</div>
		</div>
	);
};
