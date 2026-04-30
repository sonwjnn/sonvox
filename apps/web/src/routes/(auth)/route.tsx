import { createFileRoute, redirect } from "@tanstack/react-router";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/(auth)")({
	beforeLoad: async () => {
		const session = await getUser();
		return { session };
	},
	loader: async ({ context }) => {
		if (context.session && !context.session.session.activeOrganizationId) {
			throw await redirect({
				to: "/org-selection",
			});
		}

		if (context.session) {
			throw await redirect({
				to: "/",
			});
		}
	},
});
