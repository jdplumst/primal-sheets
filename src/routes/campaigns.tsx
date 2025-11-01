import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/campaigns")({
	component: Campaigns,
	ssr: false,
});

function Campaigns() {
	return <div>Campaigns</div>;
}
