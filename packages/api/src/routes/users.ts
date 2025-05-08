import { base, withAdmin, withAuth, withDatabase } from "@repo/api/orpc";
import { z } from "zod";

export const getAuthedUser = base
	.use(withDatabase)
	.use(withAuth)
	.handler(async ({ context }) => {
		const user = await context.db.query.users.findFirst({
			where: (user, { eq }) => eq(user.id, context.user.id),
		});
		return user;
	});

export const hasAdmin = base
	.use(withDatabase)
	.output(z.boolean())
	.handler(async ({ context }) => {
		const admin = await context.db.query.users.findFirst({
			columns: { id: true },
			where: (user, { eq }) => eq(user.role, "admin"),
		});
		return !!admin;
	});

export const list = base
	.use(withDatabase)
	.use(withAdmin)
	.handler(async ({ context }) => {
		const users = await context.db.query.users.findMany();
		return users;
	});

export const getById = base
	.use(withDatabase)
	.use(withAdmin)
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
