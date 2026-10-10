import { Outlet } from 'react-router'
import type { IconType } from 'react-icons'
// kit:if theme-dimmed
import { MdDarkMode, MdLightMode, MdNightsStay } from 'react-icons/md'
// kit:end
// kit:if !theme-dimmed
import { MdDarkMode, MdLightMode } from 'react-icons/md'
// kit:end
import { ButtonIcon } from '@/components/ButtonIcon/ButtonIcon'
import { Link } from '@/components/Link/Link'
import { Typography } from '@/components/Typography/Typography'
import { useTheme } from '@/hooks/useTheme'
import { useThemeToggleTransition } from '@/hooks/useThemeToggleTransition'
import type { ThemeModes } from '@/interfaces/ITheme'
import styles from './AppLayout.module.scss'

const THEME_TOGGLE: Record<ThemeModes, { label: string; Icon: IconType }> = {
  light: { label: 'Light theme', Icon: MdLightMode },
  dark: { label: 'Dark theme', Icon: MdDarkMode },
  // kit:if theme-dimmed
  dimmed: { label: 'Dimmed theme', Icon: MdNightsStay },
  // kit:end
}

function ThemeToggle() {
  const { nextMode } = useTheme()
  const { toggleTheme } = useThemeToggleTransition()
  const { label, Icon } = THEME_TOGGLE[nextMode]

  return (
    <ButtonIcon variant='transparent' label={label} onClick={toggleTheme}>
      <Icon />
    </ButtonIcon>
  )
}

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.topbar}>
        <Link to='/' className={styles.brand}>
          <Typography variant='titleSm'>{'{{title}}'}</Typography>
        </Link>
        <nav className={styles.nav}>
          <Link to='/items'>
            <Typography color='muted'>Items</Typography>
          </Link>
          <ThemeToggle />
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
