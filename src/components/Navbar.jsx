import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/resources', label: 'Resources' },
    { path: '/yoga', label: 'Yoga & Relief' },
    { path: '/counseling', label: 'Counseling Triage' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsOpen(false)
  }

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary-100 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to={user ? (user.role === 'admin' ? '/admin-dashboard' : '/dashboard') : '/'} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center cursor-pointer group-hover:shadow-soft-md transition-all">
              <span className="text-white font-bold text-lg">HS</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent hidden sm:inline">
              HealthSupport
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`font-medium transition-all duration-300 relative ${
                    isActive(link.path)
                      ? 'text-primary-700'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full"></div>
                  )}
                </Link>
              </li>
            ))}
            {user && (
              <li>
                <Link
                  to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}
                  className={`font-medium transition-all duration-300 relative ${
                    isActive(user.role === 'admin' ? '/admin-dashboard' : '/dashboard')
                      ? 'text-primary-700'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                  {(isActive('/dashboard') || isActive('/admin-dashboard')) && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full"></div>
                  )}
                </Link>
              </li>
            )}
          </ul>

          {/* CTA Button or Logout */}
          <div className="hidden md:flex gap-3 items-center">
            {user ? (
              <>
                <p className="text-gray-700 font-medium">Welcome, {user.name}</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
                <Link to="/login" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-primary-50 rounded-xl transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-primary-100">
            <ul className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-primary-100 text-primary-700 font-semibold'
                        : 'text-gray-700 hover:bg-primary-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {user && (
                <li>
                  <Link
                    to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      isActive(user.role === 'admin' ? '/admin-dashboard' : '/dashboard')
                        ? 'bg-primary-100 text-primary-700 font-semibold'
                        : 'text-gray-700 hover:bg-primary-50'
                    }`}
                  >
                    {user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                  </Link>
                </li>
              )}
              <li className="flex gap-2 pt-3 px-4">
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary flex-1 text-center" onClick={() => setIsOpen(false)}>
                      Sign In
                    </Link>
                    <Link to="/login" className="btn-primary flex-1 text-center" onClick={() => setIsOpen(false)}>
                      Get Started
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}
