import { createAuthClient } from "better-auth/react";
import { getBaseURL } from "@/lib/get-base-url";
export const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: getBaseURL(),
});
