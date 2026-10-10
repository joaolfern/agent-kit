export type IThemeContext = {
  mode: ThemeModes
  nextMode: ThemeModes
  updateThemeMode: (newMode: ThemeModes) => void
  animationsEnabled: boolean
  toggleAnimations: () => void
}

// kit:if theme-dimmed
export type ThemeModes = 'light' | 'dark' | 'dimmed'
// kit:end
// kit:if !theme-dimmed
export type ThemeModes = 'light' | 'dark'
// kit:end

export type ThemeVariables =
  | 'color-page'
  | 'color-surface'
  | 'color-surface-glass'
  | 'color-raised'
  | 'color-border'
  | 'color-border-strong'
  | 'color-text-base'
  | 'color-text-muted'
  | 'color-text-subtle'
  | 'color-primary'
  | 'color-primary-hover'
  | 'color-primary-soft'
  | 'color-on-primary'
  | 'color-secondary'
  | 'color-secondary-soft'
  | 'color-on-secondary'
  | 'color-accent'
  | 'color-danger'
  | 'color-danger-soft'
  | 'color-success'
  | 'color-success-soft'
  | 'blur-background'
