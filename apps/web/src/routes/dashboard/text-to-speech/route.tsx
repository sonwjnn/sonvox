import { createFileRoute, Outlet } from "@tanstack/react-router";

import { TextToSpeechLayout } from "@/features/text-to-speech/views/text-to-speech-layout";

export const Route = createFileRoute("/dashboard/text-to-speech")({
	component: TextToSpeechRouteLayout,
});

function TextToSpeechRouteLayout() {
	return (
		<TextToSpeechLayout>
			<Outlet />
		</TextToSpeechLayout>
	);
}
