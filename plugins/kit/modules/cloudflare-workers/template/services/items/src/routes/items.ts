import { ItemSubmission, ListQuery } from '{{contractPackage}}'
import { Hono } from 'hono'
import { InvalidCursorError, getItem, insertItem, listItems } from '../db/items'
import type { AppContext } from '../env'
import { NO_STORE, PUBLIC_LIST_CACHE } from '../lib/cache'
import { apiError } from '../lib/errors'
import { ulid } from '../lib/ulid'

export const items = new Hono<AppContext>()

items.get('/', async (c) => {
  const query = ListQuery.safeParse(c.req.query())
  if (!query.success) return apiError(c, 422, 'invalid', 'Invalid list query.')

  try {
    const page = await listItems(c.env.DB, query.data)
    c.header('cache-control', PUBLIC_LIST_CACHE)
    return c.json(page)
  } catch (error) {
    if (error instanceof InvalidCursorError) {
      return apiError(c, 422, 'invalid', 'Invalid cursor.')
    }
    throw error
  }
})

items.get('/:id', async (c) => {
  const item = await getItem(c.env.DB, c.req.param('id'))
  if (!item) return apiError(c, 404, 'not_found', 'Item not found.')
  c.header('cache-control', NO_STORE)
  return c.json(item)
})

items.post('/', async (c) => {
  const body = ItemSubmission.safeParse(await c.req.json().catch(() => null))
  if (!body.success) {
    const message = body.error.issues[0]?.message ?? 'Invalid item.'
    return apiError(c, 422, 'invalid', message)
  }

  const id = ulid()
  await insertItem(c.env.DB, { id, ...body.data, createdAt: Date.now() })
  return c.json(await getItem(c.env.DB, id), 201)
})
