import { Polar } from "@polar-sh/sdk";
// import { env } from "@sonvox/env/server";

export const polarClient = new Polar({
	// accessToken: env.POLAR_ACCESS_TOKEN,
	accessToken: "polar_oat_PFs3qSxEGY2i3gFIKShYV59dpHtCtOLdez9wj3U7kka",
	server: "sandbox",
});
