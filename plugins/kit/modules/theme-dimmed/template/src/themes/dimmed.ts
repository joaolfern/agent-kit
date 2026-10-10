import type { ThemeVariables } from '@/interfaces/ITheme'
import { DARK_THEME_VARIABLES } from '@/themes/dark'

// A deep tinted page with cards in a faint white over it (#ffffff12, made opaque so dropdowns and modals stay readable).
export const DIMMED_THEME_VARIABLES: Record<ThemeVariables, string> = {
  ...DARK_THEME_VARIABLES,

  'color-page': '#050313',
  'color-surface': '#171524',
  'color-surface-glass': '#ffffff1a',
  'color-raised': '#252332',
  'color-border': '#ffffff24',
  'color-border-strong': '#302f3d',

  'color-text-base': '#f2f0f5',
  'color-text-muted': '#d4d0da',
  'color-text-subtle': '#b3afbb',
}
