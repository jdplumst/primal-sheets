export const getBaseURL = () => {
	// In browser, try VITE_BETTER_AUTH_URL first
	if (typeof window !== "undefined") {
		const viteUrl = import.meta.env.VITE_BETTER_AUTH_URL;
		if (viteUrl) {
			return viteUrl;
		}
		// Fallback to current origin (same domain - works for most deployments)
		return window.location.origin;
	}
	// In SSR, use process.env.BETTER_AUTH_URL
	return process.env.BETTER_AUTH_URL;
};
