import { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { useIsMobile } from "@/hooks/use-mobile";

type UseWaveSurferOptions = {
	autoplay?: boolean;
	onError?: (error: Error) => void;
	onReady?: () => void;
	url?: string;
};

type UseWaveSurferReturn = {
	containerRef: React.RefObject<HTMLDivElement | null>;
	currentTime: number;
	duration: number;
	isPlaying: boolean;
	isReady: boolean;
	seekBackward: (seconds?: number) => void;
	seekForward: (seconds?: number) => void;
	togglePlayPause: () => void;
};

export function useWaveSurfer({
	url,
	autoplay,
	onReady,
	onError,
}: UseWaveSurferOptions): UseWaveSurferReturn {
	const containerRef = useRef<HTMLDivElement>(null);
	const wavesurferRef = useRef<WaveSurfer | null>(null);
	const isMobile = useIsMobile();

	const [isPlaying, setIsPlaying] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

	useEffect(() => {
		if (!(containerRef.current && url)) {
			return;
		}

		if (wavesurferRef.current) {
			wavesurferRef.current.destroy();
			wavesurferRef.current = null;
		}

		let destroyed = false;

		const ws = WaveSurfer.create({
			container: containerRef.current,
			waveColor: "#96999D", // matches --muted-foreground
			progressColor: "#4A8A9A", // matches --chart-1 (teal-cyan)
			cursorColor: "#4A8A9A",
			cursorWidth: 2,
			barWidth: 2,
			barGap: 2,
			barRadius: 2,
			barMinHeight: 4,
			height: "auto",
			normalize: true,
		});

		wavesurferRef.current = ws;

		ws.on("ready", () => {
			setIsReady(true);
			setDuration(ws.getDuration());

			// Catch NotAllowedError when browser blocks autoplay without user interaction
			if (autoplay) {
				ws.play().catch(() => {
					// empty
				});
			}
			onReady?.();
		});

		ws.on("play", () => setIsPlaying(true));
		ws.on("pause", () => setIsPlaying(false));
		ws.on("finish", () => setIsPlaying(false));
		ws.on("timeupdate", (time) => setCurrentTime(time));

		ws.on("error", (error) => {
			if (destroyed) {
				return;
			}
			console.error("WaveSurfer error:", error);
			onError?.(new Error(String(error)));
		});

		ws.load(url).catch((error) => {
			if (destroyed) {
				return;
			}
			console.error("WaveSurfer load error:", error);
			onError?.(new Error(String(error)));
		});

		return () => {
			destroyed = true;
			ws.destroy();
		};
		// biome-ignore lint/correctness/useExhaustiveDependencies: isMobile triggers wavesurfer recreation for responsive behavior
	}, [url, autoplay, onReady, onError, isMobile]);

	const togglePlayPause = useCallback(() => {
		wavesurferRef.current?.playPause();
	}, []);

	const seekForward = useCallback((seconds = 5) => {
		const ws = wavesurferRef.current;
		if (!ws) {
			return;
		}

		const newTime = Math.min(ws.getCurrentTime() + seconds, ws.getDuration());
		ws.seekTo(newTime / ws.getDuration());
	}, []);

	const seekBackward = useCallback((seconds = 5) => {
		const ws = wavesurferRef.current;
		if (!ws) {
			return;
		}

		const newTime = Math.max(ws.getCurrentTime() - seconds, 0);
		ws.seekTo(newTime / ws.getDuration());
	}, []);

	return {
		containerRef,
		isPlaying,
		isReady,
		currentTime,
		duration,
		togglePlayPause,
		seekForward,
		seekBackward,
	};
}
