import { createNextRPCHandler } from "@repo/api/adapters/next";

export const { DELETE, GET, PATCH, POST, PUT } = await createNextRPCHandler();
