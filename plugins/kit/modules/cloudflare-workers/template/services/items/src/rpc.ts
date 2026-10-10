import { WorkerEntrypoint } from 'cloudflare:workers'
import { countItems, getItem } from './db/items'
import type { Env } from './env'

// Every public method is callable by Workers that bind to ItemsRpc; this Worker stays the only one touching DB.
export class ItemsRpc extends WorkerEntrypoint<Env> {
  getItem(id: string) {
    return getItem(this.env.DB, id)
  }

  countItems() {
    return countItems(this.env.DB)
  }
}
