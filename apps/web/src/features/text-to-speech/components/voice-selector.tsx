import { Field, FieldLabel } from "@sonvox/ui/components/field";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@sonvox/ui/components/select";
import { useStore } from "@tanstack/react-form";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import { useTTSVoices } from "@/features/text-to-speech/contexts/tts-voices-context";
import { VOICE_CATEGORY_LABELS } from "@/features/voices/data/voice-categories";
import { useTypedAppFormContext } from "@/hooks/use-app-form";
import { ttsFormOptions } from "./text-to-speech-form";

export function VoiceSelector() {
	const { customVoices, systemVoices, allVoices: voices } = useTTSVoices();

	const form = useTypedAppFormContext(ttsFormOptions);
	const voiceId = useStore(form.store, (s) => s.values.voiceId);
	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

	const selectedVoice = voices.find((v) => v.id === voiceId);
	const hasMissingSelectedVoice = Boolean(voiceId) && !selectedVoice;

	function getCurrentVoice(
		selectedVoice: (typeof voices)[number] | undefined,
		hasMissingSelectedVoice: boolean,
		voiceId: string,
		fallback: (typeof voices)[number] | undefined
	) {
		if (selectedVoice) {
			return selectedVoice;
		}
		if (hasMissingSelectedVoice) {
			return { id: voiceId, name: "Unavailable voice", category: null as null };
		}

		return fallback;
	}

	const currentVoice = getCurrentVoice(
		selectedVoice,
		hasMissingSelectedVoice,
		voiceId,
		voices[0]
	);

	return (
		<Field>
			<FieldLabel>Voice style</FieldLabel>
			<Select
				disabled={isSubmitting}
				onValueChange={(v) => form.setFieldValue("voiceId", v)}
				value={voiceId}
			>
				<SelectTrigger className="h-auto w-full gap-1 rounded-lg bg-white px-2 py-1">
					<SelectValue>
						{currentVoice && (
							<>
								<VoiceAvatar name={currentVoice.name} seed={currentVoice.id} />
								<span className="truncate font-medium text-sm tracking-tight">
									{currentVoice.name}
									{currentVoice.category &&
										` - ${VOICE_CATEGORY_LABELS[currentVoice.category]}`}
								</span>
							</>
						)}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{hasMissingSelectedVoice && currentVoice && (
						<>
							<SelectGroup>
								<SelectLabel>Selected Voice</SelectLabel>
								<SelectItem value={currentVoice.id}>
									<VoiceAvatar
										name={currentVoice.name}
										seed={currentVoice.id}
									/>
									<span className="truncate font-medium text-sm">
										{currentVoice.name}
										{currentVoice.category &&
											` - ${VOICE_CATEGORY_LABELS[currentVoice.category]}`}
									</span>
								</SelectItem>
							</SelectGroup>
							{(customVoices.length > 0 || systemVoices.length > 0) && (
								<SelectSeparator />
							)}
						</>
					)}
					{customVoices.length > 0 && (
						<SelectGroup>
							<SelectLabel>Team Voices</SelectLabel>
							{customVoices.map((v) => (
								<SelectItem key={v.id} value={v.id}>
									<VoiceAvatar name={v.name} seed={v.id} />
									<span className="truncate font-medium text-sm">
										{v.name} - {VOICE_CATEGORY_LABELS[v.category]}
									</span>
								</SelectItem>
							))}
						</SelectGroup>
					)}
					{customVoices.length > 0 && systemVoices.length > 0 && (
						<SelectSeparator />
					)}
					{systemVoices.length > 0 && (
						<SelectGroup>
							<SelectLabel>Built-in Voices</SelectLabel>
							{systemVoices.map((v) => (
								<SelectItem key={v.id} value={v.id}>
									<VoiceAvatar name={v.name} seed={v.id} />
									<span className="truncate font-medium text-sm">
										{v.name} - {VOICE_CATEGORY_LABELS[v.category]}
									</span>
								</SelectItem>
							))}
						</SelectGroup>
					)}
				</SelectContent>
			</Select>
		</Field>
	);
}
