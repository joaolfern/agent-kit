import type { IThemeContext } from '@/interfaces/ITheme'
import { createContext } from 'react'

const INITIAL_THEME: IThemeContext = {
  mode: 'light',
  nextMode: 'dark',
  updateThemeMode: () => {},
  animationsEnabled: true,
  toggleAnimations: () => {},
}

export const ThemeContext = createContext<IThemeContext>(INITIAL_THEME)
