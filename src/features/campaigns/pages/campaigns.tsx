import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignsList } from "@/features/campaigns/components/campaigns-list";
import { authClient } from "@/lib/auth-client";

interface CampaignsProps {
	userId: string;
}

export const Campaigns = ({ userId }: CampaignsProps) => {
	const navigate = useNavigate();

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
						<CampaignsList userId={userId} />
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
};
