import { useQuery } from '@tanstack/react-query'
import { v1Api } from '@/api/api'
import { PAGE_SIZE } from '@/constants/pagination'
import type { IItem, IPage } from '@/interfaces/IItem'

async function fetchItems() {
  const { data } = await v1Api.get<IPage<IItem>>('items', {
    params: { limit: PAGE_SIZE },
  })
  return data
}

export function useItems() {
  return useQuery({ queryKey: ['items'], queryFn: fetchItems })
}
