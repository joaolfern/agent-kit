import { describe, expect, it, vi } from 'vitest'
import { createApp } from '../src/app'

const HOME = 'https://site.test/'

function appWith(existing: string[]) {
  const recordClick = vi.fn()
  const app = createApp({
    itemExists: async (id) => existing.includes(id),
    homeUrl: () => HOME,
    recordClick,
  })
  return { app, recordClick }
}

describe('router', () => {
  it('redirects a known item and records the click', async () => {
    const { app, recordClick } = appWith(['01ITEM'])

    const response = await app.request('/r/01ITEM')

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe(
      'https://site.test/items#01ITEM'
    )
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(recordClick).toHaveBeenCalledWith('01ITEM')
  })

  it('sends unknown items and paths home without recording', async () => {
    const { app, recordClick } = appWith([])

    expect((await app.request('/r/NOPE')).headers.get('location')).toBe(HOME)
    expect((await app.request('/elsewhere')).headers.get('location')).toBe(HOME)
    expect(recordClick).not.toHaveBeenCalled()
  })
})
