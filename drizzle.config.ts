import { config } from "@dotenvx/dotenvx";
import type { Config } from "drizzle-kit";

config({
	convention: "nextjs",
});

if (!process.env.TURSO_DATABASE_URL) {
	throw new Error(
		"TURSO_DATABASE_URL is set. Please unset TURSO_DATABASE_URL and use the correct configuration method.O",
	);
}

if (!process.env.TURSO_AUTH_TOKEN) {
	throw new Error(
		"TURSO_AUTH_TOKEN is set. Please unset TURSO_AUTH_TOKEN and use the correct configuration method.",
	);
}

export default {
	schema: ["./lib/db/auth-schema.ts", "./lib/db/schema.ts"],
	out: "./drizzle",
	dialect: "turso",
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL,
		authToken: process.env.TURSO_AUTH_TOKEN,
	},
} satisfies Config;
