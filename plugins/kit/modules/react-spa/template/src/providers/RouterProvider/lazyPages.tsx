import { lazy } from 'react'

// Each page is its own chunk: a visitor downloads only the pages they open.
export const Items = lazy(() =>
  import('@/pages/Items/Items').then((module) => ({ default: module.Items }))
)
