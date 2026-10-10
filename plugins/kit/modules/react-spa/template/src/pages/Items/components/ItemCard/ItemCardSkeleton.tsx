import clsx from 'clsx'
import { Typography } from '@/components/Typography/Typography'
import styles from './ItemCard.module.scss'

export function ItemCardSkeleton() {
  return (
    <article className={styles.card} aria-hidden={true}>
      <span className={clsx(styles.thumb, styles.bone)} />
      <div className={styles.content}>
        <Typography
          as='span'
          variant='titleSm'
          className={clsx(styles.title, styles.boneText)}
        >
          &nbsp;
        </Typography>
        <Typography className={clsx(styles.description, styles.boneText)}>
          &nbsp;
          <br />
          &nbsp;
        </Typography>
      </div>
    </article>
  )
}
