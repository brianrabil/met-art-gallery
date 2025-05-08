import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin } from "@orpc/server/plugins";
import { router } from "@repo/api/router";

const handler = new RPCHandler(router, {
	plugins: [
		new CORSPlugin({
			origin: (origin, options) => origin,
			allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

export async function createNextRPCHandler() {
	async function handleRequest(request: Request) {
		const { response } = await handler.handle(request, {
			prefix: "/rpc",
			context: {
				headers: request.headers,
			},
		});

		return response ?? new Response("Not found", { status: 404 });
	}

	return {
		GET: handleRequest,
		POST: handleRequest,
		PUT: handleRequest,
		PATCH: handleRequest,
		DELETE: handleRequest,
	};
}
