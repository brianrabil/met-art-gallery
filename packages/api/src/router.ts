import type {
	InferRouterInitialContexts,
	InferRouterInputs,
	InferRouterOutputs,
} from "@orpc/server";
import { metRouter } from "./routes/met";
import { usersRouter } from "./routes/users";

export const router = {
	met: metRouter,
	users: usersRouter,
};

export type InitialContexts = InferRouterInitialContexts<typeof router>;
export type Inputs = InferRouterInputs<typeof router>;
export type Outputs = InferRouterOutputs<typeof router>;
