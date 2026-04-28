/** biome-ignore-all lint/style/noNonNullAssertion: <> */
import alchemy from "alchemy";
import { TanStackStart } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });

const app = await alchemy("sonvox ");

export const web = await TanStackStart("web", {
	cwd: "../../apps/web",
	bindings: {
		DATABASE_URL: alchemy.secret.env.DATABASE_URL!,
		CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
		BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
		APP_URL: alchemy.env.APP_URL!,
		POLAR_ACCESS_TOKEN: alchemy.secret.env.POLAR_ACCESS_TOKEN!,
		POLAR_SUCCESS_URL: alchemy.env.POLAR_SUCCESS_URL!,
		POLAR_PRODUCT_ID: alchemy.env.POLAR_PRODUCT_ID!,
		// POLAR_METER_TTS_GENERATION: alchemy.env.POLAR_METER_TTS_GENERATION!,
		// POLAR_METER_TTS_PROPERTY: alchemy.env.POLAR_METER_TTS_PROPERTY!,
		// R2 Storage
		R2_ACCOUNT_ID: alchemy.secret.env.R2_ACCOUNT_ID!,
		R2_ACCESS_KEY_ID: alchemy.secret.env.R2_ACCESS_KEY_ID!,
		R2_SECRET_ACCESS_KEY: alchemy.secret.env.R2_SECRET_ACCESS_KEY!,
		R2_BUCKET_NAME: alchemy.env.R2_BUCKET_NAME!,
		// Chatterbox TTS
		CHATTERBOX_API_URL: alchemy.env.CHATTERBOX_API_URL!,
		CHATTERBOX_API_KEY: alchemy.secret.env.CHATTERBOX_API_KEY!,
	},
});

console.log(`Web    -> ${web.url}`);

await app.finalize();
