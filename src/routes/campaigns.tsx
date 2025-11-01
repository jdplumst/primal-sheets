import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/campaigns")({
	component: Campaigns,
	ssr: false,
});

function Campaigns() {
	return (
		<>
			<div>Campaigns</div>
			<Button>
				<PlusIcon />
				New Campaign
			</Button>
		</>
	);
}
