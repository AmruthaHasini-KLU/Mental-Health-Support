import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  const normalizeRole = (role, email) => {
    const normalized = (role || 'student').toString().toLowerCase()
    if (normalized === 'admin' && email === 'admin@gmail.com') return 'admin'
    if (normalized === 'doctor') return 'doctor'
    return 'student'
  }

  useEffect(() => {
    // Initialize demo doctors if they don't exist
    const existingDoctors = localStorage.getItem('healthsupport_doctors')
    if (!existingDoctors) {
      const demoDoctors = [
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          email: 'dr.sarah@gmail.com',
          password: 'docpass123',
          specialization: 'Anxiety & Depression',
          active: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'Dr. Michael Chen',
          email: 'dr.michael@gmail.com',
          password: 'docpass123',
          specialization: 'PTSD & Trauma',
          active: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: 'Dr. Emily Rodriguez',
          email: 'dr.emily@gmail.com',
          password: 'docpass123',
          specialization: 'Academic Stress',
          active: true,
          createdAt: new Date().toISOString(),
        },
      ]
      localStorage.setItem('healthsupport_doctors', JSON.stringify(demoDoctors))
    }

    const savedUser = localStorage.getItem('healthsupport_user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        if (parsedUser && parsedUser.email) {
          setUser({ ...parsedUser, role: normalizeRole(parsedUser.role, parsedUser.email) })
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
        role: normalizeRole(user.role, user.email),
      }))
    } else {
      localStorage.removeItem('healthsupport_user')
    }
  }, [user])

  const signup = (userData) => {
    const { role = 'student' } = userData
    
    // Validate email doesn't already exist
    const accounts = JSON.parse(localStorage.getItem('healthsupport_accounts') || '[]')
    const doctors = JSON.parse(localStorage.getItem('healthsupport_doctors') || '[]')
    
    if (accounts.some(acc => acc.email === userData.email)) {
      throw new Error('Email already registered')
    }
    if (doctors.some(doc => doc.email === userData.email)) {
      throw new Error('Email already registered as a doctor')
    }

    if (role === 'doctor') {
      // Doctor signup
      if (!userData.email.startsWith('dr.') || !userData.email.endsWith('@gmail.com')) {
        throw new Error('Doctor email must follow format: dr.<name>@gmail.com')
      }

      const newDoctor = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        specialization: userData.specialization || 'Not specified',
        phone: userData.phone,
        active: true,
        createdAt: new Date().toISOString(),
      }

      doctors.push(newDoctor)
      localStorage.setItem('healthsupport_doctors', JSON.stringify(doctors))

      // Set current user
      const userObject = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        specialization: newDoctor.specialization,
        role: 'doctor',
        doctorId: newDoctor.id,
        createdAt: new Date().toISOString(),
      }
      setUser(userObject)
      return userObject
    } else {
      // Student signup
      const newStudent = {
        ...userData,
        role: 'student',
        studentId: userData.studentId,
        createdAt: new Date().toISOString(),
      }
      
      accounts.push(newStudent)
      localStorage.setItem('healthsupport_accounts', JSON.stringify(accounts))

      // Set current user
      const userObject = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        studentId: userData.studentId,
        role: 'student',
        createdAt: new Date().toISOString(),
      }
      setUser(userObject)
      return userObject
    }
  }

  const login = (email, password, role = 'student') => {
    const accounts = JSON.parse(localStorage.getItem('healthsupport_accounts') || '[]')
    const normalizedRole = normalizeRole(role, email)

    // Check for admin credentials
    if (normalizedRole === 'admin') {
      const adminAccounts = [
        { email: 'admin@gmail.com', password: 'admin@888', role: 'admin' },
      ]
      const admin = adminAccounts.find(acc => acc.email === email && acc.password === password)
      if (admin) {
        const userObject = {
          name: 'System Admin',
          email: admin.email,
          role: normalizeRole('admin', admin.email),
          loginTime: new Date().toISOString(),
        }
        setUser(userObject)
        return userObject
      } else {
        throw new Error('Invalid admin credentials')
      }
    } else if (email.endsWith('@gmail.com') && email.includes('dr.')) {
      // Check for doctor credentials
      const doctorAccounts = JSON.parse(localStorage.getItem('healthsupport_doctors') || '[]')
      const doctor = doctorAccounts.find(acc => acc.email === email && acc.password === password && acc.active)
      if (doctor) {
        const userObject = {
          name: doctor.name,
          email: doctor.email,
          specialization: doctor.specialization,
          role: 'doctor',
          doctorId: doctor.id,
          loginTime: new Date().toISOString(),
        }
        setUser(userObject)
        return userObject
      } else {
        throw new Error('Invalid doctor credentials or account is inactive')
      }
    } else {
      // Check for demo student credentials first
      const demoStudents = [
        { email: 'student@healthsupport.com', password: 'student123', name: 'Demo Student', phone: '123-456-7890' },
        { email: 'john@student.com', password: 'Student@123', name: 'John Doe', phone: '555-0100' },
        { email: 'sarah@student.com', password: 'Student@123', name: 'Sarah Smith', phone: '555-0101' },
      ]
      
      const demoStudent = demoStudents.find(acc => acc.email === email && acc.password === password)
      if (demoStudent) {
        const userObject = {
          name: demoStudent.name,
          email: demoStudent.email,
          phone: demoStudent.phone,
          role: normalizeRole('student'),
          loginTime: new Date().toISOString(),
        }
        setUser(userObject)
        return userObject
      }
      
      // Regular student login from registered accounts
      const account = accounts.find(acc => acc.email === email && acc.password === password)
      if (!account) {
        throw new Error('Invalid email or password. Please use demo credentials or sign up.')
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

  const createDoctorAccount = (doctorData) => {
    const doctors = JSON.parse(localStorage.getItem('healthsupport_doctors') || '[]')
    
    // Validate email format: dr.<name>@gmail.com
    if (!doctorData.email.startsWith('dr.') || !doctorData.email.endsWith('@gmail.com')) {
      throw new Error('Doctor email must follow format: dr.<name>@gmail.com')
    }

    if (doctors.some(doc => doc.email === doctorData.email)) {
      throw new Error('Doctor email already exists')
    }

    const newDoctor = {
      id: Date.now(),
      name: doctorData.name,
      email: doctorData.email,
      password: doctorData.password,
      specialization: doctorData.specialization,
      active: true,
      createdAt: new Date().toISOString(),
    }

    doctors.push(newDoctor)
    localStorage.setItem('healthsupport_doctors', JSON.stringify(doctors))
    return newDoctor
  }

  const getDoctors = () => {
    return JSON.parse(localStorage.getItem('healthsupport_doctors') || '[]')
  }

  const toggleDoctorStatus = (doctorId, active) => {
    const doctors = JSON.parse(localStorage.getItem('healthsupport_doctors') || '[]')
    const updatedDoctors = doctors.map(doc =>
      doc.id === doctorId ? { ...doc, active } : doc
    )
    localStorage.setItem('healthsupport_doctors', JSON.stringify(updatedDoctors))
    return updatedDoctors
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signup, 
      login, 
      logout,
      createDoctorAccount,
      getDoctors,
      toggleDoctorStatus
    }}>
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

