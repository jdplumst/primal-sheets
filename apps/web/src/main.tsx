import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import { Spinner } from "@/components/ui/spinner.tsx";
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
						<Route path="/" element={<App />} />
					</Routes>
				</BrowserRouter>
			</Suspense>
		</QueryClientProvider>
	</StrictMode>,
);
