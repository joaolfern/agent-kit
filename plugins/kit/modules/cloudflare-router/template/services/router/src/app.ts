import { Hono } from 'hono'

export type RouterDeps = {
  itemExists: (id: string) => Promise<boolean>
  homeUrl: () => string
  recordClick: (id: string) => void
}

const REDIRECT_HEADERS = {
  'cache-control': 'no-store',
  'x-robots-tag': 'noindex',
}

function redirect(location: string) {
  return new Response(null, {
    status: 302,
    headers: { ...REDIRECT_HEADERS, location },
  })
}

export function createApp(deps: RouterDeps) {
  const app = new Hono()

  app.get('/r/:id', async (c) => {
    const id = c.req.param('id')
    const home = deps.homeUrl()
    if (!(await deps.itemExists(id))) return redirect(home)

    deps.recordClick(id)
    return redirect(new URL(`items#${encodeURIComponent(id)}`, home).href)
  })

  app.notFound(() => redirect(deps.homeUrl()))

  return app
}
