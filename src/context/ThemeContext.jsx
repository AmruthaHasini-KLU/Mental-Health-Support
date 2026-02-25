import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Force cleanup any stale dark class on app load
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
      document.documentElement.removeAttribute('data-theme')
      document.body.removeAttribute('data-theme')
    }

    // Check localStorage first
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  // Apply theme to document immediately
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    const isDark = theme === 'dark'

    // Force removal of dark class before applying
    root.classList.remove('dark')
    body.classList.remove('dark')
    root.removeAttribute('data-theme')
    body.removeAttribute('data-theme')

    // Then apply based on theme
    if (isDark) {
      root.classList.add('dark')
      body.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
      body.setAttribute('data-theme', 'dark')
    } else {
      // Explicitly remove attributes in light mode
      root.removeAttribute('data-theme')
      body.removeAttribute('data-theme')
    }

    localStorage.setItem('theme', theme)
  }, [theme])

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (e) => {
      const saved = localStorage.getItem('theme')
      // Only auto-switch if user hasn't manually set a preference
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      // Force immediate DOM update
      const isDark = newTheme === 'dark'
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
      document.documentElement.removeAttribute('data-theme')
      document.body.removeAttribute('data-theme')
      if (isDark) {
        document.documentElement.classList.add('dark')
        document.body.classList.add('dark')
        document.documentElement.setAttribute('data-theme', 'dark')
        document.body.setAttribute('data-theme', 'dark')
      }
      return newTheme
    })
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
