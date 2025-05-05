import "server-only";
import { db } from "@/lib/db/index";
import * as schema from "@/lib/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
		usePlural: true,
		schema,
	}),
});
