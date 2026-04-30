import { createFileRoute } from "@tanstack/react-router";
import { MaintenanceErrorView } from "@/features/errors/ui/views/maintenance-error-view";

export const Route = createFileRoute("/(errors)/503")({
	component: MaintenanceErrorView,
});
