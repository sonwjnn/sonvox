import { Badge } from "@sonvox/ui/components/badge";
import { Button } from "@sonvox/ui/components/button";
import { Spinner } from "@sonvox/ui/components/spinner";
import { cn } from "@sonvox/ui/lib/utils";
import { format } from "date-fns";
import { Download, Pause, Play, Redo, Undo } from "lucide-react";
import { useState } from "react";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import { useWaveSurfer } from "@/features/text-to-speech/hooks/use-wavesurfer";

type VoicePreviewPanelVoice = {
	id?: string;
	name: string;
};

function formatTime(seconds: number): string {
	return format(new Date(seconds * 1000), "mm:ss");
}

export function VoicePreviewPanel({
	audioUrl,
	voice,
	text,
}: {
	audioUrl: string;
	voice: VoicePreviewPanelVoice | null;
	text: string;
}) {
	const [isDownloading, setIsDownloading] = useState(false);
	const selectedVoiceName = voice?.name ?? null;
	const selectedVoiceSeed = voice?.id ?? null;

	const {
		containerRef,
		isPlaying,
		isReady,
		currentTime,
		duration,
		togglePlayPause,
		seekBackward,
		seekForward,
	} = useWaveSurfer({
		url: audioUrl,
		autoplay: true,
	});

	const handleDownload = () => {
		setIsDownloading(true);

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

		setTimeout(() => setIsDownloading(false), 1000);
	};

	return (
		<div className="hidden h-full flex-1 flex-col gap-8 border-t lg:flex">
			{/* Header */}
			<div className="p-6 pb-0">
				<h3 className="font-semibold text-foreground">Voice preview</h3>
			</div>

			{/* Content */}
			<div className="relative flex flex-1 items-center justify-center">
				{!isReady && (
					<div className="absolute inset-0 z-10 flex items-center justify-center">
						<Badge
							className="gap-2 bg-background/90 px-3 py-1.5 text-muted-foreground text-sm shadow-sm"
							variant="outline"
						>
							<Spinner className="size-4" />
							<span>Loading audio...</span>
						</Badge>
					</div>
				)}
				<div
					className={cn(
						"w-full cursor-pointer transition-opacity duration-200",
						!isReady && "opacity-0"
					)}
					ref={containerRef}
				/>
			</div>
			{/* Time display */}
			<div className="flex items-center justify-center">
				<p className="font-semibold text-3xl text-foreground tabular-nums tracking-tight">
					{formatTime(currentTime)}&nbsp;
					<span className="text-muted-foreground">
						/&nbsp;{formatTime(duration)}
					</span>
				</p>
			</div>

			{/* Footer */}
			<div className="flex flex-col items-center p-6">
				<div className="grid w-full grid-cols-3">
					{/* Metadata */}
					<div className="flex min-w-0 flex-col gap-0.5">
						<p className="truncate font-medium text-foreground text-sm">
							{text}
						</p>
						{selectedVoiceName && (
							<div className="flex items-center gap-1 text-muted-foreground text-xs">
								<VoiceAvatar
									className="shrink-0"
									name={selectedVoiceName}
									seed={selectedVoiceSeed ?? selectedVoiceName}
								/>
								<span className="truncate">{selectedVoiceName}</span>
							</div>
						)}
					</div>

					{/* Player controls */}
					<div className="flex items-center justify-center gap-3">
						<Button
							className="flex-col"
							disabled={!isReady}
							onClick={() => seekBackward(10)}
							size="icon-lg"
							variant="ghost"
						>
							<Undo className="-mb-1 size-4" />
							<span className="font-medium text-[10px]">10</span>
						</Button>

						<Button
							className="rounded-full"
							onClick={togglePlayPause}
							size="icon-lg"
							variant="default"
						>
							{isPlaying ? (
								<Pause className="fill-background" />
							) : (
								<Play className="fill-background" />
							)}
						</Button>

						<Button
							className="flex-col"
							disabled={!isReady}
							onClick={() => seekForward(10)}
							size="icon-lg"
							variant="ghost"
						>
							<Redo className="-mb-1 size-4" />
							<span className="font-medium text-[10px]">10</span>
						</Button>
					</div>

					{/* Download */}
					<div className="flex justify-end">
						<Button
							disabled={isDownloading}
							onClick={handleDownload}
							size="sm"
							variant="outline"
						>
							<Download className="size-4" />
							Download
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
