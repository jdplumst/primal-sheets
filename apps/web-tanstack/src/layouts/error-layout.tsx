export const ErrorLayout = ({ error }: { error: Error }) => {
	return (
		<div className="w-screen h-screen flex justify-center items-center">
			{error.message}
		</div>
	);
};
