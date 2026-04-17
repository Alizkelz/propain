import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge, twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
