import { createFileRoute } from "@tanstack/react-router";

import { TextToSpeechView } from "@/features/text-to-speech/views/text-to-speech-view";

export const Route = createFileRoute(
	"/_authenticated/text-to-speech/"
)({
	component: TextToSpeechIndexRoute,
});

function TextToSpeechIndexRoute() {
	return <TextToSpeechView />;
}
