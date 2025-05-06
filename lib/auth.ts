import * as authSchema from "@/lib/db/auth-schema";
import { db } from "@/lib/db/index";
import * as appSchema from "@/lib/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

if (!process.env.GITHUB_CLIENT_ID) {
	throw new Error("Missing GITHUB_CLIENT_ID");
}

if (!process.env.GITHUB_CLIENT_SECRET) {
	throw new Error("Missing GITHUB_CLIENT_SECRET");
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
		usePlural: true,
		schema: {
			...authSchema,
			...appSchema,
		},
	}),
	emailAndPassword: {
		enabled: false,
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		},
	},
	plugins: [
		admin({
			// adminUserIds: [1],
		}),
	],
});
