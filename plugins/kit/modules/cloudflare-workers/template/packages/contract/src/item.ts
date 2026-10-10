import { z } from 'zod'
import { pageOf } from './list'

export const Item = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.iso.datetime(),
})
export type Item = z.infer<typeof Item>

export const ItemSubmission = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(280).default(''),
})
export type ItemSubmission = z.input<typeof ItemSubmission>

export const ItemPage = pageOf(Item)
export type ItemPage = z.infer<typeof ItemPage>
