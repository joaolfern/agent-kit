import { ThemeContext } from '@/contexts/ThemeContext'
import type { IThemeContext } from '@/interfaces/ITheme'
import {
  THEME_VARIABLES,
  isThemeMode,
  nextThemeMode,
  themeColor,
} from '@/themes/themeModes'
import { useEffect, useLayoutEffect, useReducer, useState } from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
}

const THEME_KEY = 'themeMode'
const ANIMATIONS_KEY = 'animationsEnabled'

const matchesDark = (match: boolean) => (match ? 'dark' : 'light')

function readStorage(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    return
  }
}

const toggleAnimationReducer = (state: boolean) => {
  const newState = !state
  writeStorage(ANIMATIONS_KEY, String(newState))
  return newState
}

const getCurrentTheme = () => {
  const storedTheme = readStorage(THEME_KEY)
  if (isThemeMode(storedTheme)) return storedTheme

  return matchesDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
}

function applyThemeVariables(themeMode: IThemeContext['mode']) {
  Object.entries(THEME_VARIABLES[themeMode]).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value)
  })
  document.documentElement.style.colorScheme =
    themeMode === 'light' ? 'light' : 'dark'
}

function applyThemeColor(themeMode: IThemeContext['mode']) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', themeColor(themeMode))
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setThemeMode] = useState<IThemeContext['mode']>(getCurrentTheme)
  const [animationsEnabled, toggleAnimations] = useReducer(
    toggleAnimationReducer,
    readStorage(ANIMATIONS_KEY) !== 'false'
  )

  const updateThemeMode = (newMode: IThemeContext['mode']) => {
    setThemeMode(newMode)
    writeStorage(THEME_KEY, newMode)
  }

  useLayoutEffect(() => {
    applyThemeVariables(mode)
    applyThemeColor(mode)
  }, [mode])

  useEffect(() => {
    const darkMatchMedia = window.matchMedia('(prefers-color-scheme: dark)')

    function handleThemeChange(event: MediaQueryListEvent) {
      if (isThemeMode(readStorage(THEME_KEY))) return
      setThemeMode(matchesDark(event.matches))
    }

    darkMatchMedia.addEventListener('change', handleThemeChange)
    return () => darkMatchMedia.removeEventListener('change', handleThemeChange)
  }, [])

  const value: IThemeContext = {
    mode,
    nextMode: nextThemeMode(mode),
    updateThemeMode,
    animationsEnabled,
    toggleAnimations,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
