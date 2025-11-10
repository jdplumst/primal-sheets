import { redirect } from "@tanstack/react-router";
import { createContext, type ReactNode } from "react";
import { useSuspenseSession } from "@/hooks/useSuspenseSession";

interface AuthenticatedLayoutProps {
	children: ReactNode;
}

export const AuthContext = createContext<{ userId: string } | null>(null);

export const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
	const { data: session } = useSuspenseSession();

	if (!session.data?.user.id) {
		redirect({
			to: "/",
			search: {
				error: "Unauthorized",
				error_description: "You must be logged in to view content",
			},
		});
		return null;
	}

	return (
		<AuthContext.Provider value={{ userId: session.data.user.id }}>
			{children}
		</AuthContext.Provider>
	);
};
