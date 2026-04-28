import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "@sonvox/db";
import { env } from "@sonvox/env/server";
import { createFileRoute } from "@tanstack/react-router";

const r2 = new S3Client({
	region: "auto",
	endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: env.R2_ACCESS_KEY_ID,
		secretAccessKey: env.R2_SECRET_ACCESS_KEY,
	},
});

export const Route = createFileRoute("/api/voices/$")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				const voiceId = params._splat;

				if (!voiceId) {
					return new Response("Voice ID required", { status: 400 });
				}

				const voice = await prisma.voice.findUnique({
					where: { id: voiceId },
				});

				if (!voice?.r2ObjectKey) {
					return new Response("Voice audio not found", { status: 404 });
				}

				try {
					const command = new GetObjectCommand({
						Bucket: env.R2_BUCKET_NAME,
						Key: voice.r2ObjectKey,
					});

					const signedUrl = await getSignedUrl(r2, command, {
						expiresIn: 3600,
					});

					const audioResponse = await fetch(signedUrl);

					if (!audioResponse.ok) {
						return new Response("Failed to fetch audio", {
							status: audioResponse.status,
						});
					}

					const audioBuffer = await audioResponse.arrayBuffer();

					return new Response(audioBuffer, {
						headers: {
							"Content-Type": "audio/wav",
							"Content-Length": String(audioBuffer.byteLength),
							"Cache-Control": "public, max-age=86400",
						},
					});
				} catch (error) {
					console.error("Failed to get voice audio:", error);
					return new Response("Failed to fetch audio", { status: 500 });
				}
			},
		},
	},
});
