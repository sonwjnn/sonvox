import { Button } from "@sonvox/ui/components/button";
import { SidebarTrigger } from "@sonvox/ui/components/sidebar";
import { cn } from "@sonvox/ui/lib/utils";
import { Headphones, ThumbsUp } from "lucide-react";

export function PageHeader({
	title,
	className,
}: {
	title: string;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex items-center justify-between border-b px-4 py-4",
				className
			)}
		>
			<div className="flex items-center gap-2">
				<SidebarTrigger />
				<h1 className="font-semibold text-lg tracking-tight">{title}</h1>
			</div>
			<div className="flex items-center gap-3">
				<Button asChild size="sm" variant="outline">
					<a href="mailto:business@codewithantonio.com">
						<ThumbsUp />
						<span className="hidden lg:block">Feedback</span>
					</a>
				</Button>
				<Button asChild size="sm" variant="outline">
					<a href="mailto:business@codewithantonio.com">
						<Headphones />
						<span className="hidden lg:block">Need help?</span>
					</a>
				</Button>
			</div>
		</div>
	);
}
