import { Component } from "react";
import { toast } from "sonner";
import { AppError } from "@/lib/utils";

// Inner class that catches errors
class ErrorBoundaryInner extends Component<
	{
		children: React.ReactNode;
		onError: (error: Error) => void;
		fallback?: (error: Error) => React.ReactNode;
	},
	{ hasError: boolean; error: Error | null }
> {
	state = { hasError: false, error: null };

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error) {
		setTimeout(() => this.props.onError(error), 0);
	}

	render() {
		if (this.state.hasError && this.state.error)
			return this.props.fallback?.(this.state.error) ?? null;
		return this.props.children;
	}
}

// Outer functional wrapper so we can use hooks
export const ErrorBoundary = ({
	children,
	fallback: Fallback,
}: {
	children: React.ReactNode;
	fallback?: React.ComponentType<{ error: Error }>;
}) => {
	return (
		<ErrorBoundaryInner
			fallback={(error) => (Fallback ? <Fallback error={error} /> : null)}
			onError={(error) =>
				toast.error(
					error instanceof AppError ? error.message : "Something went wrong",
				)
			}
		>
			{children}
		</ErrorBoundaryInner>
	);
};
