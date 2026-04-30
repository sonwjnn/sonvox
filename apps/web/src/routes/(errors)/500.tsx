import { createFileRoute } from "@tanstack/react-router";
import { GeneralErrorView } from "@/features/errors/ui/views/general-error-view";

export const Route = createFileRoute("/(errors)/500")({
	component: GeneralErrorView,
});
