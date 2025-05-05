import { metRouter } from "@/lib/api/routes/met/router";
import type {
	InferRouterInitialContexts,
	InferRouterInputs,
	InferRouterOutputs,
} from "@orpc/server";

export const router = {
	met: metRouter,
};

export type InitialContexts = InferRouterInitialContexts<typeof router>;
export type Inputs = InferRouterInputs<typeof router>;
export type Outputs = InferRouterOutputs<typeof router>;
