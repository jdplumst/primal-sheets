import { createFileRoute } from "@tanstack/react-router";
import { Campaigns } from "@/features/campaigns/pages/campaigns";

export const Route = createFileRoute("/_authenticated/campaigns")({
	component: Campaigns,
});
