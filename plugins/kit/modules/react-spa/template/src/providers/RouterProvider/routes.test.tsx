// kit:if cloudflare-router
import { screen, waitFor } from '@testing-library/react'
// kit:end
// kit:if !cloudflare-router
import { screen } from '@testing-library/react'
// kit:end
import { render } from '@/__tests__/utils.test'
import { Router } from '@/providers/RouterProvider/routes'

const visit = async (path: string) => {
  window.history.pushState({}, '', path)
  await render(<Router />)
}

describe('Router', () => {
  it('loads a lazy page inside the layout', async () => {
    await visit('/items')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Items' })
    ).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('shows the not-found page for unknown paths', async () => {
    await visit('/missing')

    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })
  // kit:if cloudflare-router

  it('sends /r/* home when the router Worker is bypassed', async () => {
    await visit('/r/01ITEM')

    await waitFor(() => expect(window.location.pathname).toBe('/'))
  })
  // kit:end
})
