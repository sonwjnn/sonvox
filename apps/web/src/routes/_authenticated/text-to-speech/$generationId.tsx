import { createFileRoute } from "@tanstack/react-router";

import { TextToSpeechDetailView } from "@/features/text-to-speech/views/text-to-speech-detail-view";

export const Route = createFileRoute(
	"/_authenticated/text-to-speech/$generationId"
)({
	component: TextToSpeechDetailRoute,
});

function TextToSpeechDetailRoute() {
	const { generationId } = Route.useParams();
	return <TextToSpeechDetailView generationId={generationId} />;
}
