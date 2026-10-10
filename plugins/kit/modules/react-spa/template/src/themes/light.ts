import type { ThemeVariables } from '@/interfaces/ITheme'

export const LIGHT_THEME_VARIABLES: Record<ThemeVariables, string> = {
  // Flat: the page, cards and inputs share one colour and borders separate them.
  'color-page': '#fbfafb',
  'color-surface': '#fbfafb',
  'color-surface-glass': '#fbfafbcc',
  'color-raised': '#efedef',
  'color-border': '#e3e1e3',
  'color-border-strong': '#d5d2d5',

  'color-text-base': '#242220',
  'color-text-muted': '#625d59',
  'color-text-subtle': '#8c8682',

  'color-primary': '{{brand.primary}}',
  'color-primary-hover': '{{brand.primaryHover}}',
  'color-primary-soft': '{{brand.primarySoft}}',
  'color-on-primary': '#fbfafb',
  'color-secondary': '{{brand.secondary}}',
  'color-secondary-soft': '{{brand.secondarySoft}}',
  'color-on-secondary': '#fbfafb',
  'color-accent': '#006dd3',

  'color-danger': '#e63946',
  'color-danger-soft': '#ffeaea',
  'color-success': '#1f9d55',
  'color-success-soft': '#e3f6ea',

  'blur-background': '20px',
}
