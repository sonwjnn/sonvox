import { SidebarInset, SidebarProvider } from "@sonvox/ui/components/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { getPayment } from "@/functions/get-payment";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/dashboard")({
	component: DashboardLayout,
	beforeLoad: async () => {
		const session = await getUser();
		const customerState = await getPayment();
		return { session, customerState };
	},
	loader: async ({ context }) => {
		if (!context.session) {
			throw redirect({
				to: "/login",
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
