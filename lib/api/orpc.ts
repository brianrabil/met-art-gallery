import { getSessionAction } from "@/lib/actions";
import { db } from "@/lib/db";
import { os, ORPCError } from "@orpc/server";

const base = os.$context();

export const publicRoute = base.use(async ({ next }) => {
	return await next({
		context: {
			db,
		},
	});
});

export const protectedRoute = publicRoute.use(async ({ context, next }) => {
	const session = await getSessionAction();
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

export const adminRoute = protectedRoute.use(async ({ context, next }) => {
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
