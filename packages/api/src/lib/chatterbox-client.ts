import { env } from "@sonvox/env/server";
import createClient from "openapi-fetch";

import type { paths } from "../types/chatterbox";

export const chatterbox = createClient<paths>({
	baseUrl: env.CHATTERBOX_API_URL,
	headers: {
		"x-api-key": env.CHATTERBOX_API_KEY,
	},
});
