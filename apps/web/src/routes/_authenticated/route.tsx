import { SidebarInset, SidebarProvider } from "@sonvox/ui/components/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		const session = await getUser();
		return { session };
	},
	loader: ({ context, location }) => {
		if (!context.session) {
			throw redirect({
				to: "/sign-in",
				search: { redirect: location.href },
			});
		}

		if (!context.session.session.activeOrganizationId) {
			throw redirect({
				to: "/org-selection",
			});
		}
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	return (
		<SidebarProvider>
			<DashboardSidebar />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
