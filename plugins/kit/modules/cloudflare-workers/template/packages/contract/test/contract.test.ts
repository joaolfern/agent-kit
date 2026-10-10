import { describe, expect, it } from 'vitest'
import { ItemSubmission, ListQuery } from '../src'

describe('contract', () => {
  it('trims a submission and defaults the description', () => {
    expect(ItemSubmission.parse({ name: '  Garden log ' })).toEqual({
      name: 'Garden log',
      description: '',
    })
  })

  it('caps list limits', () => {
    expect(ListQuery.safeParse({ limit: '500' }).success).toBe(false)
    expect(ListQuery.parse({})).toEqual({ limit: 24 })
  })
})
