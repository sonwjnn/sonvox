import { createFileRoute } from "@tanstack/react-router";
import { ForbiddenErrorView } from "@/features/errors/ui/views/forbidden-error-view";

export const Route = createFileRoute("/(errors)/403")({
	component: ForbiddenErrorView,
});
