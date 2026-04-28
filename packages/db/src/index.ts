import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "@sonvox/env/server";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
	accelerateUrl: env.DATABASE_URL,
}).$extends(withAccelerate());

export default prisma;

// Re-export enums and types for use in other packages
// biome-ignore lint/performance/noBarrelFile: <>
export * from "../prisma/generated/enums";
