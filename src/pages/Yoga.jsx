import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../layouts/Layout'
import AIAssistant from '../components/AIAssistant'
import { Wind, Activity, Play, CheckCircle2, RotateCcw, Timer, Target, Zap, ArrowLeft, Brain, Square, Pause } from 'lucide-react'

// Motivational Quotes (shared resource)
const motivationalQuotes = [
  'One breath at a time',
  'You are stronger than your stress',
  'Progress over perfection',
  'Breathe. You got this.',
  'Small steps lead to big changes',
  'Your mind deserves this rest',
  'Peace is within you',
  'Every moment is a fresh start',
  'You are healing',
  'Calm is your superpower',
  'This too shall pass',
  'Focus on what you can control',
  'Your body knows how to relax',
  'You deserve to take care of yourself'
]

// Independent Exercise Card Component
function ExerciseCard({ exercise, color = 'indigo', duration = 120, onStart, activeCardId, cardId }) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const timerRef = useRef(null)
  const quoteTimerRef = useRef(null)

  // Stop timer if another card becomes active
  useEffect(() => {
    if (activeCardId && activeCardId !== cardId && isActive) {
      setIsActive(false)
      setTimeLeft(0)
      clearInterval(timerRef.current)
      clearInterval(quoteTimerRef.current)
    }
  }, [activeCardId, cardId, isActive])

  // Timer countdown
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      playCompletionSound()
    }
    return () => clearInterval(timerRef.current)
  }, [isActive, timeLeft])

  // Quote rotation (only when active) - 10 second fade
  useEffect(() => {
    if (isActive) {
      quoteTimerRef.current = setInterval(() => {
        setCurrentQuoteIndex(prev => (prev + 1) % motivationalQuotes.length)
      }, 10000)
    }
    return () => clearInterval(quoteTimerRef.current)
  }, [isActive])

  const playCompletionSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3')
    audio.volume = 0.4
    audio.play()
  }

  const startTimer = () => {
    if (onStart) onStart(cardId) // Notify parent to stop other timers
    setTimeLeft(duration)
    setIsActive(true)
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(0)
  }

  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      btn: 'bg-indigo-600 hover:bg-indigo-700',
      quote: 'text-indigo-500'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      btn: 'bg-green-600 hover:bg-green-700',
      quote: 'text-green-500'
    }
  }

  const colors = colorClasses[color] || colorClasses.indigo

  return (
    <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-lg transition-all" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
      {exercise.imageUrl && (
        <div className="w-full h-40 rounded-2xl mb-4 overflow-hidden">
          <img src={exercise.imageUrl} alt={exercise.title} className="w-full h-full object-cover" />
        </div>
      )}
      {exercise.image && (
        <img src={exercise.image} alt={exercise.title} className="w-full h-40 object-cover rounded-2xl mb-4" />
      )}
      <h4 className="text-lg font-bold text-slate-900 mb-1" style={{ color: 'var(--text-primary)' }}>{exercise.title}</h4>
      
      {/* Fixed-height quote container to prevent layout shift */}
      <div className="min-h-[2.5rem] relative mb-2">
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.p
              key={currentQuoteIndex}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className={`text-xs italic ${colors.quote} absolute top-0 left-0 right-0`}
            >
              "{motivationalQuotes[currentQuoteIndex]}"
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      <p className="text-slate-600 text-sm mb-4">{exercise.description || exercise.detail}</p>
      
      {/* Unified Timer Display - Matching Built-in Format */}
      {timeLeft > 0 ? (
        <div className="flex items-center gap-2">
          <span className={`text-3xl font-mono font-black ${colors.text} ${colors.bg} px-6 py-3 rounded-2xl flex items-center gap-2`}>
            <Timer size={24} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
          <button
            onClick={toggleTimer}
            className="p-4 bg-slate-900 text-white rounded-2xl font-black"
          >
            {isActive ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={resetTimer}
            className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"
          >
            <Square size={24} fill="currentColor" />
          </button>
        </div>
      ) : (
        <button
          onClick={startTimer}
          className={`w-full px-6 py-3 text-white rounded-2xl font-black ${colors.btn} shadow-lg flex items-center justify-center gap-2`}
        >
          <Play size={20} fill="currentColor" /> Start Practice
        </button>
      )}
    </div>
  )
}

