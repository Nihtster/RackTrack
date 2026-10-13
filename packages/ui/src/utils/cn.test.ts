import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('lets a later utility override an earlier one', () => {
    expect(cn('px-2 text-ink', 'px-4')).toBe('text-ink px-4')
  })

  it('keeps the color beside our custom font sizes', () => {
    // Unknown to tailwind-merge, text-caption would be taken for a color and
    // would remove text-ink-muted.
    expect(cn('text-ink-muted', 'text-caption')).toBe('text-ink-muted text-caption')
    expect(cn('text-ink-muted', 'text-micro')).toBe('text-ink-muted text-micro')
  })

  it('still replaces one font size with another', () => {
    expect(cn('text-caption', 'text-sm')).toBe('text-sm')
    expect(cn('text-sm', 'text-micro')).toBe('text-micro')
  })
})
