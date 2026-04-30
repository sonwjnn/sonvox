import type { AppRouter } from "@sonvox/api/routers/index";
import { Toaster } from "@sonvox/ui/components/sonner";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { DefaultCatchBoundaryView } from "@/features/errors/ui/views/default-catch-boundary-view";
import { NotFoundErrorView } from "@/features/errors/ui/views/not-found-error-view";

import appCss from "../index.css?url";
export type RouterAppContext = {
	queryClient: QueryClient;
	trpc: TRPCOptionsProxy<AppRouter>;
};

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Sonvox",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	notFoundComponent: NotFoundErrorView,
	errorComponent: DefaultCatchBoundaryView,
	component: RootDocument,
});

function RootDocument() {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<NuqsAdapter>
					<Outlet />
				</NuqsAdapter>
				<Toaster richColors />
				<TanStackRouterDevtools position="bottom-left" />
				<ReactQueryDevtools buttonPosition="bottom-right" position="bottom" />
				<Scripts />
			</body>
		</html>
	);
}
