import { renderHook } from '@testing-library/react'
import { DEFAULT_DESCRIPTION, usePageMeta } from '@/hooks/usePageMeta'

const content = (selector: string) =>
  document.head.querySelector(selector)?.getAttribute('content')

describe('usePageMeta', () => {
  it('sets the title, description and share tags of a page', () => {
    renderHook(() =>
      usePageMeta({ title: 'Items', description: 'All items.', path: '/items' })
    )

    expect(document.title).toBe('Items · {{title}}')
    expect(content('meta[name="description"]')).toBe('All items.')
    expect(content('meta[property="og:url"]')).toBe(
      'https://localhost:3000/items'
    )
  })

  it('falls back to the default description', () => {
    renderHook(() => usePageMeta({ path: '/' }))

    expect(content('meta[name="description"]')).toBe(DEFAULT_DESCRIPTION)
  })

  it('marks a page noindex only while it is mounted', () => {
    const { unmount } = renderHook(() =>
      usePageMeta({ path: '/missing', noIndex: true })
    )
    expect(content('meta[name="robots"]')).toBe('noindex')

    unmount()
    expect(content('meta[name="robots"]')).toBeUndefined()
  })
})
