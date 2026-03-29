import type { AppRouter } from "@sonvox/api/routers/index";
import type { inferRouterOutputs } from "@trpc/server";
import { createContext, useContext } from "react";

type TTSVoiceItem =
	inferRouterOutputs<AppRouter>["voices"]["getAll"]["custom"][number];

type TTSVoicesContextValue = {
	allVoices: TTSVoiceItem[];
	customVoices: TTSVoiceItem[];
	systemVoices: TTSVoiceItem[];
};

const TTSVoicesContext = createContext<TTSVoicesContextValue | null>(null);

export function TTSVoicesProvider({
	children,
	value,
}: {
	children: React.ReactNode;
	value: TTSVoicesContextValue;
}) {
	return (
		<TTSVoicesContext.Provider value={value}>
			{children}
		</TTSVoicesContext.Provider>
	);
}

export function useTTSVoices() {
	const context = useContext(TTSVoicesContext);

	if (!context) {
		throw new Error("useTTSVoices must be used within a TTSVoicesProvider");
	}

	return context;
}
