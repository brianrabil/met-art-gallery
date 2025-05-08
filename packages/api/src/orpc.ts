import { os } from "@orpc/server";
import { ORPCError } from "@orpc/server";
import { auth } from "@repo/auth/auth";
import { db } from "@repo/db";

export const base = os.$context().use(async ({ next }) => {
	return await next({
		context: {
			db,
		},
	});
});

export const authed = base.use(async ({ context, next }) => {
	const session = await auth.api.getSession({
		headers: context.headers,
	});
	if (session?.user?.id) {
		return await next({
			context: {
				db: context.db,
				user: session.user,
			},
		});
	}
	throw new ORPCError("UNAUTHORIZED");
});

export const admin = authed.use(async ({ context, next }) => {
	if (context.user.role === "admin") {
		return await next({
			context: {
				db: context.db,
				user: context.user,
			},
		});
	}
	throw new ORPCError("FORBIDDEN");
});
