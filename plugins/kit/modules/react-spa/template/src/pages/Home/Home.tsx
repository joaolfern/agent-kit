import { Button } from '@/components/Button/Button'
import { Link } from '@/components/Link/Link'
import { Typography } from '@/components/Typography/Typography'
import { usePageMeta } from '@/hooks/usePageMeta'
import styles from './Home.module.scss'

export function Home() {
  usePageMeta({})

  return (
    <section className={styles.home}>
      <Typography as='h1' variant='titleLg' className={styles.title}>
        {'{{title}}'}
      </Typography>
      <Typography color='muted' className={styles.lead}>
        {'{{description}}'}
      </Typography>
      <Button asChild>
        <Link to='/items'>See the items</Link>
      </Button>
    </section>
  )
}
