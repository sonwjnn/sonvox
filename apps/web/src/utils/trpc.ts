import type { AppRouter } from "@sonvox/api/routers/index";
import { createIsomorphicFn } from "@tanstack/react-start";
import { createTRPCContext } from "@trpc/tanstack-react-query";

export const { TRPCProvider, useTRPC, useTRPCClient } =
	createTRPCContext<AppRouter>();

export const getHeaders = createIsomorphicFn()
	.server(async () => {
		const { getRequestHeaders } = await import("@tanstack/react-start/server");
		const headers = await getRequestHeaders();
		return Object.fromEntries(headers);
	})
	.client(() => {
		// On the client, no extra headers needed — cookies are sent automatically
		return {};
	});
