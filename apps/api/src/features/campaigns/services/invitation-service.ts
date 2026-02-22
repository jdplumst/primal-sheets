import { db } from "@/db";
import { fetchInvitationsRepository } from "@/features/campaigns/repositories/invitation-repository";
import { okResult } from "@/utils/result";

export async function fetchInvitationsService(userId: string) {
	const invitations = await fetchInvitationsRepository(db, userId);
	return okResult(invitations, 200);
}
