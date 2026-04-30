import { createFileRoute } from "@tanstack/react-router";

import { VoicesView } from "@/features/voices/views/voices-view";

export const Route = createFileRoute("/_authenticated/voices/")({
	component: VoicesView,
});
