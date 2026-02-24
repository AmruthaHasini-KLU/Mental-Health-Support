import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Layout from '../layouts/Layout'
import { Mail, Lock, User, Eye, EyeOff, Phone, AlertCircle, CheckCircle, RefreshCw, Sparkles } from 'lucide-react'
import { useCaptcha } from '../components/SimpleCaptcha'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signup, login } = useAuth()
  
  const [isSignUp, setIsSignUp] = useState(false)
  const [userRole, setUserRole] = useState('student') // 'student' or 'admin'
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
          })
          setSubmitted(true)
          setTimeout(() => {
            navigate('/dashboard')
          }, 1500)
        } else {
          // Call login function from AuthContext
          login(formData.email, formData.password, userRole)
          setSubmitted(true)
          setTimeout(() => {
            navigate(userRole === 'admin' ? '/admin-dashboard' : '/dashboard')
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
      <section className="min-h-screen bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          
          {/* Left Side - Calming Nature Section */}
          <motion.div 
            className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -ml-48 -mb-48"></div>
            
            {/* Logo/Branding */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles size={24} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">MindEase</h2>
                  <p className="text-xs text-primary-100">Wellness Portal</p>
                </div>
              </div>
            </motion.div>

            {/* Center Content - Beautiful Nature-inspired Visual & Quote */}
            <motion.div
              className="relative z-10 flex flex-col items-center justify-center py-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {/* Nature Themed Illustration Container */}
              <div className="relative w-64 h-64 mb-8">
                {/* Circular gradient background simulating nature */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary-300 to-primary-600 rounded-full opacity-20 blur-2xl"></div>
                
                {/* Simple nature-inspired SVG illustration */}
                <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
                  {/* Sky */}
                  <defs>
                    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#e0f2ff', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#b3e5fc', stopOpacity: 1}} />
                    </linearGradient>
                    <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#ffd54f', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#ffb74d', stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  
                  {/* Sky background */}
                  <rect width="200" height="200" fill="url(#skyGradient)" />
                  
                  {/* Sun */}
                  <circle cx="170" cy="30" r="20" fill="url(#sunGradient)" />
                  
                  {/* Mountains */}
                  <polygon points="0,140 60,80 120,130 200,70 200,200 0,200" fill="#10b981" opacity="0.8" />
                  <polygon points="0,160 50,110 110,160 200,110 200,200 0,200" fill="#059669" opacity="0.7" />
                  
                  {/* Trees */}
                  <g opacity="0.9">
                    <polygon points="40,130 35,100 45,100" fill="#047857" />
                    <rect x="38" y="130" width="4" height="15" fill="#6b4423" />
                    
                    <polygon points="160,140 155,115 165,115" fill="#047857" />
                    <rect x="158" y="140" width="4" height="15" fill="#6b4423" />
                  </g>
                </svg>
              </div>

              {/* Animated Quote */}
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <p className="text-xl md:text-2xl font-light text-white mb-3 leading-relaxed italic">
                  "{quotes[currentQuoteIndex].text}"
                </p>
                <p className="text-sm text-primary-100">
                  — {quotes[currentQuoteIndex].author}
                </p>
              </motion.div>

              {/* Quote Navigation Dots */}
              <div className="flex gap-2 mt-6">
                {quotes.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentQuoteIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentQuoteIndex ? 'bg-white w-6' : 'bg-primary-300'
                    }`}
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
              className="text-sm text-primary-100 text-center relative z-10"
            >
              Your journey to better mental health starts here
            </motion.p>
          </motion.div>

          {/* Right Side - Form Section */}
          <div className="flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-12">
            <div className="w-full max-w-md">
              <motion.div className="card-base bg-white p-8 md:p-10 shadow-lg" variants={containerVariants} initial="hidden" animate="visible">
                
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
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{isSignUp ? 'Create Account' : 'Sign In'}</h1>
                  <p className="text-gray-600 text-sm">MindEase Academic Wellness Portal</p>
                </div>

                {/* Role Selector - Only show on login, not signup */}
                {!isSignUp && (
                  <motion.div className="mb-6 flex gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
                    <button
                      type="button"
                      onClick={() => setUserRole('student')}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                        userRole === 'student'
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserRole('admin')}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                        userRole === 'admin'
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Admin
                    </button>
                  </motion.div>
                )}

                {/* Admin Credentials Hint */}
                {!isSignUp && userRole === 'admin' && (
                  <motion.div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-xs text-blue-700 font-semibold">Demo Admin Credentials:</p>
                    <p className="text-xs text-blue-600 mt-1">Email: admin@healthsupport.com</p>
                    <p className="text-xs text-blue-600">Password: Admin@123</p>
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Field */}
                  {isSignUp && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all ${errors.name ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'}`} />
                      </div>
                      {errors.name && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.name}</p>}
                    </motion.div>
                  )}

                  {/* Email Field */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: isSignUp ? 0.1 : 0, duration: 0.4 }}>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all ${errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'}`} />
                    </div>
                    {errors.email && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.email}</p>}
                  </motion.div>

                  {/* Phone Field */}
                  {isSignUp && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all ${errors.phone ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'}`} />
                      </div>
                      {errors.phone && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.phone}</p>}
                    </motion.div>
                  )}

                  {/* Password Field */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: isSignUp ? 0.2 : 0.1, duration: 0.4 }}>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                      <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none transition-all ${errors.password ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.password}</p>}
                  </motion.div>

                  {/* Confirm Password */}
                  {isSignUp && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none transition-all ${errors.confirmPassword ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'}`} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
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
                        <span className="text-gray-600">Remember me</span>
                      </label>
                      <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">Forgot Password?</a>
                    </motion.div>
                  )}

                  {/* CAPTCHA - Login Only */}
                  {!isSignUp && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}>
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900">Verify CAPTCHA</label>
                        <div className="flex gap-3 items-center">
                          <div className="flex-1 bg-gray-700 border-2 border-gray-900 rounded-lg p-4 font-bold text-3xl tracking-widest text-yellow-300 select-none flex items-center justify-center min-h-16 shadow-md">
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
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                            captcha.isValid
                              ? 'border-green-500 bg-green-50'
                              : captcha.userInput
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-300'
                          }`}
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
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm text-gray-600">Or continue with</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
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
                  className="w-full py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-semibold text-gray-700"
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
                <motion.p className="text-center text-gray-600 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: isSignUp ? 0.7 : 0.6, duration: 0.4 }}>
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button type="button" onClick={() => { setIsSignUp(!isSignUp); setErrors({}) }} className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </motion.p>

                {/* Terms */}
                {isSignUp && (
                  <motion.p className="text-xs text-gray-600 text-center mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.4 }}>
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
