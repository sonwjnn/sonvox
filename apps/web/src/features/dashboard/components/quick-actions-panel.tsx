import { QuickActionCard } from "@/features/dashboard/components/quick-action-card";
import { quickActions } from "@/features/dashboard/data/quick-actions";

export function QuickActionsPanel() {
	return (
		<div className="space-y-4">
			<h2 className="font-semibold text-lg">Quick actions</h2>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{quickActions.map((action) => (
					<QuickActionCard
						description={action.description}
						gradient={action.gradient}
						href={action.href}
						key={action.title}
						title={action.title}
					/>
				))}
			</div>
		</div>
	);
}
