import { SidebarInset, SidebarProvider } from "@sonvox/ui/components/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/_dashboard")({
	component: DashboardLayout,
	beforeLoad: async () => {
		const session = await getUser();
		return { session };
	},
	loader: async ({ context }) => {
		if (!context.session) {
			throw await redirect({
				to: "/login",
			});
		}
		if (!context.session.session.activeOrganizationId) {
			throw await redirect({
				to: "/org-selection",
			});
		}
	},
});

function DashboardLayout() {
	return (
		<SidebarProvider>
			<DashboardSidebar />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
