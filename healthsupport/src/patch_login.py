import sys

with open(r"c:\Users\Asus\Desktop\Mental Health\Mental Health\MentalHealth\healthsupport\src\pages\Login.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import { useAuth } from '../context/AuthContext'\nimport { useTheme } from '../context/ThemeContext'",
    "import { useAuth } from '../context/AuthContext'\nimport { useTheme } from '../context/ThemeContext'\nimport api from '../lib/api'"
)

# 2. Add State inside Login
state_target = """  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const captcha = useCaptcha()

  // Inspirational quotes for the left sidebar"""

state_replacement = """  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const captcha = useCaptcha()

  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1)
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' })
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState('')
  const [forgotPasswordError, setForgotPasswordError] = useState('')

  const handleForgotPasswordEmail = async () => {
    if (!forgotPasswordData.email) {
      setForgotPasswordError('Email is required')
      return;
    }
    try {
      setForgotPasswordError('')
      setForgotPasswordMsg('')
      await api.post('/auth/forgot-password', { email: forgotPasswordData.email })
      setForgotPasswordMsg('OTP sent to your email.')
      setForgotPasswordStep(2)
      
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      captcha.setCaptcha(result)
      captcha.setUserInput('')
      captcha.setIsValid(false)
    } catch (err) {
      setForgotPasswordError(err.response?.data || 'Failed to send OTP')
    }
  }

  const handleResetPasswordSubmit = async () => {
    try {
      setForgotPasswordError('')
      setForgotPasswordMsg('')
      if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
         setForgotPasswordError('Passwords do not match')
         return
      }
      if (!captcha.isValid) {
         setForgotPasswordError('Please verify CAPTCHA')
         return
      }
      await api.post('/auth/reset-password', {
         email: forgotPasswordData.email,
         otp: forgotPasswordData.otp,
         newPassword: forgotPasswordData.newPassword
      })
      setForgotPasswordMsg('Password reset successfully! You can now log in.')
      setTimeout(() => {
         setIsForgotPassword(false)
         setForgotPasswordStep(1)
         setForgotPasswordData({ email: '', otp: '', newPassword: '', confirmPassword: '' })
         setForgotPasswordMsg('')
      }, 3000)
    } catch (err) {
      setForgotPasswordError(typeof err.response?.data === 'string' ? err.response?.data : 'Failed to reset password')
    }
  }

  // Inspirational quotes for the left sidebar"""
content = content.replace(state_target, state_replacement)

# 3. Update handleSubmit
handle_submit_target = """  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length === 0) {
      try {
        if (isSignUp) {
          if (userRole === 'admin') {
            setErrors({ form: 'Admins cannot self-register. Contact system administrator.' })
            return
          }
          signup({"""

handle_submit_replacement = """  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length === 0) {
      try {
        if (isSignUp) {
          if (userRole === 'admin') {
            setErrors({ form: 'Admins cannot self-register. Contact system administrator.' })
            return
          }
          await signup({"""
content = content.replace(handle_submit_target, handle_submit_replacement)

handle_submit_target2 = """        } else {
          // Call login function from AuthContext
          const loggedInUser = login(formData.email, formData.password, userRole)
          setSubmitted(true)"""
handle_submit_replacement2 = """        } else {
          // Call login function from AuthContext
          const loggedInUser = await login(formData.email, formData.password, userRole)
          setSubmitted(true)"""
content = content.replace(handle_submit_target2, handle_submit_replacement2)

# 4. Forgot password layout wrap
wrap_target1 = """                {/* Success Message */}
                {submitted && ("""

