import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Join class names, with later Tailwind utilities overriding earlier ones.
// Lets components set defaults that consumers can override via `className`.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
