import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/features/auth/hooks/useSession";
import { CampaignsList } from "@/features/campaigns/components/campaigns-list";
import { authClient } from "@/lib/auth-client";

export const Campaigns = () => {
	const navigate = useNavigate();

	// const { data: auth, isPending } = authClient.useSession();
	const { data: session } = useSession();

	if (!session.data?.session.userId) {
		navigate({ to: "/campaigns" });
	}

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					navigate({ to: "/" });
				},
			},
		});
	};

	return (
		<>
			<Button onClick={handleSignOut}>Sign Out</Button>
			<div className="flex min-h-screen min-w-screen justify-center items-center">
				<Tabs defaultValue="campaigns">
					<TabsList>
						<TabsTrigger value="campaigns">Campaigns</TabsTrigger>
						<TabsTrigger value="campaigns-invite">Invites</TabsTrigger>
					</TabsList>
					<TabsContent value="campaigns">
						<CampaignsList userId={session.data?.session.userId || ""} />
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
};
