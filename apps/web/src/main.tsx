import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Campaigns } from "@/features/campaigns/pages/campaigns.tsx";
import { ProtectedLayout } from "@/layouts/protected-layout.tsx";
import App from "./App.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}
const queryClient = new QueryClient();
createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<Suspense fallback={<Spinner />}>
				<BrowserRouter>
					<Routes>
						<Route element={<ProtectedLayout isProtected={false} />}>
							<Route path="/" element={<App />} />
						</Route>
						<Route element={<ProtectedLayout isProtected />}>
							<Route path="/campaigns" element={<Campaigns />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</Suspense>
		</QueryClientProvider>
	</StrictMode>,
);
