import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Used for our errors, if error we did not explicitly throw using
// this is thrown, then we show generic error message
export class AppError extends Error {}
