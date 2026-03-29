import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@sonvox/env/server";

import { PrismaClient } from "../prisma/generated/client";

const adapter = new PrismaPg({
	connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export default prisma;

// Re-export enums and types for use in other packages
// biome-ignore lint/performance/noBarrelFile: <>
export * from "../prisma/generated/enums";
