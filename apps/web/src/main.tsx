import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import { ErrorBoundary } from "@/components/error-boundary.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { CampaignId } from "@/features/campaigns/pages/campaignId.tsx";
import { Campaigns } from "@/features/campaigns/pages/campaigns.tsx";
import { ProtectedLayout } from "@/layouts/protected-layout.tsx";
import App from "./App.tsx";
import { ErrorLayout } from "./layouts/error-layout.tsx";
import { LoadingLayout } from "./layouts/loading-layout.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}
const queryClient = new QueryClient();
createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<Toaster />
			<ErrorBoundary fallback={ErrorLayout}>
				<Suspense fallback={<LoadingLayout />}>
					<BrowserRouter>
						<Routes>
							<Route element={<ProtectedLayout isProtected={false} />}>
								<Route path="/" element={<App />} />
							</Route>
							<Route element={<ProtectedLayout isProtected />}>
								<Route path="/campaigns" element={<Campaigns />} />
							</Route>
							<Route element={<ProtectedLayout isProtected />}>
								<Route path="/campaigns/:campaignId" element={<CampaignId />} />
							</Route>
						</Routes>
					</BrowserRouter>
				</Suspense>
			</ErrorBoundary>
		</QueryClientProvider>
	</StrictMode>,
);
