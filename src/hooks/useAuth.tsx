import { useContext } from "react";
import { AuthContext } from "@/layouts/authenticated-layout";

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthenticatedLayout");
	}
	return context;
}
