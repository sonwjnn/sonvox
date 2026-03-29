import { Button } from "@sonvox/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@sonvox/ui/components/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@sonvox/ui/components/drawer";
import { useCallback } from "react";
import { toast } from "sonner";
import { useCheckout } from "@/features/billing/hooks/use-checkout";
import { useIsMobile } from "@/hooks/use-mobile";
import { VoiceCreateForm } from "./voice-create-form";

type VoiceCreateDialogProps = {
	children?: React.ReactNode;
	onOpenChange?: (open: boolean) => void;
	open?: boolean;
};

export function VoiceCreateDialog({
	children,
	open,
	onOpenChange,
}: VoiceCreateDialogProps) {
	const isMobile = useIsMobile();

	const { checkout } = useCheckout();

	const handleError = useCallback(
		(message: string) => {
			if (message === "SUBSCRIPTION_REQUIRED") {
				toast.error("Subscription required", {
					action: {
						label: "Subscribe",
						onClick: () => checkout(),
					},
				});
			} else {
				toast.error(message);
			}
		},
		[checkout]
	);

	if (isMobile) {
		return (
			<Drawer onOpenChange={onOpenChange} open={open}>
				{children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Create custom voice</DrawerTitle>
						<DrawerDescription>
							Upload or record an audio sample to add a new voice to your
							library.
						</DrawerDescription>
					</DrawerHeader>
					<VoiceCreateForm
						footer={(submit) => (
							<DrawerFooter>
								{submit}
								<DrawerClose asChild>
									<Button variant="outline">Cancel</Button>
								</DrawerClose>
							</DrawerFooter>
						)}
						onError={handleError}
						scrollable
					/>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			{children && <DialogTrigger asChild>{children}</DialogTrigger>}
			<DialogContent>
				<DialogHeader className="text-left">
					<DialogTitle>Create custom voice</DialogTitle>
					<DialogDescription>
						Upload or record an audio sample to add a new voice to your library.
					</DialogDescription>
				</DialogHeader>
				<VoiceCreateForm onError={handleError} />
			</DialogContent>
		</Dialog>
	);
}
