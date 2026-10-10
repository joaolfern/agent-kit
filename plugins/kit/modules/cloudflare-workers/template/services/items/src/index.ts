import { app } from './app'
import type { Env } from './env'

export { ItemsRpc } from './rpc'

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>
