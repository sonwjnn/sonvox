import { Button } from "@sonvox/ui/components/button";
import { Headphones, ThumbsUp } from "lucide-react";

export function DashboardHeader() {
	// TODO: Replace with auth context from the app
	const isLoaded = true;
	const userName = "there";

	return (
		<div className="flex items-start justify-between">
			<div className="space-y-1">
				<p className="text-muted-foreground text-sm">Nice to see you</p>
				<h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
					{isLoaded ? userName : "..."}
				</h1>
			</div>

			<div className="hidden items-center gap-3 lg:flex">
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
