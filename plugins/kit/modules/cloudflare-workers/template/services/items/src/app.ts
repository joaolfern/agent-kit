import { Hono } from 'hono'
import type { AppContext } from './env'
import { apiError } from './lib/errors'
import { items } from './routes/items'

export const app = new Hono<AppContext>().basePath('/v1')

app.route('/items', items)

app.notFound((c) => apiError(c, 404, 'not_found', 'Route not found.'))
app.onError((error, c) => {
  console.error(error)
  return apiError(c, 500, 'internal', 'Something went wrong. Try again.')
})
