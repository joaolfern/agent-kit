import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Env = {
  ITEMS: Fetcher
  ALLOWED_ORIGINS: string
}

function isAllowedOrigin(origin: string, allowed: string) {
  return allowed.split(',').includes(origin)
}

export const app = new Hono<{ Bindings: Env }>()

app.use('/v1/*', (c, next) =>
  cors({
    origin: (origin) =>
      isAllowedOrigin(origin, c.env.ALLOWED_ORIGINS) ? origin : null,
    allowHeaders: ['content-type'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    maxAge: 86400,
  })(c, next)
)

// Responses from a binding are immutable; a copy lets the CORS middleware set its headers.
const forward = async (service: Fetcher, request: Request) => {
  const response = await service.fetch(request)
  return new Response(response.body, response)
}

app.all('/v1/*', (c) => forward(c.env.ITEMS, c.req.raw))

export default app
