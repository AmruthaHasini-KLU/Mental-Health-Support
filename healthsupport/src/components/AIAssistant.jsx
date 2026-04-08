import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, ArrowRight, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hi! I'm your wellness assistant. I can help you find stress relief exercises, breathing techniques, or connect you with a therapist. What's on your mind?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // AI Response Logic
  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()

    // Homesickness/Loneliness Keywords
    if (lowerMessage.includes('homesick') || lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('miss') || lowerMessage.includes('family')) {
      const gratitudeTechniques = getStressBusters().filter(ex => 
        ex.title.toLowerCase().includes('gratitude') || 
        ex.description?.toLowerCase().includes('gratitude')
      )
      return {
        type: 'exercise_suggestion',
        text: "I understand feeling disconnected can be challenging. Gratitude practices help foster connection and positive emotions. Here's what I recommend:",
        exercises: gratitudeTechniques.length > 0 ? gratitudeTechniques : getStressBusters()
      }
    }

    // Financial Stress Keywords
    if (lowerMessage.includes('money') || lowerMessage.includes('financial') || lowerMessage.includes('afford') || lowerMessage.includes('budget')) {
      return {
        type: 'combined',
        text: "Financial stress is common among students. Let me help with both immediate relief and professional support:",
        exercises: getStressBusters().slice(0, 2),
        doctors: getActiveDoctors().filter(doc => 
          doc.specialization?.toLowerCase().includes('stress') || 
          doc.specialization?.toLowerCase().includes('anxiety')
        )
      }
    }

    // Social/Peer Pressure Keywords
    if (lowerMessage.includes('peer pressure') || lowerMessage.includes('social') || lowerMessage.includes('friends') || lowerMessage.includes('fitting in')) {
      return {
        type: 'exercise_suggestion',
        text: "Social pressures can be overwhelming. These mindfulness exercises help you reconnect with your authentic self:",
        exercises: [...getStressBusters(), ...getYogaTechniques()].slice(0, 3)
      }
    }

    // Stress/Anxiety Keywords
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('panic')) {
      return {
        type: 'exercise_suggestion',
        text: "I understand you're feeling stressed. I recommend trying one of our breathing exercises. They're scientifically proven to calm your nervous system in just 2 minutes.",
        exercises: getStressBusters()
      }
    }

    // Breathing/Meditation Keywords
    if (lowerMessage.includes('breath') || lowerMessage.includes('meditat') || lowerMessage.includes('calm') || lowerMessage.includes('relax')) {
      return {
        type: 'exercise_suggestion',
        text: "Perfect! Breathing exercises are incredibly effective. Here are some techniques I recommend:",
        exercises: getStressBusters()
      }
    }

    // Yoga/Physical Keywords
    if (lowerMessage.includes('yoga') || lowerMessage.includes('stretch') || lowerMessage.includes('physical') || lowerMessage.includes('body') || lowerMessage.includes('posture')) {
      return {
        type: 'exercise_suggestion',
        text: "Great choice! Yoga and stretching can release physical tension. Check out these techniques:",
        exercises: getYogaTechniques()
      }
    }

    // Therapist/Counseling Keywords
    if (lowerMessage.includes('therapist') || lowerMessage.includes('counselor') || lowerMessage.includes('talk') || lowerMessage.includes('doctor') || lowerMessage.includes('professional help')) {
      return {
        type: 'doctor_referral',
        text: "I can help you connect with one of our licensed therapists. Here are our available professionals:",
        doctors: getActiveDoctors()
      }
    }

    // Sleep Keywords
    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired') || lowerMessage.includes('rest')) {
      return {
        type: 'exercise_suggestion',
        text: "Sleep is crucial for mental health. Try these relaxation techniques before bed:",
        exercises: [...getStressBusters(), ...getYogaTechniques()]
      }
    }

    // Default Response
    return {
      type: 'general',
      text: "I can help you with:\n• Breathing exercises for stress relief\n• Yoga techniques for physical wellness\n• Connecting you with a licensed therapist\n\nWhat would you like to explore?"
    }
  }

  // Fetch Stress Busters from localStorage
  const getStressBusters = () => {
    const stored = localStorage.getItem('stress_busters')
    if (stored) {
      return JSON.parse(stored).slice(0, 3) // Return max 3
    }
    // Default exercises if none in storage
    return [
      { id: 'default1', title: 'Box Breathing', description: 'Inhale 4, Hold 4, Exhale 4, Hold 4' },
      { id: 'default2', title: 'Deep Breathing', description: 'Take 5 deep breaths, hold for 4 seconds each time' }
    ]
  }

  // Fetch Yoga Techniques from localStorage
  const getYogaTechniques = () => {
    const stored = localStorage.getItem('yoga_techniques')
    if (stored) {
      return JSON.parse(stored).slice(0, 3)
    }
    return [
      { id: 'default3', title: 'Neck Stretches', description: 'Gentle neck rolls to release tension' },
      { id: 'default4', title: 'Shoulder Relaxation', description: 'Drop and roll shoulders to melt stress' }
    ]
  }

  // Fetch Active Doctors from localStorage
  const getActiveDoctors = () => {
    const stored = localStorage.getItem('healthsupport_doctors')
    if (stored) {
      const doctors = JSON.parse(stored)
      return doctors.filter(doc => doc.active).slice(0, 3)
    }
    // Default doctors
    return [
      { id: 1, name: 'Dr. Aisha Rahman', specialization: 'Academic Burnout Specialist' },
      { id: 2, name: 'Dr. Luis Moreno', specialization: 'High-Anxiety & Stress Management' },
      { id: 3, name: 'Dr. Hannah Park', specialization: 'Clinical Sleep Specialist' }
    ]
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue)
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        ...aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleStartPractice = () => {
    navigate('/yoga')
    setIsOpen(false)
  }

  const handleBookTherapist = () => {
    navigate('/therapy')
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageCircle size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-20 right-6 z-50 w-80 h-[450px] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Sparkles size={18} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-base">AI Wellness</h3>
                <p className="text-xs text-indigo-100">Here to help</p>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
              {messages.map((message) => {
                const isUser = message.type === 'user'
                return (
                  <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${isUser ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200'} rounded-xl p-3 shadow-sm`}>
                      {message.type === 'ai' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={16} className="text-indigo-600" />
                          <span className="text-xs font-bold text-slate-500">AI Assistant</span>
                        </div>
                      )}
                      <p className={isUser ? 'text-sm text-white whitespace-pre-line' : 'text-sm text-slate-700 whitespace-pre-line'}>
                        {message.text}
                      </p>

                    {/* Exercise Suggestions */}
                    {message.type === 'ai' && message.exercises && message.exercises.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {message.exercises.map((exercise) => (
                          <div key={exercise.id} className="bg-indigo-50 border border-indigo-200 rounded-lg p-2">
                            <h4 className="font-bold text-xs text-indigo-900">{exercise.title}</h4>
                            <p className="text-xs text-indigo-600 mt-0.5">{exercise.description}</p>
                          </div>
                        ))}
                        <button
                          onClick={handleStartPractice}
                          className="w-full mt-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <ArrowRight size={14} /> Start Practice
                        </button>
                      </div>
                    )}

                    {/* Doctor Referrals */}
                    {message.type === 'ai' && message.doctors && message.doctors.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {message.doctors.map((doctor) => (
                          <div key={doctor.id} className="bg-green-50 border border-green-200 rounded-lg p-2 flex items-start gap-2">
                            <div className="p-1.5 bg-green-100 rounded-lg">
                              <User size={16} className="text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-xs text-green-900">{doctor.name}</h4>
                              <p className="text-xs text-green-600 mt-0.5">{doctor.specialization}</p>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={handleBookTherapist}
                          className="w-full mt-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <ArrowRight size={14} /> Book Appointment
                        </button>
                      </div>
                    )}

                      <span className="text-xs text-slate-400 mt-2 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
