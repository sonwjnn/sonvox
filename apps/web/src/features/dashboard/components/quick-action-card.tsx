import { Button } from "@sonvox/ui/components/button";
import { cn } from "@sonvox/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { QuickAction } from "@/features/dashboard/data/quick-actions";

type QuickActionCardProps = QuickAction;

export function QuickActionCard({
	title,
	description,
	gradient,
	href,
}: QuickActionCardProps) {
	return (
		<div className="flex gap-4 rounded-xl border bg-card p-3">
			{/* Visual placeholder with gradient */}
			<div
				className={cn(
					"relative h-31 w-41 shrink-0 overflow-hidden rounded-xl bg-linear-to-br",
					gradient
				)}
			>
				{/* Decorative elements */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="size-12 rounded-full bg-white/30" />
				</div>
				<div className="absolute inset-2 rounded-lg ring-2 ring-white/20 ring-inset" />
			</div>

			{/* Content */}
			<div className="flex flex-col justify-between py-1">
				<div className="space-y-1">
					<h3 className="font-medium text-sm">{title}</h3>
					<p className="text-muted-foreground text-xs leading-relaxed">
						{description}
					</p>
				</div>
				<Button asChild className="w-fit" size="xs" variant="outline">
					<Link to={href}>
						Try now
						<ArrowRight className="size-3" />
					</Link>
				</Button>
			</div>
		</div>
	);
}
