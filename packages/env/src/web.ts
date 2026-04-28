import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_SENTRY_DSN: z.string().optional(),
	},
	// biome-ignore lint/suspicious/noExplicitAny: <>
	runtimeEnv: (import.meta as any).env,
	emptyStringAsUndefined: true,
});
