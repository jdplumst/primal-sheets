import type { ContentfulStatusCode } from "hono/utils/http-status";

export const okResult = <T>(data: T, code: ContentfulStatusCode = 200) => ({
	ok: true as const,
	data,
	code,
});

export const errResult = (error: string, code: ContentfulStatusCode) => ({
	ok: false as const,
	error,
	code,
});
