import type { auth } from "@/features/auth/lib/auth";

export interface Context {
	Variables: {
		userId: typeof auth.$Infer.Session.user.id | null;
		session: typeof auth.$Infer.Session.session | null;
	};
}

export interface AuthenticatedContext {
	Variables: {
		userId: typeof auth.$Infer.Session.user.id;
		session: typeof auth.$Infer.Session.session;
	};
}
