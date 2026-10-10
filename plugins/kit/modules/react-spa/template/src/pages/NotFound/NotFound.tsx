import { Link } from '@/components/Link/Link'
import { Typography } from '@/components/Typography/Typography'
import { usePageMeta } from '@/hooks/usePageMeta'

export function NotFound() {
  usePageMeta({ title: 'Page not found', noIndex: true })

  return (
    <section>
      <Typography as='h1' variant='titleMd'>
        Page not found
      </Typography>
      <Typography color='muted'>
        The link may be old. <Link to='/'>Go to the home page</Link>.
      </Typography>
    </section>
  )
}
