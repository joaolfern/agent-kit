import type { Item } from '{{contractPackage}}'

export type ItemsService = {
  getItem(id: string): Promise<Item | null>
}

export type Env = {
  ITEMS: ItemsService
  HOME_URL: string
}
