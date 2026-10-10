import { delay, http, HttpResponse } from 'msw'
import { V1_API_URL } from '@/config/env'
import { ITEMS } from '@/__mocks__/data/items'
import type { IItem, IPage } from '@/interfaces/IItem'

const api = (path: string) => `${V1_API_URL}${path}`

export const handlers = [
  http.get(api('/items'), async () => {
    await delay()
    return HttpResponse.json<IPage<IItem>>({
      items: ITEMS,
      nextCursor: null,
      total: ITEMS.length,
    })
  }),
]
