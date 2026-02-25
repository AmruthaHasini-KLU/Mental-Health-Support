import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Layout from '../layouts/Layout'
import { Mail, Lock, User, Eye, EyeOff, Phone, AlertCircle, CheckCircle, RefreshCw, Sparkles, Shield, Users } from 'lucide-react'
import { useCaptcha } from '../components/SimpleCaptcha'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Login() {
  const navigate = useNavigate()
  const { signup, login } = useAuth()
  const { isDarkMode } = useTheme()
  
  const [isSignUp, setIsSignUp] = useState(false)
  const [userRole, setUserRole] = useState('student') // For login: 'student', 'doctor', or 'admin'
  const [signupRole, setSignupRole] = useState('student') // For signup: 'student' or 'doctor'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const captcha = useCaptcha()

  // Inspirational quotes for the left sidebar
  const quotes = [
    {
      text: "Mental health is not the absence of mental disorder. It is a state of well-being.",
      author: "World Health Organization"
    },
    {
      text: "You are not alone in this journey. Every step towards healing is a victory.",
      author: "Mental Health Advocate"
    },
    {
      text: "Healing doesn't mean the damage never existed. It means the damage no longer controls us.",
      author: "Akshay Dubey"
    },
    {
      text: "Your mental health is a priority, not a luxury.",
      author: "Unknown"
    },
    {
      text: "Be gentle with yourself. You're doing the best you can.",
      author: "Unknown"
    }
  ]

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    phone: '',
    studentId: '', // Only for students
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    } else if (isSignUp && signupRole === 'doctor') {
      // Validate doctor email format: docname@gmail.com
      if (!formData.email.startsWith('dr.') || !formData.email.endsWith('@gmail.com')) {
        newErrors.email = 'Doctor email must follow format: dr.<name>@gmail.com'
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!isSignUp && !captcha.isValid) {
      newErrors.captcha = 'Please verify CAPTCHA'
    }

    if (isSignUp) {
      if (!formData.name) {
        newErrors.name = 'Full name is required'
      } else if (formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }

      if (!formData.phone) {
        newErrors.phone = 'Phone number is required'
      } else if (!/^\d{10,}/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number'
      }

      // Student ID is required for students
      if (signupRole === 'student' && !formData.studentId) {
        newErrors.studentId = 'Student ID is required'
      }
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length === 0) {
      try {
        if (isSignUp) {
          if (userRole === 'admin') {
            setErrors({ form: 'Admins cannot self-register. Contact system administrator.' })
            return
          }
          signup({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            studentId: signupRole === 'student' ? formData.studentId : undefined,
            role: signupRole, // Pass the selected role
          })
          setSubmitted(true)
          const redirectPath = {
            'student': '/student/dashboard',
            'doctor': '/doctor/dashboard'
          }
          setTimeout(() => {
            navigate(redirectPath[signupRole] || '/student/dashboard')
          }, 1500)
        } else {
          // Call login function from AuthContext
          const loggedInUser = login(formData.email, formData.password, userRole)
          setSubmitted(true)
          const redirectPath = {
            'admin': '/admin/dashboard',
            'doctor': '/doctor/dashboard',
            'student': '/student/dashboard'
          }
          setTimeout(() => {
            navigate(redirectPath[loggedInUser?.role] || '/student/dashboard')
          }, 100)
        }
      } catch (err) {
        setErrors({ form: err.message || 'Invalid email or password. Please check your credentials.' })
      }
    } else {
      setErrors(newErrors)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <Layout>
      <section className="min-h-screen transition-colors duration-300" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          
          {/* Left Side - Professional Calm Study Space Illustration */}
          <motion.div 
            className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br transition-all duration-300"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, #1e293b 0%, #312e81 50%, #1e1b4b 100%)'
                : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 opacity-10 rounded-full blur-3xl -mr-48 -mt-48" style={{ backgroundColor: isDarkMode ? '#ffffff' : '#6366f1' }}></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 opacity-10 rounded-full blur-3xl -ml-48 -mb-48" style={{ backgroundColor: isDarkMode ? '#ffffff' : '#6366f1' }}></div>
            
            {/* Logo/Branding */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-lg border" style={{
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(99, 102, 241, 0.2)'
                }}>
                  <Sparkles size={24} style={{ color: isDarkMode ? '#a5b4fc' : '#6366f1' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: isDarkMode ? '#ffffff' : '#1e293b' }}>MindEase</h2>
                  <p className="text-xs" style={{ color: isDarkMode ? '#cbd5e1' : '#64748b' }}>Wellness Portal</p>
                </div>
              </div>
            </motion.div>

            {/* Center Content - Professional Study Space Illustration & Quote */}
            <motion.div
              className="relative z-10 flex flex-col items-center justify-center py-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {/* Professional Study Space SVG Illustration */}
              <div className="relative w-80 h-80 mb-8">
                {/* Ambient glow */}
                <div className="absolute inset-0 bg-gradient-to-b opacity-20 rounded-3xl blur-3xl" style={{
                  background: isDarkMode ? 'linear-gradient(to bottom, #818cf8, #6366f1)' : 'linear-gradient(to bottom, #6366f1, #4f46e5)'
                }}></div>
                
                {/* Minimalist Calm Study Space SVG */}
                <svg viewBox="0 0 300 300" className="w-full h-full relative z-10 drop-shadow-2xl">
                  <defs>
                    {/* Gradients for modern look */}
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor: isDarkMode ? '#1e293b' : '#f8fafc', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: isDarkMode ? '#0f172a' : '#e2e8f0', stopOpacity: 1}} />
                    </linearGradient>
                    <linearGradient id="deskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor: isDarkMode ? '#475569' : '#cbd5e1', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: isDarkMode ? '#334155' : '#94a3b8', stopOpacity: 1}} />
                    </linearGradient>
                    <linearGradient id="laptopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#6366f1', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#4f46e5', stopOpacity: 1}} />
                    </linearGradient>
                    <linearGradient id="plantGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#059669', stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  
                  {/* Background - Calm Wall */}
                  <rect width="300" height="300" fill="url(#bgGradient)" rx="20" />
                  
                  {/* Window with soft light */}
                  <rect x="200" y="30" width="70" height="90" rx="8" fill={isDarkMode ? '#1e293b' : '#dbeafe'} opacity="0.6" />
                  <rect x="205" y="35" width="30" height="85" rx="4" fill={isDarkMode ? '#334155' : '#93c5fd'} opacity="0.4" />
                  <rect x="235" y="35" width="30" height="85" rx="4" fill={isDarkMode ? '#334155' : '#93c5fd'} opacity="0.4" />
                  <line x1="220" y1="35" x2="220" y2="120" stroke={isDarkMode ? '#475569' : '#60a5fa'} strokeWidth="2" opacity="0.5" />
                  <line x1="250" y1="35" x2="250" y2="120" stroke={isDarkMode ? '#475569' : '#60a5fa'} strokeWidth="2" opacity="0.5" />
                  <line x1="205" y1="77" x2="265" y2="77" stroke={isDarkMode ? '#475569' : '#60a5fa'} strokeWidth="2" opacity="0.5" />
                  
                  {/* Desk */}
                  <rect x="40" y="180" width="220" height="15" rx="3" fill="url(#deskGradient)" />
                  <rect x="45" y="195" width="8" height="80" rx="2" fill="url(#deskGradient)" />
                  <rect x="247" y="195" width="8" height="80" rx="2" fill="url(#deskGradient)" />
                  
                  {/* Laptop */}
                  <g opacity="0.95">
                    {/* Laptop base */}
                    <rect x="100" y="160" width="100" height="3" rx="1.5" fill={isDarkMode ? '#64748b' : '#94a3b8'} />
                    {/* Laptop screen */}
                    <rect x="105" y="90" width="90" height="70" rx="4" fill="url(#laptopGradient)" />
                    {/* Screen glow */}
                    <rect x="110" y="95" width="80" height="60" rx="3" fill={isDarkMode ? '#1e293b' : '#e0e7ff'} opacity="0.9" />
                    {/* Lines on screen simulating code/text */}
                    <rect x="115" y="100" width="50" height="3" rx="1.5" fill="#6366f1" opacity="0.6" />
                    <rect x="115" y="108" width="65" height="3" rx="1.5" fill="#6366f1" opacity="0.5" />
                    <rect x="115" y="116" width="45" height="3" rx="1.5" fill="#6366f1" opacity="0.6" />
                    <rect x="115" y="130" width="55" height="3" rx="1.5" fill="#8b5cf6" opacity="0.5" />
                    <rect x="115" y="138" width="40" height="3" rx="1.5" fill="#8b5cf6" opacity="0.6" />
                  </g>
                  
                  {/* Coffee mug */}
                  <g opacity="0.9">
                    <rect x="210" y="155" width="25" height="20" rx="2" fill={isDarkMode ? '#475569' : '#94a3b8'} />
                    <ellipse cx="222.5" cy="155" rx="12.5" ry="4" fill={isDarkMode ? '#334155' : '#64748b'} />
                    <path d="M 235 160 Q 243 160 243 167 Q 243 174 235 174" stroke={isDarkMode ? '#475569' : '#94a3b8'} strokeWidth="2" fill="none" />
                    {/* Steam */}
                    <path d="M 215 145 Q 217 140 215 135" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />
                    <path d="M 222 145 Q 224 138 222 133" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
                    <path d="M 229 145 Q 231 140 229 135" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />
                  </g>
                  
                  {/* Potted plant */}
                  <g opacity="0.95">
                    <rect x="50" y="160" width="30" height="15" rx="2" fill={isDarkMode ? '#dc2626' : '#f87171'} />
                    {/* Leaves */}
                    <ellipse cx="55" cy="150" rx="6" ry="10" fill="url(#plantGradient)" transform="rotate(-20 55 150)" />
                    <ellipse cx="65" cy="145" rx="7" ry="12" fill="url(#plantGradient)" transform="rotate(0 65 145)" />
                    <ellipse cx="75" cy="150" rx="6" ry="10" fill="url(#plantGradient)" transform="rotate(20 75 150)" />
                    <ellipse cx="60" cy="148" rx="5" ry="9" fill="#34d399" transform="rotate(-10 60 148)" opacity="0.8" />
                    <ellipse cx="70" cy="148" rx="5" ry="9" fill="#34d399" transform="rotate(10 70 148)" opacity="0.8" />
                  </g>
                  
                  {/* Book stack */}
                  <g opacity="0.9">
                    <rect x="240" y="168" width="18" height="4" rx="1" fill="#8b5cf6" />
                    <rect x="238" y="164" width="22" height="4" rx="1" fill="#a78bfa" />
                    <rect x="239" y="160" width="20" height="4" rx="1" fill="#c4b5fd" />
                  </g>
                </svg>
              </div>

              {/* Glassmorphism Quote Card */}
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
                className="text-center px-8 py-6 rounded-3xl backdrop-blur-xl border shadow-2xl"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.7)',
                  borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(99, 102, 241, 0.2)'
                }}
              >
                <p className="text-lg md:text-xl font-medium mb-3 leading-relaxed" style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>
                  "{quotes[currentQuoteIndex].text}"
                </p>
                <p className="text-sm mb-4" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  — {quotes[currentQuoteIndex].author}
                </p>
                
                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t" style={{ borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(99, 102, 241, 0.2)' }}>
                  <div className="flex items-center gap-2">
                    <Shield size={16} style={{ color: isDarkMode ? '#34d399' : '#10b981' }} />
                    <span className="text-xs font-semibold" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>Verified by HealthSupport</span>
                  </div>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: isDarkMode ? '#475569' : '#cbd5e1' }}></div>
                  <div className="flex items-center gap-2">
                    <Users size={16} style={{ color: isDarkMode ? '#60a5fa' : '#3b82f6' }} />
                    <span className="text-xs font-semibold" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>Community Driven</span>
                  </div>
                </div>
              </motion.div>

              {/* Quote Navigation Dots */}
              <div className="flex gap-2 mt-6">
                {quotes.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentQuoteIndex(index)}
                    className="rounded-full transition-all"
                    style={{
                      width: index === currentQuoteIndex ? '24px' : '8px',
                      height: '8px',
                      backgroundColor: index === currentQuoteIndex 
                        ? (isDarkMode ? '#e2e8f0' : '#6366f1')
                        : (isDarkMode ? '#475569' : '#cbd5e1')
                    }}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Footer Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-sm text-center relative z-10 font-medium"
              style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
            >
              Your journey to better mental health starts here ✨
            </motion.p>
          </motion.div>

          {/* Right Side - Form Section */}
          <div className="flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-12 transition-colors duration-300" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }}>
            <div className="w-full max-w-md">
              <motion.div className="card-base p-8 md:p-10 shadow-2xl backdrop-blur-sm border transition-colors duration-300" style={{
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(226, 232, 240, 0.8)'
              }} variants={containerVariants} initial="hidden" animate="visible">
                
                {/* Success Message */}
                {submitted && (
                  <motion.div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-semibold text-green-900">Success!</h4>
                      <p className="text-sm text-green-700">{isSignUp ? 'Account created successfully. Welcome!' : 'Signed in successfully!'}</p>
                    </div>
                  </motion.div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2 transition-colors duration-300" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>{isSignUp ? 'Create Account' : 'Sign In'}</h1>
                  <p className="text-sm transition-colors duration-300" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>MindEase Academic Wellness Portal</p>
                </div>

                {/* Role Selector - Only show on login, not signup */}
                {!isSignUp && (
                  <motion.div className="mb-6 flex gap-2 flex-wrap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
                    <button
                      type="button"
                      onClick={() => setUserRole('student')}
                      className={`flex-1 min-w-24 py-3 rounded-xl font-semibold transition-all ${
                        userRole === 'student'
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserRole('doctor')}
                      className={`flex-1 min-w-24 py-3 rounded-xl font-semibold transition-all ${
                        userRole === 'doctor'
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Doctor
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserRole('admin')}
                      className={`flex-1 min-w-24 py-3 rounded-xl font-semibold transition-all ${
                        userRole === 'admin'
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Admin
                    </button>
                  </motion.div>
                )}

                {/* Doctor Credentials Hint */}
                {!isSignUp && userRole === 'doctor' && (
                  <motion.div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-xs text-indigo-700 font-semibold">Demo Doctor Credentials:</p>
                    <div className="text-xs text-indigo-600 space-y-1 mt-1">
                      <p>Email: dr.sarah@gmail.com | Password: docpass123</p>
                      <p>Email: dr.michael@gmail.com | Password: docpass123</p>
                      <p>Email: dr.emily@gmail.com | Password: docpass123</p>
                    </div>
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Sign-Up Role Selection */}
                  {isSignUp && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-4 rounded-xl border transition-colors duration-300" style={{
                      background: isDarkMode ? 'linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))' : 'linear-gradient(to right, #eef2ff, #faf5ff)',
                      borderColor: isDarkMode ? 'rgba(99, 102, 241, 0.3)' : '#c7d2fe'
                    }}>
                      <label className="block text-sm font-semibold mb-3 transition-colors duration-300" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>I am a...</label>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-2 cursor-pointer flex-1">
                          <input
                            type="radio"
                            name="signupRole"
                            value="student"
                            checked={signupRole === 'student'}
                            onChange={(e) => setSignupRole(e.target.value)}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="text-sm font-medium transition-colors duration-300" style={{ color: isDarkMode ? '#cbd5e1' : '#374151' }}>Student</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer flex-1">
                          <input
                            type="radio"
                            name="signupRole"
                            value="doctor"
                            checked={signupRole === 'doctor'}
                            onChange={(e) => setSignupRole(e.target.value)}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="text-sm font-medium transition-colors duration-300" style={{ color: isDarkMode ? '#cbd5e1' : '#374151' }}>Doctor</span>
                        </label>
                      </div>
                      <p className="text-xs mt-2 transition-colors duration-300" style={{ color: isDarkMode ? '#94a3b8' : '#6b7280' }}>
                        {signupRole === 'doctor' ? '💉 You will receive a doctor dashboard after verification.' : '👨‍🎓 You will get access to all wellness features.'}
                      </p>
                    </motion.div>
                  )}

                  {/* Name Field */}
                  {isSignUp && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                      <label className="block text-sm font-semibold mb-2 transition-colors duration-300" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 transition-colors duration-300" style={{ color: isDarkMode ? '#64748b' : '#9ca3af' }} size={20} />
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-300 ${errors.name ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'focus:border-primary-500 focus:ring-2 focus:ring-primary-200'}`} style={{
                          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                          borderColor: errors.name ? '#ef4444' : (isDarkMode ? '#334155' : '#d1d5db'),
                          color: isDarkMode ? '#f1f5f9' : '#0f172a'
                        }} />
                      </div>
                      {errors.name && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.name}</p>}
                    </motion.div>
                  )}

                  {/* Email Field */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: isSignUp ? 0.1 : 0, duration: 0.4 }}>
                    <label className="block text-sm font-semibold mb-2 transition-colors duration-300" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 transition-colors duration-300" style={{ color: isDarkMode ? '#64748b' : '#9ca3af' }} size={20} />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-300 ${errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'focus:border-primary-500 focus:ring-2 focus:ring-primary-200'}`} style={{
                        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                        borderColor: errors.email ? '#ef4444' : (isDarkMode ? '#334155' : '#d1d5db'),
                        color: isDarkMode ? '#f1f5f9' : '#0f172a'
                      }} />
                    </div>
                    {errors.email && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.email}</p>}
                  </motion.div>

                  {/* Phone Field */}
                  {isSignUp && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                      <label className="block text-sm font-semibold mb-2 transition-colors duration-300" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Contact Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 transition-colors duration-300" style={{ color: isDarkMode ? '#64748b' : '#9ca3af' }} size={20} />
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-300 ${errors.phone ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'focus:border-primary-500 focus:ring-2 focus:ring-primary-200'}`} style={{
                          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                          borderColor: errors.phone ? '#ef4444' : (isDarkMode ? '#334155' : '#d1d5db'),
                          color: isDarkMode ? '#f1f5f9' : '#0f172a'
                        }} />
                      </div>
                      {errors.phone && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.phone}</p>}
                    </motion.div>
                  )}

                  {/* Student ID Field - Only for Students */}
                  {isSignUp && signupRole === 'student' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                      <label className="block text-sm font-semibold mb-2 transition-colors duration-300" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Student ID</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 transition-colors duration-300" style={{ color: isDarkMode ? '#64748b' : '#9ca3af' }} size={20} />
                        <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="e.g., STU-2024-001" className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-300 ${errors.studentId ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'focus:border-primary-500 focus:ring-2 focus:ring-primary-200'}`} style={{
                          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                          borderColor: errors.studentId ? '#ef4444' : (isDarkMode ? '#334155' : '#d1d5db'),
                          color: isDarkMode ? '#f1f5f9' : '#0f172a'
                        }} />
                      </div>
                      {errors.studentId && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.studentId}</p>}
                    </motion.div>
                  )}

                  {/* Password Field */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: isSignUp ? 0.2 : 0.1, duration: 0.4 }}>
                    <label className="block text-sm font-semibold mb-2 transition-colors duration-300" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 transition-colors duration-300" style={{ color: isDarkMode ? '#64748b' : '#9ca3af' }} size={20} />
                      <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none transition-all duration-300 ${errors.password ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'focus:border-primary-500 focus:ring-2 focus:ring-primary-200'}`} style={{
                        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                        borderColor: errors.password ? '#ef4444' : (isDarkMode ? '#334155' : '#d1d5db'),
                        color: isDarkMode ? '#f1f5f9' : '#0f172a'
                      }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 transition-colors duration-300" style={{ color: isDarkMode ? '#64748b' : '#9ca3af' }}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.password}</p>}
                  </motion.div>

                  {/* Confirm Password */}
                  {isSignUp && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
                      <label className="block text-sm font-semibold mb-2 transition-colors duration-300" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 transition-colors duration-300" style={{ color: isDarkMode ? '#64748b' : '#9ca3af' }} size={20} />
                        <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none transition-all duration-300 ${errors.confirmPassword ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'focus:border-primary-500 focus:ring-2 focus:ring-primary-200'}`} style={{
                          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                          borderColor: errors.confirmPassword ? '#ef4444' : (isDarkMode ? '#334155' : '#d1d5db'),
                          color: isDarkMode ? '#f1f5f9' : '#0f172a'
                        }} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 transition-colors duration-300" style={{ color: isDarkMode ? '#64748b' : '#9ca3af' }}>
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.confirmPassword}</p>}
                      {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className="text-green-600 text-sm mt-1 flex items-center gap-1"><CheckCircle size={14} /> Passwords match!</p>
                      )}
                    </motion.div>
                  )}

                  {/* Forgot Password & Remember Me */}
                  {!isSignUp && (
                    <motion.div className="flex items-center justify-between text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                        <span className="transition-colors duration-300" style={{ color: isDarkMode ? '#94a3b8' : '#6b7280' }}>Remember me</span>
                      </label>
                      <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">Forgot Password?</a>
                    </motion.div>
                  )}

                  {/* CAPTCHA - Login Only */}
                  {!isSignUp && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}>
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold transition-colors duration-300" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Verify CAPTCHA</label>
                        <div className="flex gap-3 items-center">
                          <div className="flex-1 border-2 rounded-lg p-4 font-bold text-3xl tracking-widest text-yellow-300 select-none flex items-center justify-center min-h-16 shadow-md transition-colors duration-300" style={{
                            backgroundColor: isDarkMode ? '#334155' : '#374151',
                            borderColor: isDarkMode ? '#475569' : '#1f2937'
                          }}>
                            {captcha.captcha}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                              let result = ''
                              for (let i = 0; i < 6; i++) {
                                result += chars.charAt(Math.floor(Math.random() * chars.length))
                              }
                              captcha.setCaptcha(result)
                              captcha.setUserInput('')
                              captcha.setIsValid(false)
                            }}
                            className="p-3 bg-gray-400 hover:bg-gray-500 rounded-lg transition-colors"
                            title="Refresh CAPTCHA"
                          >
                            <RefreshCw size={20} className="text-white" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={captcha.userInput}
                          onChange={captcha.handleInputChange}
                          placeholder="Enter the characters above"
                          maxLength="6"
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 ${
                            captcha.isValid
                              ? 'border-green-500 bg-green-50'
                              : captcha.userInput
                              ? 'border-red-500 bg-red-50'
                              : ''
                          }`}
                          style={{
                            backgroundColor: captcha.isValid ? '#f0fdf4' : (captcha.userInput ? '#fef2f2' : (isDarkMode ? '#1e293b' : '#ffffff')),
                            borderColor: captcha.isValid ? '#22c55e' : (captcha.userInput ? '#ef4444' : (isDarkMode ? '#334155' : '#d1d5db')),
                            color: isDarkMode ? '#f1f5f9' : '#0f172a'
                          }}
                        />
                        {captcha.isValid && (
                          <p className="text-green-600 text-sm font-semibold">✓ CAPTCHA verified</p>
                        )}
                        {captcha.userInput && !captcha.isValid && (
                          <p className="text-red-600 text-sm font-semibold">✗ CAPTCHA incorrect</p>
                        )}
                      </div>
                      {errors.captcha && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.captcha}</p>}
                    </motion.div>
                  )}

                  {/* Form Error */}
                  {errors.form && (
                    <motion.div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                      <p className="text-red-700 text-sm font-semibold">{errors.form}</p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button type="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: isSignUp ? 0.4 : 0.3, duration: 0.4 }} className="btn-primary w-full mt-8 disabled:opacity-50">
                    {submitted ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
                  </motion.button>
                </form>

                {/* Divider */}
                <motion.div className="flex items-center gap-3 my-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: isSignUp ? 0.5 : 0.4, duration: 0.4 }}>
                  <div className="flex-1 h-px transition-colors duration-300" style={{ backgroundColor: isDarkMode ? '#334155' : '#e5e7eb' }}></div>
                  <span className="text-sm transition-colors duration-300" style={{ color: isDarkMode ? '#94a3b8' : '#6b7280' }}>Or continue with</span>
                  <div className="flex-1 h-px transition-colors duration-300" style={{ backgroundColor: isDarkMode ? '#334155' : '#e5e7eb' }}></div>
                </motion.div>

                {/* Social Auth - Google Only */}
                <motion.button 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault()
                    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
                    googleAuthUrl.searchParams.append('client_id', '1234567890-abc123.apps.googleusercontent.com')
                    googleAuthUrl.searchParams.append('redirect_uri', window.location.origin + '/login/google/callback')
                    googleAuthUrl.searchParams.append('response_type', 'code')
                    googleAuthUrl.searchParams.append('scope', 'openid email profile')
                    window.open(googleAuthUrl.toString(), '_blank', 'width=500,height=600')
                  }}
                  className="w-full py-3 border rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                  style={{
                    borderColor: isDarkMode ? '#334155' : '#d1d5db',
                    backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
                    color: isDarkMode ? '#f1f5f9' : '#374151'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: isSignUp ? 0.6 : 0.5, duration: 0.4 }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </motion.button>

                {/* Toggle SignUp/Login */}
                <motion.p className="text-center mt-6 transition-colors duration-300" style={{ color: isDarkMode ? '#94a3b8' : '#6b7280' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: isSignUp ? 0.7 : 0.6, duration: 0.4 }}>
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button type="button" onClick={() => { setIsSignUp(!isSignUp); setErrors({}) }} className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </motion.p>

                {/* Terms */}
                {isSignUp && (
                  <motion.p className="text-xs text-center mt-4 transition-colors duration-300" style={{ color: isDarkMode ? '#94a3b8' : '#6b7280' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.4 }}>
                    By signing up, you agree to our <a href="#" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
                  </motion.p>
                )}
              </motion.div>

              {/* Emergency Support Card */}
              <motion.div className="mt-8 card-base bg-gradient-to-br from-red-50 to-orange-50 p-6 border border-red-200 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Need Emergency Support?</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">If you're experiencing a mental health crisis or having suicidal thoughts, please reach out immediately. You are not alone.</p>
                <div className="space-y-3">
                  <a href="tel:988" className="block px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all text-center shadow-md hover:shadow-lg">
                    📞 Call 988 (Suicide & Crisis Lifeline)
                  </a>
                  <a href="tel:1-800-273-8255" className="block px-4 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-all text-center shadow-md hover:shadow-lg">
                    📞 Call 1-800-273-8255
                  </a>
                  <a href="https://www.crisistextline.org/" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all text-center shadow-md hover:shadow-lg">
                    💬 Text HOME to 741741
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
