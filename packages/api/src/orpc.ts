import { os } from "@orpc/server";
import { ORPCError } from "@orpc/server";
import { auth } from "@repo/auth/auth";
import { db } from "@repo/db";

export const base = os.$context<{ headers: Headers }>();

export const withDatabase = base.middleware(async ({ next }) => {
	return await next({
		context: {
			db,
		},
	});
});

export const withAuth = base
	.$context<{ db: typeof db; headers: Headers }>()
	.middleware(async ({ context, next }) => {
		const session = await auth.api.getSession({
			headers: context.headers,
		});
		if (session?.user?.id) {
			return await next({
				context: {
					user: session.user,
				},
			});
		}
		throw new ORPCError("UNAUTHORIZED");
	});

export const withAdmin = base
	.$context<{ db: typeof db; headers: Headers }>()
	.middleware(async ({ context, next }) => {
		const session = await auth.api.getSession({
			headers: context.headers,
		});
		if (session?.user?.role === "admin") {
			return await next({
				context: {
					user: session?.user,
				},
			});
		}
		throw new ORPCError("FORBIDDEN");
	});
