import dotenvx from "@dotenvx/dotenvx";
import type { Config } from "drizzle-kit";

dotenvx.config({ convention: "nextjs" });

if (!process.env.TURSO_DATABASE_URL) {
	throw new Error("Missing TURSO_DATABASE_URL");
}

if (!process.env.TURSO_AUTH_TOKEN) {
	throw new Error("Missing TURSO_AUTH_TOKEN");
}

export default {
	schema: "./src/schemas/index.ts",
	out: "./drizzle",
	dialect: "turso",
	casing: "snake_case",
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL,
		authToken: process.env.TURSO_AUTH_TOKEN,
	},
} satisfies Config;
