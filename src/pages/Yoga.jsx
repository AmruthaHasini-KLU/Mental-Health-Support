import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../layouts/Layout'
import { Wind, Activity, Play, CheckCircle2, RotateCcw, Timer, Target, Zap, Square, Pause } from 'lucide-react'

export default function Yoga() {
  const [activeStep, setActiveStep] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const timerRef = useRef(null)

  // Calming chime for a successful session
  const playCompletionSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3')
    audio.volume = 0.4
    audio.play()
  }

  const routines = [
    {
      title: "Hey, let's build a fresh day!",
      subtitle: "Feeling back pain from stress? Let's fix that desk fatigue.",
      icon: Wind,
      steps: [
        { 
          id: 'desk-1', 
          title: 'The Great Back Release', 
          detail: 'Seated spinal twist to unlock your lower back and breathe fresh air into your spine.', 
          seconds: 60, 
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          id: 'desk-2', 
          title: 'Neck & Shoulder Softener', 
          detail: 'Drop those shoulders! Slow neck rolls to melt away the academic pressure.', 
          seconds: 60, 
          image: 'https://physioprofessionals.com.au/wp-content/uploads/2024/11/stretches-for-neck-pain-office-workers.png' 
        },
      ],
    },
    {
      title: "Breathe & Clear (Pranayama)",
      subtitle: "Balance your nervous system. Deep breath in, stress out.",
      icon: Zap,
      steps: [
        { 
          id: 'prana-1', 
          title: 'Box Breathing', 
          detail: 'Inhale 4, Hold 4, Exhale 4, Hold 4. Instant calm for your brain.', 
          seconds: 120, 
          image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          id: 'prana-2', 
          title: 'Alternate Nostril Flow', 
          detail: 'Perfect for balancing focus before you start a heavy study block.', 
          seconds: 180, 
          image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop' 
        },
      ],
    },
    {
      title: "Mindful Reset (Meditation)",
      subtitle: "Stop the mental chatter and find your focus.",
      icon: Target,
      steps: [
        { 
          id: 'med-1', 
          title: 'Academic Stress Scan', 
          detail: 'Release the tension you are holding in your jaw and forehead.', 
          seconds: 300, 
          image: 'https://static.wixstatic.com/media/edd608_5c3cc2e06b38461f8eed45b8fb509964~mv2.webp/v1/fill/w_720,h_720,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/edd608_5c3cc2e06b38461f8eed45b8fb509964~mv2.webp' 
        },
      ],
    }
  ]

  const startPose = (step) => {
    setActiveStep(step.id)
    setTimeLeft(step.seconds)
    setTotalTime(step.seconds)
    setIsTimerRunning(true)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setActiveStep(null)
    setTimeLeft(0)
    clearInterval(timerRef.current)
  }

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      playCompletionSound()
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isTimerRunning, timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress percentage
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900">Your Fresh Day Hub 🌿</h1>
            <p className="text-lg text-slate-500 mt-3">Level 1 stress control. Practice these at your desk.</p>
          </header>

          <div className="space-y-12">
            {routines.map((routine) => (
              <section key={routine.title}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <routine.icon size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{routine.title}</h2>
                    <p className="text-slate-500 text-sm">{routine.subtitle}</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {routine.steps.map((step) => (
                    <div 
                      key={step.id}
                      className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col md:flex-row gap-6 shadow-sm overflow-hidden relative group"
                    >
                      {/* Animated Progress Bar at bottom of card */}
                      {activeStep === step.id && (
                        <motion.div 
                          className="absolute bottom-0 left-0 h-1.5 bg-indigo-500" 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ ease: "linear" }}
                        />
                      )}

                      <img 
                        src={step.image} 
                        alt={step.title} 
                        className="w-full md:w-40 h-40 object-cover rounded-2xl bg-slate-200" 
                      />
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                          <p className="text-slate-600 mt-1">{step.detail}</p>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                          {activeStep === step.id ? (
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl flex items-center gap-2">
                                <Timer size={20} /> {formatTime(timeLeft)}
                              </span>
                              
                              <button 
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                              >
                                {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                              </button>

                              <button 
                                onClick={resetTimer}
                                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                title="Stop and Reset"
                              >
                                <Square size={20} fill="currentColor" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => startPose(step)}
                              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                            >
                              <Play size={18} fill="currentColor" /> Start Practice
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Completion Message */}
        <AnimatePresence>
          {timeLeft === 0 && activeStep && !isTimerRunning && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 z-50 border border-slate-700"
            >
              <CheckCircle2 className="text-green-400" />
              <span className="font-bold text-sm md:text-base">Session Complete! How do you feel?</span>
              <button 
                onClick={resetTimer} 
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw size={18} /> Reset
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}