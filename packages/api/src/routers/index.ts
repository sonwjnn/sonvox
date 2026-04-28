import { router } from "../index";
import { billingRouter } from "./billing";
import { generationsRouter } from "./generations";
import { voicesRouter } from "./voices";

export const appRouter = router({
	voices: voicesRouter,
	generations: generationsRouter,
	billing: billingRouter,
});
export type AppRouter = typeof appRouter;
