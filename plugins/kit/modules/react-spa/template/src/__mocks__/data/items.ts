import type { IItem } from '@/interfaces/IItem'

const NAMES = [
  'Northwind field notes',
  'A short guide to tidy commits',
  'Weekend bread schedule',
  'Bike route along the river, with the two cafés worth stopping at',
  'Garden log',
  'Reading list',
]

export const ITEMS: IItem[] = NAMES.map((name, index) => ({
  id: `01ITEM${String(index).padStart(20, '0')}`,
  name,
  description:
    index % 2 === 0
      ? 'A one-line description that fits.'
      : 'A longer description that wraps onto a second line, so the card layout is checked against real lengths.',
  createdAt: new Date(Date.UTC(2026, 0, index + 1)).toISOString(),
}))
