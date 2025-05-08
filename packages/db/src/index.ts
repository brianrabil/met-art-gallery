import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schemas";

// dotenvx.config({ convention: "nextjs" });

if (!process.env.TURSO_DATABASE_URL) {
	throw new Error("Missing TURSO_DATABASE_URL");
}

if (!process.env.TURSO_AUTH_TOKEN) {
	throw new Error("Missing TURSO_AUTH_TOKEN");
}

if (!process.env.TURSO_SYNC_URL) {
	throw new Error("Missing TURSO_SYNC_URL");
}

const turso = createClient({
	url: process.env.TURSO_DATABASE_URL,
	authToken: process.env.TURSO_AUTH_TOKEN,
	// offline: true,
	// encryptionKey: env.ENCRYPTION_KEY,
	syncUrl: process.env.TURSO_SYNC_URL,
	syncInterval: 7 * 24 * 60 * 60, // 7 days in seconds
});

export const db = drizzle(turso, {
	casing: "snake_case",
	schema,
});
