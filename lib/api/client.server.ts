import { router } from "@/lib/api/root";
import { createORPCReactQueryUtils } from "@orpc/react-query";
import { createRouterClient } from "@orpc/server";

export const client = createRouterClient(router, {
	context: {}, // Provide initial context if needed
});

export const orpc = createORPCReactQueryUtils(client);
