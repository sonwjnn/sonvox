import { Button } from "@sonvox/ui/components/button";
import { cn, formatFileSize } from "@sonvox/ui/lib/utils";
import {
	FileAudio,
	Mic,
	Pause,
	Play,
	RotateCcw,
	Square,
	X,
} from "lucide-react";
import { useAudioRecorder } from "@/features/voices/hooks/use-audio-recorder";
import { useAudioPlayback } from "@/hooks/use-audio-playback";

function formatTime(seconds: number) {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor(seconds % 60);
	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function VoiceRecorder({
	file,
	onFileChange,
	isInvalid,
}: {
	file: File | null;
	onFileChange: (file: File | null) => void;
	isInvalid?: boolean;
}) {
	const { isPlaying, togglePlay } = useAudioPlayback(file);

	const {
		isRecording,
		elapsedTime,
		audioBlob,
		containerRef,
		error,
		startRecording,
		stopRecording,
		resetRecording,
	} = useAudioRecorder();

	const handleStop = () => {
		stopRecording((blob) => {
			const recordedFile = new File([blob], "recording.wav", {
				type: "audio/wav",
			});
			onFileChange(recordedFile);
		});
	};

	const handleReRecord = () => {
		onFileChange(null);
		resetRecording();
	};

	if (error) {
		return (
			<div className="flex flex-col items-center gap-4 rounded-2xl border border-destructive/50 bg-destructive/5 px-6 py-10">
				<p className="text-center text-destructive text-sm">{error}</p>
				<Button
					onClick={resetRecording}
					size="sm"
					type="button"
					variant="outline"
				>
					Try again
				</Button>
			</div>
		);
	}

	if (file) {
		return (
			<div className="flex items-center gap-3 rounded-xl border p-4">
				<div className="flex size-10 items-center justify-center rounded-lg bg-muted">
					<FileAudio className="size-5 text-muted-foreground" />
				</div>

				<div className="min-w-0 flex-1">
					<p className="truncate font-medium text-sm">{file.name}</p>
					<p className="text-muted-foreground text-xs">
						{formatFileSize(file.size)}
						{audioBlob && elapsedTime > 0 && (
							<>&nbsp;&middot;&nbsp;{formatTime(elapsedTime)}</>
						)}
					</p>
				</div>

				<Button
					onClick={togglePlay}
					size="icon-sm"
					title={isPlaying ? "Pause" : "Play"}
					type="button"
					variant="ghost"
				>
					{isPlaying ? (
						<Pause className="size-4" />
					) : (
						<Play className="size-4" />
					)}
				</Button>
				<Button
					onClick={handleReRecord}
					size="icon-sm"
					title="Re-record"
					type="button"
					variant="ghost"
				>
					<RotateCcw className="size-4" />
				</Button>
				<Button
					onClick={handleReRecord}
					size="icon-sm"
					title="Remove"
					type="button"
					variant="ghost"
				>
					<X className="size-4" />
				</Button>
			</div>
		);
	}

	if (isRecording) {
		return (
			<div className="flex flex-col overflow-hidden rounded-2xl border">
				<div className="w-full" ref={containerRef} />
				<div className="flex items-center justify-between border-t p-4">
					<p className="font-semibold text-[28px] leading-[1.2] tracking-tight">
						{formatTime(elapsedTime)}
					</p>
					<Button onClick={handleStop} type="button" variant="destructive">
						<Square className="size-3" />
						Stop
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border px-6 py-10",
				isInvalid && "border-destructive"
			)}
		>
			<div className="flex size-12 items-center justify-center rounded-xl bg-muted">
				<Mic className="size-5 text-muted-foreground" />
			</div>

			<div className="flex flex-col items-center gap-1.5">
				<p className="font-semibold text-base tracking-tight">
					Record your voice
				</p>
				<p className="text-center text-muted-foreground text-sm">
					Click record to start capturing audio
				</p>
			</div>
			<Button
				onClick={startRecording}
				size="sm"
				type="button"
				variant="outline"
			>
				<Mic className="size-3.5" />
				Record
			</Button>
		</div>
	);
}
