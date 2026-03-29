import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@sonvox/ui/components/avatar";
import { cn } from "@sonvox/ui/lib/utils";
import { useVoiceAvatar } from "./use-voice-avatar";

type VoiceAvatarProps = {
	className?: string;
	name: string;
	seed: string;
};

export function VoiceAvatar({ seed, name, className }: VoiceAvatarProps) {
	const avatarUrl = useVoiceAvatar(seed);

	return (
		<Avatar className={cn("size-4 border-white shadow-xs", className)}>
			<AvatarImage alt={name} src={avatarUrl} />
			<AvatarFallback className="text-[8px]">
				{name.slice(0, 2).toUpperCase()}
			</AvatarFallback>
		</Avatar>
	);
}
