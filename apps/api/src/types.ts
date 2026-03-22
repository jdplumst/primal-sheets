import type { createDb } from "@/db";
import type { createAuth } from "@/features/auth/lib/auth";

type Auth = ReturnType<typeof createAuth>;

export interface Context {
	Bindings: {
		BETTER_AUTH_URL?: string;
		BETTER_AUTH_SECRET?: string;
		DISCORD_CLIENT_ID?: string;
		DISCORD_CLIENT_SECRET?: string;
		CLIENT_URL?: string;
		DATABASE_URL?: string;
		DATABASE_AUTH_TOKEN?: string;
	};
	Variables: {
		userId: Auth["$Infer"]["Session"]["user"]["id"] | null;
		session: Auth["$Infer"]["Session"]["session"] | null;
		db: ReturnType<typeof createDb>;
	};
}

export interface AuthenticatedContext {
	Bindings: {
		BETTER_AUTH_URL?: string;
		BETTER_AUTH_SECRET?: string;
		DISCORD_CLIENT_ID?: string;
		DISCORD_CLIENT_SECRET?: string;
		CLIENT_URL?: string;
		DATABASE_URL?: string;
		DATABASE_AUTH_TOKEN?: string;
	};
	Variables: {
		userId: Auth["$Infer"]["Session"]["user"]["id"];
		session: Auth["$Infer"]["Session"]["session"];
		db: ReturnType<typeof createDb>;
	};
}
