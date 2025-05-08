declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly GITHUB_CLIENT_ID: string | undefined;
			readonly GITHUB_CLIENT_SECRET: string | undefined;
			readonly BETTER_AUTH_SECRET: string | undefined;
			readonly BETTER_AUTH_URL: string | undefined;
			readonly ENCRYPTION_KEY: string | undefined;
			readonly TURSO_AUTH_TOKEN: string | undefined;
			readonly TURSO_DATABASE_URL: string | undefined;
			readonly TURSO_SYNC_URL: string | undefined;
			readonly VERCEL_OIDC_TOKEN: string | undefined;
		}
	}
}

export {};
