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
  const [theme, setTheme] = useState('light')

  // Initialize theme on mount
  useEffect(() => {
    // Always start in light mode - remove dark class
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }, [])

  // Apply theme to document
  useEffect(() => {
    const isDark = theme === 'dark'
    if (isDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
