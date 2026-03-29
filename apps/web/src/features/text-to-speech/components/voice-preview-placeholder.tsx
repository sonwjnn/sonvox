import { Button } from "@sonvox/ui/components/button";
import { AudioLines, BookOpen, Sparkles, Volume2 } from "lucide-react";

export function VoicePreviewPlaceholder() {
	return (
		<div className="hidden h-full flex-1 flex-col items-center justify-center gap-6 border-t lg:flex">
			<div className="flex flex-col items-center gap-3">
				<div className="relative flex h-14 w-32 items-center justify-center">
					<div className="absolute left-0 -rotate-30 rounded-full bg-muted p-4">
						<Volume2 className="size-5 text-muted-foreground" />
					</div>

					<div className="relative z-10 rounded-full bg-foreground p-4">
						<Sparkles className="size-5 text-background" />
					</div>

					<div className="absolute right-0 -rotate-30 rounded-full bg-muted p-4">
						<AudioLines className="size-5 text-muted-foreground" />
					</div>
				</div>

				<p className="font-semibold text-foreground text-lg tracking-tight">
					Preview will appear here
				</p>
				<p className="max-w-64 text-center text-muted-foreground text-sm">
					Once you generate, your audio result will appear here. Sit back and
					relax.
				</p>
			</div>
			<Button asChild size="sm" variant="outline">
				<a href="mailto:business@codewithantonio.com">
					<BookOpen />
					Don&apos;t know how?
				</a>
			</Button>
		</div>
	);
}
