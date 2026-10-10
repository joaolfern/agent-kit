import { z } from 'zod'

export const LIST_LIMITS = { default: 24, max: 48 } as const

export const ListQuery = z.object({
  cursor: z.string().optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(LIST_LIMITS.max)
    .default(LIST_LIMITS.default),
})
export type ListQuery = z.input<typeof ListQuery>

export function pageOf<T extends z.ZodType>(item: T) {
  return z.object({
    items: z.array(item),
    nextCursor: z.string().nullable(),
    total: z.number().int().nonnegative(),
  })
}

export type Page<T> = {
  items: T[]
  nextCursor: string | null
  total: number
}
