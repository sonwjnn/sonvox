import type { VoiceCategory } from "../../prisma/generated/client";

export const CANONICAL_SYSTEM_VOICE_NAMES = [
	"Aaron",
	"Abigail",
	"Anaya",
	"Andy",
	"Archer",
	"Brian",
	"Chloe",
	"Dylan",
	"Emmanuel",
	"Ethan",
	"Evelyn",
	"Gavin",
	"Gordon",
	"Ivan",
	"Laura",
	"Lucy",
	"Madison",
	"Marisol",
	"Meera",
	"Walter",
] as const;

export type SystemVoiceName = (typeof CANONICAL_SYSTEM_VOICE_NAMES)[number];

export type VoiceMetadata = {
	category: VoiceCategory;
	description: string;
	language: string;
};

export const systemVoiceMetadata: Record<SystemVoiceName, VoiceMetadata> = {
	Aaron: {
		description: "Soothing and calm, like a self-help audiobook narrator",
		category: "AUDIOBOOK",
		language: "en-US",
	},
	Abigail: {
		description: "Friendly and conversational with a warm, approachable tone",
		category: "CONVERSATIONAL",
		language: "en-GB",
	},
	Anaya: {
		description: "Polite and professional, suited for customer service",
		category: "CUSTOMER_SERVICE",
		language: "en-IN",
	},
	Andy: {
		description: "Versatile and clear, a reliable all-purpose narrator",
		category: "GENERAL",
		language: "en-US",
	},
	Archer: {
		description: "Laid-back and reflective with a steady, storytelling pace",
		category: "NARRATIVE",
		language: "en-US",
	},
	Brian: {
		description: "Professional and helpful with a clear customer support tone",
		category: "CUSTOMER_SERVICE",
		language: "en-US",
	},
	Chloe: {
		description: "Bright and bubbly with a cheerful, outgoing personality",
		category: "CORPORATE",
		language: "en-AU",
	},
	Dylan: {
		description:
			"Thoughtful and intimate, like a quiet late-night conversation",
		category: "GENERAL",
		language: "en-US",
	},
	Emmanuel: {
		description: "Nasally and distinctive with a quirky, cartoon-like quality",
		category: "CHARACTERS",
		language: "en-US",
	},
	Ethan: {
		description: "Polished and warm with crisp, studio-quality delivery",
		category: "VOICEOVER",
		language: "en-US",
	},
	Evelyn: {
		description: "Warm Southern charm with a heartfelt, down-to-earth feel",
		category: "CONVERSATIONAL",
		language: "en-US",
	},
	Gavin: {
		description: "Calm and reassuring with a smooth, natural flow",
		category: "MEDITATION",
		language: "en-US",
	},
	Gordon: {
		description: "Warm and encouraging with an uplifting, motivational tone",
		category: "MOTIVATIONAL",
		language: "en-US",
	},
	Ivan: {
		description: "Deep and cinematic with a dramatic, movie-character presence",
		category: "CHARACTERS",
		language: "ru-RU",
	},
	Laura: {
		description: "Authentic and warm with a conversational Midwestern tone",
		category: "CONVERSATIONAL",
		language: "en-US",
	},
	Lucy: {
		description: "Direct and composed with a professional phone manner",
		category: "CUSTOMER_SERVICE",
		language: "en-US",
	},
	Madison: {
		description: "Energetic and unfiltered with a casual, chatty vibe",
		category: "PODCAST",
		language: "en-US",
	},
	Marisol: {
		description: "Confident and polished with a persuasive, ad-ready delivery",
		category: "ADVERTISING",
		language: "en-US",
	},
	Meera: {
		description: "Friendly and helpful with a clear, service-oriented tone",
		category: "CUSTOMER_SERVICE",
		language: "en-IN",
	},
	Walter: {
		description: "Old and raspy with deep gravitas, like a wise grandfather",
		category: "NARRATIVE",
		language: "en-US",
	},
};
