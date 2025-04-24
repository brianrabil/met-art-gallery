import "dotenv/config";
import * as schema from "@/lib/db/schema";
import { drizzle } from "drizzle-orm/libsql";

if (!process.env.DB_FILE_NAME) {
	throw new Error("DB_FILE_NAME environment variable is not set");
}

export const db = drizzle(process.env.DB_FILE_NAME, {
	schema,
	casing: "snake_case",
});
