import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge only knows Tailwind's built-in font sizes. Our extra ones
// (`--text-*` in theme.css) have to be declared, or it reads `text-caption` as a
// text *color* and drops the real color class beside it.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['micro', 'caption'] }],
    },
  },
})

// Join class names, with later Tailwind utilities overriding earlier ones.
// Lets components set defaults that consumers can override via `className`.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
