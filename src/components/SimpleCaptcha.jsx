import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export function SimpleCaptcha({ onValidChange = null }) {
  const [captcha, setCaptcha] = useState('')
  const [userInput, setUserInput] = useState('')
  const [isValid, setIsValid] = useState(false)

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptcha(result)
    setUserInput('')
    setIsValid(false)
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setUserInput(value)
    const isCorrect = value === captcha
    setIsValid(isCorrect)
    if (onValidChange) onValidChange(isCorrect)
  }

  const refreshCaptcha = () => {
    generateCaptcha()
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900">Verify CAPTCHA</label>
      <div className="flex gap-3 items-center">
        <div className="flex-1 bg-gray-700 border-2 border-gray-900 rounded-lg p-4 font-bold text-3xl tracking-widest text-yellow-300 select-none flex items-center justify-center min-h-16 shadow-md">
          {captcha}
        </div>
        <button
          type="button"
          onClick={refreshCaptcha}
          className="p-3 bg-gray-400 hover:bg-gray-500 rounded-lg transition-colors"
          title="Refresh CAPTCHA"
        >
          <RefreshCw size={20} className="text-white" />
        </button>
      </div>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Enter the characters above"
        maxLength="6"
        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
          isValid
            ? 'border-green-500 bg-green-50'
            : userInput
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300'
        }`}
      />
      {isValid && (
        <p className="text-green-600 text-sm font-semibold">✓ CAPTCHA verified</p>
      )}
      {userInput && !isValid && (
        <p className="text-red-600 text-sm font-semibold">✗ CAPTCHA incorrect</p>
      )}
    </div>
  )
}

export const useCaptcha = () => {
  const [captcha, setCaptcha] = useState('')
  const [userInput, setUserInput] = useState('')
  const [isValid, setIsValid] = useState(false)

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptcha(result)
    setUserInput('')
    setIsValid(false)
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setUserInput(value)
    setIsValid(value === captcha)
  }

  return {
    captcha,
    userInput,
    isValid,
    handleInputChange,
    setCaptcha,
    setUserInput,
    setIsValid,
  }
}
