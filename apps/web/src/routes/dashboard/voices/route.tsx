import { createFileRoute, Outlet } from "@tanstack/react-router";

import { VoicesLayout } from "@/features/voices/views/voices-layout";

export const Route = createFileRoute("/dashboard/voices")({
	component: VoicesRouteLayout,
});

function VoicesRouteLayout() {
	return (
		<VoicesLayout>
			<Outlet />
		</VoicesLayout>
	);
}
