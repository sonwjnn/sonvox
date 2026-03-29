import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { VoicesList } from "@/features/voices/components/voices-list";
import { VoicesToolbar } from "@/features/voices/components/voices-toolbar";
import { voicesSearchParams } from "@/features/voices/lib/params";
import { useTRPC } from "@/utils/trpc";

function VoicesContent() {
	const trpc = useTRPC();
	const [query] = useQueryState("query", voicesSearchParams.query);
	const { data } = useSuspenseQuery(trpc.voices.getAll.queryOptions({ query }));

	return (
		<>
			<VoicesList title="Team Voices" voices={data.custom} />
			<VoicesList title="Built-in Voices" voices={data.system} />
		</>
	);
}

export function VoicesView() {
	return (
		<div className="flex-1 space-y-10 overflow-y-auto p-3 lg:p-6">
			<VoicesToolbar />
			<VoicesContent />
		</div>
	);
}
