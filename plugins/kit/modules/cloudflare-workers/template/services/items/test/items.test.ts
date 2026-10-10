import type { ApiErrorResponse, Item, ItemPage } from '{{contractPackage}}'
import { env } from 'cloudflare:test'
import { exports } from 'cloudflare:workers'
import { describe, expect, it } from 'vitest'

const call = (path: string, init?: RequestInit) =>
  exports.default.fetch(`https://items.test${path}`, init)

const create = (name: string) =>
  call('/v1/items', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name }),
  })

describe('items', () => {
  it('creates an item and reads it back', async () => {
    const response = await create('Garden log')
    expect(response.status).toBe(201)
    const item = (await response.json()) as Item

    const read = await call(`/v1/items/${item.id}`)
    expect(await read.json()).toEqual(item)
  })

  it('pages through items, newest first', async () => {
    const names = ['First', 'Second', 'Third']
    await env.DB.batch(
      names.map((name, index) =>
        env.DB.prepare(
          'INSERT INTO items (id, name, created_at) VALUES (?, ?, ?)'
        ).bind(`ITEM${index}`, name, 1_000 + index)
      )
    )

    const first = (await (await call('/v1/items?limit=2')).json()) as ItemPage
    expect(first.items.map((item) => item.name)).toEqual(['Third', 'Second'])
    expect(first.total).toBe(3)

    const second = (await (
      await call(`/v1/items?limit=2&cursor=${first.nextCursor}`)
    ).json()) as ItemPage
    expect(second.items.map((item) => item.name)).toEqual(['First'])
    expect(second.nextCursor).toBeNull()
  })

  it('answers errors in the contract shape', async () => {
    const invalid = await create('')
    expect(invalid.status).toBe(422)
    const body = (await invalid.json()) as ApiErrorResponse
    expect(body.error.code).toBe('invalid')

    const missing = await call('/v1/items/NOPE')
    expect(missing.status).toBe(404)
  })
})
