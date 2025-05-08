import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/auth-schema";

const newUser = await auth.api.createUser({
	body: {
		name: "Test User",
		email: "test@example.com",
		password: "password123",
		role: "user", // this can also be an array for multiple roles (e.g. ["user", "sale"])
	},
});
