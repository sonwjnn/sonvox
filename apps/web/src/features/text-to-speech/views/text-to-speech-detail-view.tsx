import { useSuspenseQueries } from "@tanstack/react-query";
import { SettingsPanel } from "@/features/text-to-speech/components/settings-panel";
import { TextInputPanel } from "@/features/text-to-speech/components/text-input-panel";
import {
	TextToSpeechForm,
	type TTSFormValues,
} from "@/features/text-to-speech/components/text-to-speech-form";
import { useTRPC } from "@/utils/trpc";
import { VoicePreviewMobile } from "../components/voice-preview-mobile";
import { VoicePreviewPanel } from "../components/voice-preview-panel";
import { TTSVoicesProvider } from "../contexts/tts-voices-context";

export function TextToSpeechDetailView({
	generationId,
}: {
	generationId: string;
}) {
	const trpc = useTRPC();
	const [generationQuery, voicesQuery] = useSuspenseQueries({
		queries: [
			trpc.generations.getById.queryOptions({ id: generationId }),
			trpc.voices.getAll.queryOptions(),
		],
	});

	const data = generationQuery.data;
	const { custom: customVoices, system: systemVoices } = voicesQuery.data;
	const allVoices = [...customVoices, ...systemVoices];

	const fallbackVoiceId = allVoices[0]?.id ?? "";

	// Requested voice may no longer exist (deleted); fall back to first available
	const resolvedVoiceId =
		data?.voiceId && allVoices.some((v) => v.id === data.voiceId)
			? data.voiceId
			: fallbackVoiceId;

	const defaultValues: TTSFormValues = {
		text: data.text,
		voiceId: resolvedVoiceId,
		temperature: data.temperature,
		topP: data.topP,
		topK: data.topK,
		repetitionPenalty: data.repetitionPenalty,
	};

	// Use the denormalized voiceName snapshot instead of a populated voice relation
	// so the preview always shows the voice name at the time of generation,
	// even if the voice was later renamed or deleted.
	const generationVoice = {
		id: data.voiceId ?? undefined,
		name: data.voiceName,
	};

	return (
		<TTSVoicesProvider value={{ customVoices, systemVoices, allVoices }}>
			<TextToSpeechForm defaultValues={defaultValues} key={generationId}>
				<div className="flex min-h-0 flex-1 overflow-hidden">
					<div className="flex min-h-0 flex-1 flex-col">
						<TextInputPanel />
						<VoicePreviewMobile
							audioUrl={data.audioUrl}
							text={data.text}
							voice={generationVoice}
						/>
						<VoicePreviewPanel
							audioUrl={data.audioUrl}
							text={data.text}
							voice={generationVoice}
						/>
					</div>
					<SettingsPanel />
				</div>
			</TextToSpeechForm>
		</TTSVoicesProvider>
	);
}
