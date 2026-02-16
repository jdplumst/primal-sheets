import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { CampaignsList } from "../components/campaigns-list";

export const Campaigns = () => {
	const navigate = useNavigate();

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					navigate("/");
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
