import { Button } from "@sonvox/ui/components/button";
import { DrawerTrigger } from "@sonvox/ui/components/drawer";
import { useStore } from "@tanstack/react-form";
import { ChevronDown } from "lucide-react";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import { useTTSVoices } from "@/features/text-to-speech/contexts/tts-voices-context";
import { useTypedAppFormContext } from "@/hooks/use-app-form";
import { ttsFormOptions } from "./text-to-speech-form";

export function VoiceSelectorButton() {
	const { allVoices } = useTTSVoices();

	const form = useTypedAppFormContext(ttsFormOptions);
	const voiceId = useStore(form.store, (s) => s.values.voiceId);

	const currentVoice = allVoices.find((v) => v.id === voiceId) ?? allVoices[0];

	const buttonLabel = currentVoice?.name ?? "Select voice";

	return (
		<DrawerTrigger asChild>
			<Button
				className="flex-1 justify-start gap-2 px-2"
				size="sm"
				variant="outline"
			>
				{currentVoice && (
					<VoiceAvatar
						className="size-6"
						name={currentVoice.name}
						seed={currentVoice.id}
					/>
				)}
				<span className="flex-1 truncate text-left font-medium text-sm">
					{buttonLabel}
				</span>
				<ChevronDown className="size-4 shrink-0 text-muted-foreground" />
			</Button>
		</DrawerTrigger>
	);
}
