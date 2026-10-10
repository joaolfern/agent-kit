import { exports } from 'cloudflare:workers'
import { describe, expect, it } from 'vitest'

const call = (path: string, init?: RequestInit) =>
  exports.default.fetch(`https://api.test${path}`, init)

describe('gateway', () => {
  it('forwards /v1 requests to the items Worker', async () => {
    const response = await call('/v1/items?limit=5')
    expect(await response.json()).toEqual({ path: '/v1/items' })
  })

  it('allows only configured origins', async () => {
    const allowed = await call('/v1/items', {
      headers: { origin: 'http://localhost:5173' },
    })
    expect(allowed.headers.get('access-control-allow-origin')).toBe(
      'http://localhost:5173'
    )

    const other = await call('/v1/items', {
      headers: { origin: 'https://evil.test' },
    })
    expect(other.headers.get('access-control-allow-origin')).toBeNull()
  })
})
