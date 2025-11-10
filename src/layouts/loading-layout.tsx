import { Spinner } from "@/components/ui/spinner";

export const LoadingLayout = () => {
	return (
		<div className="w-screen h-screen flex justify-center items-center">
			<Spinner className="size-10" />
		</div>
	);
};
