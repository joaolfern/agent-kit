import { PAGE_SIZE } from '@/constants/pagination'
import { ItemCardSkeleton } from '@/pages/Items/components/ItemCard/ItemCardSkeleton'
import styles from '@/pages/Items/Items.module.scss'

const SKELETON_COUNT = Math.min(PAGE_SIZE, 6)

export function ItemsSkeleton() {
  return (
    <ul className={styles.grid} aria-busy={true}>
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <li key={index}>
          <ItemCardSkeleton />
        </li>
      ))}
    </ul>
  )
}
