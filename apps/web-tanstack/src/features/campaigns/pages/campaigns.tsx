import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { QUERY_KEY } from "@/lib/constants";
import { CampaignsList } from "../components/campaigns-list";

export const Campaigns = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: QUERY_KEY.AUTH });
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
						<CampaignsList />
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
};
