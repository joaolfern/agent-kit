import { screen } from '@testing-library/react'
import { render } from '@/__tests__/utils.test'
import { ITEMS } from '@/__mocks__/data/items'
import { Items } from '@/pages/Items/Items'

describe('Items', () => {
  it('shows the title right away and the items once they load', async () => {
    await render(<Items />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Items' })
    ).toBeInTheDocument()
    expect(await screen.findByText(ITEMS[0].name)).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(ITEMS.length)
  })
})
