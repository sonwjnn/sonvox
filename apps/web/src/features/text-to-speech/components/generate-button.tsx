import { Button } from "@sonvox/ui/components/button";
import { Spinner } from "@sonvox/ui/components/spinner";

export function GenerateButton({
	size,
	disabled,
	isSubmitting,
	onSubmit,
	className,
}: {
	size?: "default" | "sm";
	disabled: boolean;
	isSubmitting: boolean;
	onSubmit: () => void;
	className?: string;
}) {
	return (
		<Button
			className={className}
			disabled={disabled}
			onClick={onSubmit}
			size={size}
		>
			{isSubmitting ? (
				<>
					<Spinner className="size-3" />
					Generating...
				</>
			) : (
				"Generate speech"
			)}
		</Button>
	);
}
