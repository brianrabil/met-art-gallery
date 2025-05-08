// import dotenvx from "@dotenvx/dotenvx";
import { db } from "@repo/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

// dotenvx.config({ convention: "nextjs" });

if (!process.env.GITHUB_CLIENT_ID) {
	throw new Error("GITHUB_CLIENT_ID is not defined");
}

if (!process.env.GITHUB_CLIENT_SECRET) {
	throw new Error("GITHUB_CLIENT_SECRET is not defined");
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
		usePlural: true,
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
	plugins: [admin()],
});
