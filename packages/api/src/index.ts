import { initTRPC, TRPCError } from "@trpc/server";

import type { Context } from "./context";

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Authentication required",
			cause: "No session",
		});
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
		},
	});
});

export const orgProcedure = protectedProcedure.use(({ ctx, next }) => {
	const orgId = ctx.session.session.activeOrganizationId;

	console.log("session:", JSON.stringify(ctx.session, null, 2)); // ← debug

	if (!orgId) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Organization required",
		});
	}

	return next({
		ctx: {
			...ctx,
			orgId,
		},
	});
});
