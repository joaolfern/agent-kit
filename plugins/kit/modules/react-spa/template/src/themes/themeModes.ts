import type { ThemeModes, ThemeVariables } from '@/interfaces/ITheme'
import { DARK_THEME_VARIABLES } from '@/themes/dark'
import { LIGHT_THEME_VARIABLES } from '@/themes/light'
// kit:if theme-dimmed
import { DIMMED_THEME_VARIABLES } from '@/themes/dimmed'
// kit:end

export const THEME_VARIABLES: Record<
  ThemeModes,
  Record<ThemeVariables, string>
> = {
  dark: DARK_THEME_VARIABLES,
  // kit:if theme-dimmed
  dimmed: DIMMED_THEME_VARIABLES,
  // kit:end
  light: LIGHT_THEME_VARIABLES,
}

// kit:if theme-dimmed
const THEME_CYCLE: ThemeModes[] = ['light', 'dark', 'dimmed']
// kit:end
// kit:if !theme-dimmed
const THEME_CYCLE: ThemeModes[] = ['light', 'dark']
// kit:end

export function nextThemeMode(mode: ThemeModes): ThemeModes {
  const next = (THEME_CYCLE.indexOf(mode) + 1) % THEME_CYCLE.length
  return THEME_CYCLE[next] ?? 'light'
}

export function themeColor(mode: ThemeModes) {
  return THEME_VARIABLES[mode]['color-page']
}

const THEME_MODES = Object.keys(THEME_VARIABLES)

export function isThemeMode(value: string | null): value is ThemeModes {
  return value !== null && THEME_MODES.includes(value)
}
