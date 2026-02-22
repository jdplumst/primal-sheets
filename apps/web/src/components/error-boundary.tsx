import { Component } from "react";
import { toast } from "sonner";
import { AppError } from "@/lib/utils";

// Inner class that catches errors
class ErrorBoundaryInner extends Component<
	{
		children: React.ReactNode;
		onError: (error: Error) => void;
		fallback?: React.ReactNode;
	},
	{ hasError: boolean }
> {
	state = { hasError: false };

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: Error) {
		setTimeout(() => this.props.onError(error), 0);

		// this.props.onError(error);
	}

	render() {
		if (this.state.hasError) return this.props.fallback ?? null;
		return this.props.children;
	}
}

// Outer functional wrapper so we can use hooks
export const ErrorBoundary = ({
	children,
	fallback,
}: {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}) => {
	return (
		<ErrorBoundaryInner
			fallback={fallback}
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
