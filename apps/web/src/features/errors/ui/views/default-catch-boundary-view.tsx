import type { ErrorComponentProps } from "@tanstack/react-router";
import {
	ErrorComponent,
	Link,
	rootRouteId,
	useMatch,
	useRouter,
} from "@tanstack/react-router";
import { Button } from "@sonvox/ui/components/button";

export const DefaultCatchBoundaryView = ({ error }: ErrorComponentProps) => {
	const router = useRouter();
	const isRoot = useMatch({
		strict: false,
		select: (state) => state.id === rootRouteId,
	});

	console.error("DefaultCatchBoundary Error:", error);

	return (
		<div className="flex h-svh flex-col items-center justify-center gap-6 p-4">
			<ErrorComponent error={error} />
			<div className="flex flex-wrap items-center gap-2">
				<Button
					onClick={() => {
						router.invalidate();
					}}
				>
					Try Again
				</Button>
				{isRoot ? (
					<Link className={ButtonVariants()} to="/">
						Home
					</Link>
				) : (
					<Link
						className={ButtonVariants()}
						onClick={(e) => {
							e.preventDefault();
							window.history.back();
						}}
						to="/"
					>
						Go Back
					</Link>
				)}
			</div>
		</div>
	);
};

function ButtonVariants() {
	return "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 px-3";
}
