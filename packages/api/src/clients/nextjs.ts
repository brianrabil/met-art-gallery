import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCReactQueryUtils } from "@orpc/react-query";
import type { RouterClient } from "@orpc/server";
import type { router } from "@repo/api/app";

const link = new RPCLink({
	url: (url) => {
		if (typeof window === "undefined") {
			throw new Error("RPCLink is not allowed on the server side.");
		}

		return new URL("/rpc", window.location.href);
	},
});

export const client: RouterClient<typeof router> = createORPCClient(link);
export const orpc = createORPCReactQueryUtils(client);
