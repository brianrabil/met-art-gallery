import { createRouterClient } from "@orpc/server";
import { router } from "@repo/api/router";

export const client = createRouterClient(router, {
	context: {}, // Provide initial context if needed
});