export default function Yoga() {
  const [view, setView] = useState('selection') // 'selection', 'stress-busters', or 'relax'
  const [activeStep, setActiveStep] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [stressBusters, setStressBusters] = useState([])
  const [yogaTechniques, setYogaTechniques] = useState([])
  const [activeCardId, setActiveCardId] = useState(null) // Track which card timer is active
  const timerRef = useRef(null)
  const quoteTimerRef = useRef(null)

  // Load admin-added content from localStorage
  useEffect(() => {
    const loadedStressBusters = localStorage.getItem('stress_busters')
    const loadedYogaTechniques = localStorage.getItem('yoga_techniques')
    
    if (loadedStressBusters) {
      setStressBusters(JSON.parse(loadedStressBusters))
    }
    if (loadedYogaTechniques) {
      setYogaTechniques(JSON.parse(loadedYogaTechniques))
    }
  }, [])

  // Timer for main exercises
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000)
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      playCompletionSound()
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isTimerRunning, timeLeft])

  // Quote rotation for main exercises (only when timer is running) - 10 second fade
  useEffect(() => {
    if (isTimerRunning && activeStep) {
      quoteTimerRef.current = setInterval(() => {
        setCurrentQuoteIndex(prev => (prev + 1) % motivationalQuotes.length)
      }, 10000)
    } else {
      clearInterval(quoteTimerRef.current)
    }
    return () => clearInterval(quoteTimerRef.current)
  }, [isTimerRunning, activeStep])

  const mentalPath = {
    title: "Breathe & Clear (Pranayama)",
    subtitle: "Focus on calming the mind and resetting your neurochemistry.",
    icon: Brain,
    steps: [
      { 
        id: 'm1', 
        title: 'Box Breathing', 
        detail: 'Inhale 4, Hold 4, Exhale 4, Hold 4. The Navy SEAL technique for instant calm.', 
        seconds: 120, 
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800' 
      },
      { 
        id: 'm2', 
        title: 'Academic Stress Scan', 
        detail: 'Slowly scan from head to toe, releasing tension in the jaw and forehead.', 
        seconds: 300, 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_snAwH9Wvx7DiHtPl70GYZO_U_ARpVV8sRw&s' 
      }
    ]
  }

  const physicalPath = {
    title: "Desk Fatigue Reset",
    subtitle: "Fix back pain and neck strain from long study sessions.",
    icon: Activity,
    steps: [
      { 
        id: 'p1', 
        title: 'The Great Back Release', 
        detail: 'A seated spinal twist to unlock your lower back and improve posture.', 
        seconds: 60, 
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800' 
      },
      { 
        id: 'p2', 
        title: 'Neck & Shoulder Softener', 
        detail: 'Gentle neck rolls and shoulder drops to melt away desk-bound fatigue.', 
        seconds: 60, 
        image: 'https://www.shutterstock.com/image-vector/woman-doing-neck-stretch-exercise-260nw-2284184087.jpg' 
      }
    ]
  }

  // Handle card timer start (stops built-in timer and other card timers)
  const handleCardTimerStart = (cardId) => {
    setActiveCardId(cardId)
    // Stop built-in exercise timer if running
    if (activeStep) {
      stopPractice()
    }
  }

  // Practice start/stop handlers for built-in exercises
  const startPractice = (step) => {
    setActiveCardId(null) // Stop all card timers
    setActiveStep(step.id)
    setTimeLeft(step.seconds)
    setTotalTime(step.seconds)
    setIsTimerRunning(true)
  }

  const stopPractice = () => {
    setActiveStep(null)
    setTimeLeft(0)
    setTotalTime(0)
    setIsTimerRunning(false)
    setCurrentQuoteIndex(0)
    clearInterval(timerRef.current)
    clearInterval(quoteTimerRef.current)
  }

  // Motivational Quote Display Component (only shows when timer is active)
  const QuoteDisplay = ({ color = 'indigo' }) => {
    const colorMap = {
      indigo: 'var(--primary-blue)',
      green: '#22c55e'
    }
    return (
      <div className="min-h-[2.5rem] relative mb-2">
        <AnimatePresence mode="wait">
          {isTimerRunning && activeStep && (
            <motion.p
              key={currentQuoteIndex}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="text-xs italic absolute top-0 left-0 right-0"
              style={{ color: colorMap[color] }}
            >
              "{motivationalQuotes[currentQuoteIndex]}"
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Unified Timer Display Component
  const playCompletionSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3')
    audio.volume = 0.4
    audio.play()
  }

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 md:py-20 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="max-w-4xl mx-auto">
          
          <AnimatePresence mode="wait">
            {view === 'selection' && (
              <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <h1 className="text-4xl font-black mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>Choose Your Path</h1>
                <p className="mb-12 italic text-lg" style={{ color: 'var(--text-secondary)' }}>"Build a fresh day with proven wellness techniques"</p>
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                  <button onClick={() => setView('stress-busters')} className="p-10 border-2 rounded-[3rem] shadow-sm hover:shadow-xl transition-all group" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--primary-blue)' }}>
                      <Zap size={40} fill="currentColor" />
                    </div>
                    <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Stress Busters</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Breathing, meditation & quick relief</p>
                  </button>
                  <button onClick={() => setView('relax')} className="p-10 border-2 rounded-[3rem] shadow-sm hover:shadow-xl transition-all group" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'var(--bg-tertiary)', color: '#22c55e' }}>
                      <Activity size={48} />
                    </div>
                    <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Relax</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Yoga, stretches & physical relief</p>
                  </button>
                </div>
              </motion.div>
            )}

            {view === 'stress-busters' && (
              <motion.div key="stress-busters" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <button onClick={() => { setView('selection'); stopPractice(); }} className="flex items-center gap-2 font-bold transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  <ArrowLeft size={20} /> Back to choices
                </button>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--primary-blue)' }}>
                    <Zap size={32} fill="currentColor" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Stress Busters</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Breathing techniques & mindfulness to calm your mind (Built-in + Admin-added)</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Built-in Mental Path Exercises */}
                  <div>
                    <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Breathing & Pranayama</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {mentalPath.steps.map((step) => (
                        <div key={step.id} className="border-2 rounded-[2rem] p-6 shadow-sm hover:shadow-lg transition-all" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                          <img src={step.image} alt={step.title} className="w-full h-40 object-cover rounded-2xl mb-4" />
                          <h4 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{step.title}</h4>
                          <QuoteDisplay color="indigo" />
                          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{step.detail}</p>
                          {activeStep === step.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-3xl font-mono font-black rounded-2xl flex items-center gap-2 px-6 py-3" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--primary-blue)' }}>
                                <Timer size={24} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                              </span>
                              <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="p-4 rounded-2xl font-black text-white" style={{ backgroundColor: 'var(--primary-blue)' }}>
                                {isTimerRunning ? <Pause size={24} /> : <Play size={24} />}
                              </button>
                              <button onClick={stopPractice} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors">
                                <Square size={24} fill="currentColor" />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => startPractice(step)} className="w-full px-6 py-3 text-white rounded-2xl font-black bg-indigo-600 shadow-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
                              <Play size={20} fill="currentColor" /> Start Practice
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Admin-Added Stress Busters */}
                  {stressBusters.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-700 mb-4">Quick Techniques (from Wellness Team)</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {stressBusters.map((buster) => (
                          <ExerciseCard
                            key={buster.id}
                            cardId={buster.id}
                            exercise={buster}
                            color="indigo"
                            duration={120}
                            onStart={handleCardTimerStart}
                            activeCardId={activeCardId}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {view === 'relax' && (
              <motion.div key="relax" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <button onClick={() => { setView('selection'); stopPractice(); }} className="flex items-center gap-2 font-bold transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  <ArrowLeft size={20} /> Back to choices
                </button>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--bg-tertiary)', color: '#22c55e' }}>
                    <Activity size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Relax</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Yoga poses & physical stretches for wellness (Built-in + Admin-added)</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Built-in Physical Path Exercises */}
                  <div>
                    <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Desk Fatigue Relief</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {physicalPath.steps.map((step) => (
                        <div key={step.id} className="border-2 rounded-[2rem] p-6 shadow-sm hover:shadow-lg transition-all" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                          <img src={step.image} alt={step.title} className="w-full h-40 object-cover rounded-2xl mb-4" />
                          <h4 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{step.title}</h4>
                          <QuoteDisplay color="green" />
                          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{step.detail}</p>
                          {activeStep === step.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-3xl font-mono font-black rounded-2xl flex items-center gap-2 px-6 py-3" style={{ backgroundColor: 'var(--bg-tertiary)', color: '#22c55e' }}>
                                <Timer size={24} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                              </span>
                              <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="p-4 rounded-2xl font-black text-white" style={{ backgroundColor: 'var(--primary-blue)' }}>
                                {isTimerRunning ? <Pause size={24} /> : <Play size={24} />}
                              </button>
                              <button onClick={stopPractice} className="p-4 rounded-2xl hover:transition-colors" style={{ backgroundColor: 'var(--bg-tertiary)', color: '#ef4444' }}>
                                <Square size={24} fill="currentColor" />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => startPractice(step)} className="w-full px-6 py-3 text-white rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 transition-colors" style={{ backgroundColor: '#22c55e' }}>
                              <Play size={20} fill="currentColor" /> Start Practice
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Admin-Added Yoga Techniques */}
                  {yogaTechniques.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-700 mb-4">Yoga Techniques (from Wellness Team)</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {yogaTechniques.map((technique) => (
                          <ExerciseCard
                            key={technique.id}
                            cardId={technique.id}
                            exercise={technique}
                            color="green"
                            duration={120}
                            onStart={handleCardTimerStart}
                            activeCardId={activeCardId}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {timeLeft === 0 && activeStep && !isTimerRunning && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-10 py-5 rounded-full shadow-2xl flex items-center gap-4 z-50 border border-slate-700">
              <CheckCircle2 className="text-green-400" size={24} />
              <span className="font-black">Session Finished!</span>
              <button onClick={stopPractice} className="text-slate-400 hover:text-white"><RotateCcw size={20} /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Wellness Assistant */}
      <AIAssistant />
    </Layout>
  )
}