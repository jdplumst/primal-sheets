import { eq } from "drizzle-orm";
import type { Database } from "@/db";
import { user } from "@/db/schema";

export async function fetchUserById(db: Database, userId: string) {
	const userData = await db.select().from(user).where(eq(user.id, userId));
	return userData[0] ?? null;
}
