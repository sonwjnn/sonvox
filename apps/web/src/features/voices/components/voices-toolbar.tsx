import { Button } from "@sonvox/ui/components/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@sonvox/ui/components/input-group";
import { Search, Sparkles } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { voicesSearchParams } from "@/features/voices/lib/params";
import { VoiceCreateDialog } from "./voice-create-dialog";

export function VoicesToolbar() {
	const [query, setQuery] = useQueryState("query", voicesSearchParams.query);
	const [localQuery, setLocalQuery] = useState(query);

	const debouncedSetQuery = useDebouncedCallback(
		(value: string) => setQuery(value),
		300
	);

	return (
		<div className="space-y-4">
			<div>
				<h2 className="font-semibold text-xl tracking-tight lg:text-2xl">
					All Libraries
				</h2>
				<p className="text-muted-foreground text-sm">
					Discover your voices, or make your own
				</p>
			</div>

			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-3">
					<InputGroup className="lg:max-w-sm">
						<InputGroupAddon>
							<Search className="size-4" />
						</InputGroupAddon>
						<InputGroupInput
							onChange={(e) => {
								setLocalQuery(e.target.value);
								debouncedSetQuery(e.target.value);
							}}
							placeholder="Search voices..."
							value={localQuery}
						/>
					</InputGroup>
					<div className="ml-auto hidden lg:block">
						<VoiceCreateDialog>
							<Button size="sm">
								<Sparkles />
								Custom voice
							</Button>
						</VoiceCreateDialog>
					</div>
					<div className="lg:hidden">
						<VoiceCreateDialog>
							<Button className="w-full" size="sm">
								<Sparkles />
								Custom voice
							</Button>
						</VoiceCreateDialog>
					</div>
				</div>
			</div>
		</div>
	);
}
