import {
	type InferRouterInitialContext,
	createRouterClient as _createRouterClient,
} from "@orpc/server";
import { router } from "@repo/api/app";

// export const client = createRouterClient(router, {
// 	context: {}, // Provide initial context if needed
// });

export const createRouterClient = (
	context: InferRouterInitialContext<typeof router>,
) => {
	return _createRouterClient(router, {
		context,
	});
};
