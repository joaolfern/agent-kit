import { createApp } from './app'
import type { Env } from './env'

async function itemExists(env: Env, id: string) {
  try {
    return (await env.ITEMS.getItem(id)) !== null
  } catch {
    return false
  }
}

export default {
  fetch(request, env, ctx) {
    const app = createApp({
      itemExists: (id) => itemExists(env, id),
      homeUrl: () => env.HOME_URL,
      recordClick: (id) => console.info('click', id),
    })
    return app.fetch(request, env, ctx)
  },
} satisfies ExportedHandler<Env>
