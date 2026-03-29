import { Button } from "@sonvox/ui/components/button";
import { Spinner } from "@sonvox/ui/components/spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useCheckout } from "@/features/billing/hooks/use-checkout";
import { useTRPC } from "@/utils/trpc";

function formatCurrency(cents: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(cents / 100);
}

function UpgradeCard() {
	const { checkout, isPending: isCheckoutPending } = useCheckout();

	return (
		<div className="flex flex-col gap-3">
			<div>
				<p className="font-semibold text-foreground text-sm tracking-tight">
					Pay as you go
				</p>
				<p className="mt-1 text-muted-foreground text-xs">
					Generate speech starting at $0.30 per 1,000 characters
				</p>
			</div>
			<Button
				className="w-full text-xs"
				disabled={isCheckoutPending}
				onClick={checkout}
				size="sm"
				variant="outline"
			>
				{isCheckoutPending ? (
					<>
						<Spinner className="size-3" />
						Redirecting...
					</>
				) : (
					"Upgrade"
				)}
			</Button>
		</div>
	);
}

function UsageCard({ estimatedCostCents }: { estimatedCostCents: number }) {
	const trpc = useTRPC();
	const portalMutation = useMutation(
		trpc.billing.createPortalSession.mutationOptions({})
	);

	const openPortal = useCallback(() => {
		portalMutation.mutate(undefined, {
			onSuccess: (data) => {
				window.open(data.portalUrl, "_blank");
			},
		});
	}, [portalMutation]);

	return (
		<div className="flex flex-col gap-3">
			<div>
				<p className="font-semibold text-foreground text-sm tracking-tight">
					Current usage
				</p>
				<p className="mt-1 font-bold text-foreground text-xl tracking-tight">
					{formatCurrency(estimatedCostCents)}
				</p>
				<p className="mt-0.5 text-muted-foreground text-xs">
					Estimated this period
				</p>
			</div>
			<Button
				className="w-full text-xs"
				disabled={portalMutation.isPending}
				onClick={openPortal}
				size="sm"
				variant="outline"
			>
				{portalMutation.isPending ? (
					<>
						<Spinner className="size-3" />
						Redirecting...
					</>
				) : (
					"Manage Subscription"
				)}
			</Button>
		</div>
	);
}

export function UsageContainer() {
	const trpc = useTRPC();
	const { data } = useQuery(trpc.billing.getStatus.queryOptions());

	return (
		<div className="rounded-lg border border-border bg-background p-3 group-data-[collapsible=icon]:hidden">
			{data?.hasActiveSubscription ? (
				<UsageCard estimatedCostCents={data.estimatedCostCents} />
			) : (
				<UpgradeCard />
			)}
		</div>
	);
}
