import { createFileRoute, redirect } from "@tanstack/react-router";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/(org-setup)")({
	beforeLoad: async () => {
		const session = await getUser();
		return { session };
	},
	loader: ({ context }) => {
		if (!context.session) {
			throw redirect({ to: "/sign-in" });
		}

		if (context.session.session.activeOrganizationId) {
			throw redirect({ to: "/" });
		}
	},
});
