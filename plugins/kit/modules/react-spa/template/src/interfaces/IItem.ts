export interface IItem {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface IPage<T> {
  items: T[]
  nextCursor: string | null
  total: number
}
