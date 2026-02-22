import { Hono } from "hono";
import { fetchInvitationsService } from "@/features/campaigns/services/invitation-service";
import type { AuthenticatedContext } from "@/types";

const app = new Hono<AuthenticatedContext>().get("/", async (c) => {
	const userId = c.get("userId");
	const res = await fetchInvitationsService(userId);
	return c.json(res.data, res.code);
});

export default app;
