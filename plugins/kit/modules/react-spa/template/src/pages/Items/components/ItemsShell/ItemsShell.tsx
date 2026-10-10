import { Typography } from '@/components/Typography/Typography'
import styles from '@/pages/Items/Items.module.scss'

type ItemsShellProps = {
  children: React.ReactNode
}

// Shared by the page and its route fallback, so the heading is already in place while the chunk loads.
export function ItemsShell({ children }: ItemsShellProps) {
  return (
    <section className={styles.page}>
      <Typography as='h1' variant='titleLg' className={styles.title}>
        Items
      </Typography>
      {children}
    </section>
  )
}
