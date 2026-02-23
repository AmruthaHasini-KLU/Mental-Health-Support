import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  const normalizeRole = (role) => (role || 'student').toString().toLowerCase() === 'admin' ? 'admin' : 'student'

  useEffect(() => {
    const savedUser = localStorage.getItem('healthsupport_user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        if (parsedUser && parsedUser.email) {
          setUser({ ...parsedUser, role: normalizeRole(parsedUser.role) })
        } else {
          localStorage.removeItem('healthsupport_user')
        }
      } catch (error) {
        localStorage.removeItem('healthsupport_user')
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem('healthsupport_user', JSON.stringify({
        ...user,
        role: normalizeRole(user.role),
      }))
    } else {
      localStorage.removeItem('healthsupport_user')
    }
  }, [user])

  const signup = (userData) => {
    // Check if email already exists
    const accounts = JSON.parse(localStorage.getItem('healthsupport_accounts') || '[]')
    if (accounts.some(acc => acc.email === userData.email)) {
      throw new Error('Email already registered')
    }

    // Save account (default role is student)
    accounts.push({ ...userData, role: 'student' })
    localStorage.setItem('healthsupport_accounts', JSON.stringify(accounts))

    // Set current user
    const userObject = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: normalizeRole('student'),
      createdAt: new Date().toISOString(),
    }
    setUser(userObject)
    return userObject
  }

  const login = (email, password, role = 'student') => {
    const accounts = JSON.parse(localStorage.getItem('healthsupport_accounts') || '[]')
    const normalizedRole = normalizeRole(role)

    // Check for admin credentials
    if (normalizedRole === 'admin') {
      const adminAccounts = [
        { email: 'admin@healthsupport.com', password: 'Admin@123', role: 'admin' },
        { email: 'admin@mindease.com', password: 'AdminPass@2024', role: 'admin' },
      ]
      const admin = adminAccounts.find(acc => acc.email === email && acc.password === password)
      if (admin) {
        const userObject = {
          name: 'Admin',
          email: admin.email,
          role: normalizeRole('admin'),
          loginTime: new Date().toISOString(),
        }
        setUser(userObject)
        return userObject
      } else {
        throw new Error('Invalid admin credentials')
      }
    } else {
      // Student login
      const account = accounts.find(acc => acc.email === email && acc.password === password)
      if (!account) {
        throw new Error('Invalid email or password')
      }

      const userObject = {
        name: account.name,
        email: account.email,
        phone: account.phone,
        role: normalizeRole('student'),
        loginTime: new Date().toISOString(),
      }
      setUser(userObject)
      return userObject
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

