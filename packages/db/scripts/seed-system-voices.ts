/**
 * Seeds system voices into the database and uploads audio files to R2.
 *
 * Usage:
 *   bun run seed:voices
 *
 * Required environment variables:
 *   DATABASE_URL, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

// Load env from apps/web/.env
const __scriptDir = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__scriptDir, "../../../apps/web/.env") });

import {
	PutObjectCommand,
	type PutObjectCommandInput,
	S3Client,
} from "@aws-sdk/client-s3";
import { PrismaPg } from "@prisma/adapter-pg";
import { z } from "zod";
import { PrismaClient } from "../prisma/generated/node/client";
import {
	CANONICAL_SYSTEM_VOICE_NAMES,
	systemVoiceMetadata,
} from "../src/data/voice-metadata";

const SYSTEM_VOICES_DIR = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"system-voices"
);

const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	R2_ACCOUNT_ID: z.string().min(1),
	R2_ACCESS_KEY_ID: z.string().min(1),
	R2_SECRET_ACCESS_KEY: z.string().min(1),
	R2_BUCKET_NAME: z.string().min(1),
});

const env = envSchema.parse(process.env);

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const r2 = new S3Client({
	region: "auto",
	endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: env.R2_ACCESS_KEY_ID,
		secretAccessKey: env.R2_SECRET_ACCESS_KEY,
	},
});

async function readSystemVoiceAudio(name: string) {
	const filePath = path.join(SYSTEM_VOICES_DIR, `${name}.wav`);
	const buffer = Buffer.from(await fs.readFile(filePath));
	return { buffer, contentType: "audio/wav" };
}

async function uploadSystemVoiceAudio({
	key,
	buffer,
	contentType,
}: {
	key: string;
	buffer: Buffer;
	contentType: string;
}) {
	const commandInput: PutObjectCommandInput = {
		Bucket: env.R2_BUCKET_NAME,
		Key: key,
		Body: buffer,
		ContentType: contentType,
	};

	await r2.send(new PutObjectCommand(commandInput));
}

async function seedSystemVoice(name: string) {
	const { buffer, contentType } = await readSystemVoiceAudio(name);

	const existingSystemVoice = await prisma.voice.findFirst({
		where: {
			variant: "SYSTEM",
			name,
		},
		select: { id: true },
	});

	const meta = systemVoiceMetadata[name as keyof typeof systemVoiceMetadata];

	if (existingSystemVoice) {
		const r2ObjectKey = `voices/system/${existingSystemVoice.id}`;

		await uploadSystemVoiceAudio({
			key: r2ObjectKey,
			buffer,
			contentType,
		});

		await prisma.voice.update({
			where: { id: existingSystemVoice.id },
			data: {
				r2ObjectKey,
				...(meta && {
					description: meta.description,
					category: meta.category,
					language: meta.language,
				}),
			},
		});
		return;
	}

	const voice = await prisma.voice.create({
		data: {
			name,
			variant: "SYSTEM",
			organizationId: null,
			...(meta && {
				description: meta.description,
				category: meta.category,
				language: meta.language,
			}),
		},
		select: {
			id: true,
		},
	});

	const r2ObjectKey = `voices/system/${voice.id}`;

	try {
		await uploadSystemVoiceAudio({
			key: r2ObjectKey,
			buffer,
			contentType,
		});

		await prisma.voice.update({
			where: {
				id: voice.id,
			},
			data: {
				r2ObjectKey,
			},
		});
	} catch (error) {
		await prisma.voice
			.delete({
				where: {
					id: voice.id,
				},
			})
			.catch(() => {
				// Ignore cleanup errors
			});

		throw error;
	}
}

async function main() {
	console.log(
		`Seeding ${CANONICAL_SYSTEM_VOICE_NAMES.length} system voices...`
	);

	for (const name of CANONICAL_SYSTEM_VOICE_NAMES) {
		console.log(`- ${name}`);
		await seedSystemVoice(name);
	}

	console.log("System voice seed completed.");
}

main()
	.catch((error) => {
		console.error("Failed to seed system voices:", error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
