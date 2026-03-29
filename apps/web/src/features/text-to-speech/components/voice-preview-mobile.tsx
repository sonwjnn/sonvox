import { Button } from "@sonvox/ui/components/button";
import { Download, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import { useIsMobile } from "@/hooks/use-mobile";

type VoicePreviewMobileVoice = {
	id?: string;
	name: string;
};

export function VoicePreviewMobile({
	audioUrl,
	voice,
	text,
}: {
	audioUrl: string;
	voice: VoicePreviewMobileVoice | null;
	text: string;
}) {
	const isMobile = useIsMobile();
	const selectedVoiceName = voice?.name ?? null;
	const selectedVoiceSeed = voice?.id ?? null;

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);

	// Reset audio state when audioUrl changes
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) {
			return;
		}

		const handlePlay = () => setIsPlaying(true);
		const handlePause = () => setIsPlaying(false);
		const handleEnded = () => setIsPlaying(false);

		audio.addEventListener("play", handlePlay);
		audio.addEventListener("pause", handlePause);
		audio.addEventListener("ended", handleEnded);

		audio.pause();
		audio.currentTime = 0;

		return () => {
			audio.removeEventListener("play", handlePlay);
			audio.removeEventListener("pause", handlePause);
			audio.removeEventListener("ended", handleEnded);
		};
	}, [audioUrl]);

	useEffect(() => {
		if (!isMobile) {
			audioRef.current?.pause();
		}
	}, [isMobile]);

	const togglePlayPause = () => {
		const audio = audioRef.current;
		if (!audio) {
			return;
		}

		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}
	};

	const handleDownload = () => {
		const safeName =
			text
				.slice(0, 50)
				.trim()
				.replace(/[^a-zA-Z0-9]+/g, "-")
				.replace(/^-|-$/g, "")
				.toLowerCase() || "speech";

		const link = document.createElement("a");
		link.href = audioUrl;
		link.download = `${safeName}.wav`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	if (!audioUrl) {
		return null;
	}

	return (
		<div className="border-t p-4 lg:hidden">
			<audio ref={audioRef} src={audioUrl}>
				<track kind="captions" />
			</audio>
			<div className="grid grid-cols-[1fr_auto] items-center gap-4">
				<div className="min-w-0">
					<p className="truncate font-medium text-sm">{text}</p>
					{selectedVoiceName && (
						<div className="mt-0.5 flex items-center gap-1 text-muted-foreground text-xs">
							<VoiceAvatar
								className="shrink-0"
								name={selectedVoiceName}
								seed={selectedVoiceSeed ?? selectedVoiceName}
							/>
							<span className="truncate">{selectedVoiceName}</span>
						</div>
					)}
				</div>

				<div className="flex items-center gap-2">
					<Button onClick={handleDownload} size="icon" variant="ghost">
						<Download className="size-4" />
					</Button>
					<Button
						className="rounded-full"
						onClick={togglePlayPause}
						size="icon"
						variant="default"
					>
						{isPlaying ? (
							<Pause className="fill-background" />
						) : (
							<Play className="fill-background" />
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
