import { protectedProcedure, publicProcedure, router } from "../index";
import { billingRouter } from "./billing";
import { generationsRouter } from "./generations";
import { todoRouter } from "./todo";
import { voicesRouter } from "./voices";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),
	todo: todoRouter,
	voices: voicesRouter,
	generations: generationsRouter,
	billing: billingRouter,
});
export type AppRouter = typeof appRouter;
