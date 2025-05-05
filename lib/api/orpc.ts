import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { os, ORPCError } from "@orpc/server";
import { headers } from "next/headers";

const base = os.$context();

export const publicRoute = base.use(async ({ context, next }) => {
	return await next({
		context: db,
	});
});

export const protectedRoute = base.use(async ({ context, next }) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		throw new ORPCError("UNAUTHORIZED");
	}

	return await next({
		context: {
			user: session.user,
		},
	});
});

export const adminRoute = protectedRoute.use(async ({ context, next }) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		throw new ORPCError("UNAUTHORIZED");
	}

	if (session.user.role !== "admin") {
		throw new ORPCError("FORBIDDEN");
	}

	return await next({
		context: {
			user: session.user,
		},
	});
});
