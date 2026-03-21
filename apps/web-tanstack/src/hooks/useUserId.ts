import { useOutletContext } from "react-router";

interface ContextType {
	userId: string;
}

export function useUserId() {
	const { userId } = useOutletContext<ContextType>();
	return userId;
}
