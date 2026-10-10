import type { ThemeVariables } from '@/interfaces/ITheme'

export const DARK_THEME_VARIABLES: Record<ThemeVariables, string> = {
  // Surfaces get lighter as they rise; borders stay low contrast.
  'color-page': '#0c0d10',
  'color-surface': '#131317',
  'color-surface-glass': '#131317b8',
  'color-raised': '#1b1b1f',
  'color-border': '#2a2a2e',
  'color-border-strong': '#2c2e31',

  'color-text-base': '#ddd7d4',
  'color-text-muted': '#a39b97',
  'color-text-subtle': '#74706d',

  'color-primary': '{{brand.primary}}',
  'color-primary-hover': '{{brand.primaryHover}}',
  'color-primary-soft': '{{brand.primarySoft}}',
  'color-on-primary': '#f2f0f2',
  'color-secondary': '{{brand.secondary}}',
  'color-secondary-soft': '{{brand.secondarySoft}}',
  'color-on-secondary': '#222021',
  'color-accent': '#338eda',

  'color-danger': '#ff5c67',
  'color-danger-soft': '#3a1518',
  'color-success': '#3ecf7a',
  'color-success-soft': '#123323',

  'blur-background': '50px',
}
