import type { router } from "@/lib/api/router";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCReactQueryUtils } from "@orpc/react-query";
import type { RouterClient } from "@orpc/server";

function getUrl() {
	const base = (() => {
		if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
		return "http://localhost:3000";
	})();
	return `${base}/rpc`;
}

const link = new RPCLink({
	url: getUrl(),
});

// Create a client for your router
export const client: RouterClient<typeof router> = createORPCClient(link);

export const orpc = createORPCReactQueryUtils(client);
