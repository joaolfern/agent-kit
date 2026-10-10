import { Typography } from '@/components/Typography/Typography'
import { usePageMeta } from '@/hooks/usePageMeta'
import { ItemsShell } from '@/pages/Items/components/ItemsShell/ItemsShell'
import { ItemCard } from '@/pages/Items/components/ItemCard/ItemCard'
import { ItemsSkeleton } from '@/pages/Items/components/ItemsSkeleton/ItemsSkeleton'
import { useItems } from '@/pages/Items/hooks/useItems'
import styles from './Items.module.scss'

function ItemsList() {
  const { data, isPending, isError } = useItems()

  if (isPending) return <ItemsSkeleton />
  if (isError)
    return (
      <Typography color='muted'>
        Couldn't load the items. Try again in a moment.
      </Typography>
    )

  return (
    <ul className={styles.grid}>
      {data.items.map((item) => (
        <li key={item.id}>
          <ItemCard item={item} />
        </li>
      ))}
    </ul>
  )
}

export function Items() {
  usePageMeta({ title: 'Items' })

  return (
    <ItemsShell>
      <ItemsList />
    </ItemsShell>
  )
}
