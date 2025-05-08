import { admin, authed, base } from "@repo/api/orpc";
import { z } from "zod";

export const getAuthedUser = authed.handler(async ({ context }) => {
	const user = await context.db.query.users.findFirst({
		where: (user, { eq }) => eq(user.id, context.user.id),
	});
	return user;
});

export const hasAdmin = base
	.output(z.boolean())
	.handler(async ({ context }) => {
		const admin = await context.db.query.users.findFirst({
			columns: { id: true },
			where: (user, { eq }) => eq(user.role, "admin"),
		});
		return !!admin;
	});

export const list = admin.handler(async ({ context }) => {
	const users = await context.db.query.users.findMany();
	return users;
});

export const getById = admin
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
