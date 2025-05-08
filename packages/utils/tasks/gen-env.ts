import path from "node:path";
import dotenvx from "@dotenvx/dotenvx";
import {
	APPS_DIR,
	MONOREPO_ROOT_DIR,
	PACKAGES_DIR,
	WEB_DIR,
} from "@repo/utils/constants";
import { $, Glob } from "bun";

export async function pullEnv() {
	try {
		await $`bunx vercel env pull --cwd ${WEB_DIR}`;
	} catch (error) {
		console.error(
			`❌ An error occurred while pulling environment variables: ${error}`,
		);
		console.warn("We will try to continue anyways...");
	}

	const envs = dotenvx.ls(WEB_DIR, ".env*", "");
	const glob = new Glob("**/package.json");

	let counter = 0;
	for await (const match of glob.scan({
		absolute: true,
		cwd: path.relative(".", MONOREPO_ROOT_DIR),
	})) {
		if (match.includes("node_modules")) continue;
		if (match.startsWith(APPS_DIR) || match.startsWith(PACKAGES_DIR)) {
			const dist = path.dirname(match);
			for (const env of envs) {
				try {
					await $`cp ${path.join(WEB_DIR, env)} ${path.join(dist, env)}`;
					console.log(`Copied ${env} to ${dist}`);
					counter++;
				} catch (error) {
					// throw new Error(`An error occurred while copying ${env} to ${dist}`);
					console.warn(error);
				}
			}
		}
	}
	console.log(`✅ Done! Copied ${counter} environment variables`);
}

pullEnv();
