import type { ObjectSchemaType } from "@/lib/api/routes/met/schema";
import { AsyncQueuer } from "@tanstack/pacer";

export const queue = new AsyncQueuer({
	concurrency: 3, // Process 2 items at once
	started: true, // Start processing immediately
});
