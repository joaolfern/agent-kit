import { Typography } from '@/components/Typography/Typography'
import type { IItem } from '@/interfaces/IItem'
import styles from './ItemCard.module.scss'

type ItemCardProps = {
  item: IItem
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <article className={styles.card}>
      <span className={styles.thumb} />
      <div className={styles.content}>
        <Typography
          as='h2'
          variant='titleSm'
          className={styles.title}
          lines={1}
        >
          {item.name}
        </Typography>
        <Typography color='muted' className={styles.description} lines={2}>
          {item.description}
        </Typography>
      </div>
    </article>
  )
}