wrap_replacement1 = """                {isForgotPassword ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-left w-full">
                    <h2 className="text-2xl font-bold mb-4 transition-colors duration-300" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Change your Password</h2>
                    
                    {forgotPasswordMsg && (
                      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-sm text-green-700 font-semibold">{forgotPasswordMsg}</p>
                      </div>
                    )}
                    {forgotPasswordError && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-sm text-red-700 font-semibold">{forgotPasswordError}</p>
                      </div>
                    )}

                    {forgotPasswordStep === 1 ? (
                      <div>
                        <p className="text-sm mb-6 transition-colors duration-300" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                          Password is case-sensitive and must be at least 6 characters. A good password should contain a combination of upper-case and lower-case letters, numbers and symbols. Allowed special characters are @#-_$%^&+=§!?
                        </p>
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Enter your Email (Against which you want to reset password)</label>
                          <input type="email" value={forgotPasswordData.email} onChange={(e) => setForgotPasswordData({...forgotPasswordData, email: e.target.value})} className="w-full px-4 py-3 border rounded-xl bg-blue-50 focus:outline-none focus:ring-2 focus:ring-primary-500" style={{ borderColor: isDarkMode ? '#334155' : '#d1d5db', color: isDarkMode ? '#1e293b' : '#0f172a' }} />
                        </div>
                        <button type="button" onClick={handleForgotPasswordEmail} className="btn-primary w-full mt-2">Send OTP</button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Enter OTP</label>
                          <input type="text" value={forgotPasswordData.otp} onChange={(e) => setForgotPasswordData({...forgotPasswordData, otp: e.target.value})} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" style={{ borderColor: isDarkMode ? '#334155' : '#d1d5db', backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', color: isDarkMode ? '#f1f5f9' : '#0f172a'}} />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Enter your new password</label>
                          <input type="password" value={forgotPasswordData.newPassword} onChange={(e) => setForgotPasswordData({...forgotPasswordData, newPassword: e.target.value})} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" style={{ borderColor: isDarkMode ? '#334155' : '#d1d5db', backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', color: isDarkMode ? '#f1f5f9' : '#0f172a'}} />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Re-enter the new password</label>
                          <input type="password" value={forgotPasswordData.confirmPassword} onChange={(e) => setForgotPasswordData({...forgotPasswordData, confirmPassword: e.target.value})} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" style={{ borderColor: isDarkMode ? '#334155' : '#d1d5db', backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', color: isDarkMode ? '#f1f5f9' : '#0f172a'}} />
                        </div>
                        
                        <div className="pt-2">
                          <label className="block text-sm font-semibold mb-2 transition-colors duration-300" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Verification *</label>
                          <div className="flex gap-3 items-center mb-3">
                            <input type="text" value={captcha.userInput} onChange={captcha.handleInputChange} placeholder="Enter the characters" maxLength="6" className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 ${captcha.isValid ? 'border-green-500' : (captcha.userInput ? 'border-red-500' : '')}`} style={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderColor: isDarkMode ? '#334155' : '#d1d5db', color: isDarkMode ? '#f1f5f9' : '#0f172a' }} />
                            <div className="w-32 border-2 rounded-lg p-2 font-bold text-xl tracking-widest text-indigo-800 bg-indigo-200 select-none flex items-center justify-center min-h-12 shadow-sm transition-colors duration-300">
                              {captcha.captcha}
                            </div>
                            <button type="button" onClick={() => {
                                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                                let result = ''
                                for (let i = 0; i < 6; i++) {
                                  result += chars.charAt(Math.floor(Math.random() * chars.length))
                                }
                                captcha.setCaptcha(result)
                                captcha.setUserInput('')
                                captcha.setIsValid(false)
                              }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Refresh CAPTCHA">
                              <RefreshCw size={24} />
                            </button>
                          </div>
                          <p className="text-xs transition-colors duration-300" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>Please enter the characters you see in the image. Input is case sensitive.</p>
                        </div>
                        
                        <button type="button" onClick={handleResetPasswordSubmit} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 mt-4 px-6 rounded-lg w-auto min-w-[200px]">Change Password</button>
                      </div>
                    )}
                    
                    <button type="button" onClick={() => setIsForgotPassword(false)} className="mt-6 text-sm font-semibold text-slate-500 hover:text-slate-700 w-full text-center">
                      Cancel & Back to Login
                    </button>
                  </motion.div>
                ) : (
                  <>
                {/* Success Message */}
                {submitted && ("""
content = content.replace(wrap_target1, wrap_replacement1)

wrap_target2 = """                )}
              </motion.div>"""
wrap_replacement2 = """                )}
                </>
                )}
              </motion.div>"""
content = "".join(content.rsplit(wrap_target2, 1)) + wrap_replacement2

# 5. Forgot password button trigger
btn_target = """<a href="#" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">Forgot Password?</a>"""
btn_replacement = """<button type="button" onClick={() => { setIsForgotPassword(true); setForgotPasswordStep(1); setErrors({}); }} className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">Forgot Password?</button>"""
content = content.replace(btn_target, btn_replacement)

with open(r"c:\Users\Asus\Desktop\Mental Health\Mental Health\MentalHealth\healthsupport\src\pages\Login.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("SUCCESS")
