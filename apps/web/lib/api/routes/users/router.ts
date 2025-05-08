import { adminRoute, protectedRoute, publicRoute } from "@/lib/api/orpc";
import { $fetch } from "@/lib/api/routes/met/fetch";
import {
	objectSchema,
	paginationSchema,
	sortSchema,
} from "@/lib/api/routes/met/schema";
import * as schema from "@/lib/db/schema";
import { ORPCError } from "@orpc/client";
import { AsyncQueuer } from "@tanstack/pacer";
import { z } from "zod";

const getAuthedUser = protectedRoute.handler(async ({ context }) => {
	const user = await context.db.query.users.findFirst({
		where: (user, { eq }) => eq(user.id, context.user.id),
	});
	return user;
});

const hasAdmin = publicRoute
	.output(z.boolean())
	.handler(async ({ context }) => {
		const admin = await context.db.query.users.findFirst({
			columns: { id: true },
			where: (user, { eq }) => eq(user.role, "admin"),
		});
		return !!admin;
	});

const list = adminRoute
	.handler(async ({ context }) => {
		const users = await context.db.query.users.findMany();
		return users;
	})
	.callable();

const getById = adminRoute
	.input(
		z.object({
			userId: z.string(),
		}),
	)
	.handler(async ({ context, input }) => {
		const user = await context.db.query.users.findFirst({
			where: (user, { eq }) => eq(user.id, input.userId),
		});
		return user;
	});

export const usersRouter = {
	getAuthedUser,
	hasAdmin,
	list,
	getById,
};
