import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Resources from './pages/Resources'
import Counseling from './pages/Counseling'
import SupportGroups from './pages/SupportGroups'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Yoga from './pages/Yoga'
import { useAuth } from './context/AuthContext'

console.log('App component mounted')

export default function App() {
  const { user, isLoading } = useAuth()

  const normalizeRole = (role) => (role || 'student').toString().toLowerCase() === 'admin' ? 'admin' : 'student'
  const hasRole = (role) => user && normalizeRole(user.role) === role
  
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
      return <Navigate to={normalizeRole(user.role) === 'admin' ? '/admin-dashboard' : '/dashboard'} replace />
    }
    return children
  }

  return (
    <div className="bg-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/counseling" element={<Counseling />} />
        <Route path="/yoga" element={<Yoga />} />
        <Route path="/support-groups" element={<SupportGroups />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}
