import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Resources from './pages/Resources'
import Therapy from './pages/Therapy'
import SupportGroups from './pages/SupportGroups'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import DoctorPortal from './pages/DoctorPortal'
import Yoga from './pages/Yoga'
import Forums from './pages/Forums'
import AIAssistant from './components/AIAssistant'
import { useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

console.log('App component mounted')

export default function App() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  const normalizeRole = (role) => {
    if (!role) return 'student'
    const normalized = role.toString().toLowerCase()
    if (normalized === 'admin') return 'admin'
    if (normalized === 'doctor') return 'doctor'
    return 'student'
  }
  
  const hasRole = (role) => user && normalizeRole(user.role) === role

  // Check if current route is a student route
  const isStudentRoute = () => {
    const studentPaths = ['/dashboard', '/student/dashboard', '/yoga', '/therapy', '/resources', '/forums', '/support-groups']
    return user && hasRole('student') && studentPaths.some(path => location.pathname.includes(path))
  }
  
  console.log('App rendering')
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        Checking your session...
      </div>
    )
  }

  const ProtectedRoute = ({ allowedRole, children }) => {
    if (!user) {
      return <Navigate to="/login" replace />
    }
    if (allowedRole && !hasRole(allowedRole)) {
      const redirectRole = normalizeRole(user.role)
      const redirectPaths = {
        'admin': '/admin/dashboard',
        'doctor': '/doctor/dashboard',
        'student': '/student/dashboard'
      }
      return <Navigate to={redirectPaths[redirectRole] || '/student/dashboard'} replace />
    }
    return children
  }

  return (
    <ThemeProvider>
      <div className="bg-white transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/therapy" element={<Therapy />} />
        <Route path="/yoga" element={<Yoga />} />
        <Route path="/forums" element={<Forums />} />
        <Route path="/support-groups" element={<SupportGroups />} />
        <Route path="/login" element={<Login />} />

        {/* Student Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Doctor Portal Routes */}
        <Route
          path="/doctor-portal"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorPortal />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* AI Assistant - Shows only on student routes */}
      {isStudentRoute() && <AIAssistant />}
      </div>
    </ThemeProvider>
  )
}
