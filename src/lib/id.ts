import { createServerOnlyFn } from "@tanstack/react-start";

export const generateId = createServerOnlyFn(() => crypto.randomUUID());
