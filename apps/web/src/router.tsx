// biome-ignore lint/performance/noNamespaceImport: <>
import * as Sentry from "@sentry/tanstackstart-react";
import type { AppRouter } from "@sonvox/api/routers/index";
import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";

import "./index.css";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { toast } from "sonner";
import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";
import { getHeaders, TRPCProvider } from "./utils/trpc";

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			Sentry.withScope((scope) => {
				scope.setFingerprint([query.queryHash.replace(/\d+/g, "")]);
				scope.setExtra("queryKey", query.queryKey);
				scope.setTag("queryType", "query");
				Sentry.captureException(error);
			});
			toast.error(error.message, {
				action: {
					label: "retry",
					onClick: query.invalidate,
				},
			});
		},
	}),
	mutationCache: new MutationCache({
		onError: (error, _variables, _context, mutation) => {
			Sentry.withScope((scope) => {
				scope.setFingerprint([String(mutation.options.mutationKey)]);
				scope.setExtra("variables", mutation.state.variables);
				scope.setTag("queryType", "mutation");
				Sentry.captureException(error);
			});
		},
	}),
	defaultOptions: { queries: { staleTime: 60 * 1000 } },
});

const trpcClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url:
				typeof window === "undefined"
					? `${process.env.APP_URL}/api/trpc`
					: "/api/trpc",

			async headers() {
				return await getHeaders();
			},
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
		}),
	],
});

const trpc = createTRPCOptionsProxy({
	client: trpcClient,
	queryClient,
});

export const getRouter = () => {
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		context: { trpc, queryClient },
		defaultPendingComponent: () => <Loader />,
		defaultNotFoundComponent: () => <div>Not Found</div>,
		Wrap: ({ children }) => (
			<QueryClientProvider client={queryClient}>
				<TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
					{children}
				</TRPCProvider>
			</QueryClientProvider>
		),
	});

	if (!router.isServer) {
		Sentry.init({
			dsn: import.meta.env.VITE_SENTRY_DSN,
			integrations: [
				Sentry.tanstackRouterBrowserTracingIntegration(router),
				Sentry.replayIntegration(),
			],
			tracesSampleRate: 1.0,
			replaysSessionSampleRate: 0.1,
			replaysOnErrorSampleRate: 1.0,
		});
	}

	return router;
};

declare module "@tanstack/react-router" {
	// biome-ignore lint/style/useConsistentTypeDefinitions: <>
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
