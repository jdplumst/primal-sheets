import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Home } from "@/features/auth/pages/home";

const searchSchema = z.object({
	error: z.string().optional(),
	error_description: z.string().optional(),
});

export const Route = createFileRoute("/")({
	component: Home,
	ssr: true,
	validateSearch: searchSchema,
});
