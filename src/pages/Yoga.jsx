import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../layouts/Layout'
import { Wind, Activity, Play, CheckCircle2, RotateCcw, Timer, Target, Zap, ArrowLeft, Brain, Square, Pause } from 'lucide-react'

export default function Yoga() {
  const [view, setView] = useState('selection') // 'selection', 'mental', or 'physical'
  const [activeStep, setActiveStep] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const timerRef = useRef(null)

  const playCompletionSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3')
    audio.volume = 0.4
    audio.play()
  }

  // --- Data Organized by the two paths with Verified Images ---
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

  // --- Timer Logic ---
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

  const startPractice = (step) => {
    setActiveStep(step.id)
    setTimeLeft(step.seconds)
    setTotalTime(step.seconds)
    setIsTimerRunning(true)
  }

  const stopPractice = () => {
    setIsTimerRunning(false)
    setActiveStep(null)
    setTimeLeft(0)
    clearInterval(timerRef.current)
  }

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-12 px-4 md:py-20">
        <div className="max-w-4xl mx-auto">
          
          <AnimatePresence mode="wait">
            {view === 'selection' && (
              <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">How are you feeling?</h1>
                <p className="text-slate-500 mb-12 italic text-lg">"Hey, let's build a fresh day. Pick what needs care first."</p>
                <div className="grid md:grid-cols-2 gap-8">
                  <button onClick={() => setView('mental')} className="p-10 bg-white border-2 border-slate-100 rounded-[3rem] shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all group">
                    <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                      <Zap size={40} fill="currentColor" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">I am Stressed</h2>
                    <p className="text-slate-500 text-sm">Focus on Mind & Breath</p>
                  </button>
                  <button onClick={() => setView('physical')} className="p-10 bg-white border-2 border-slate-100 rounded-[3rem] shadow-sm hover:shadow-xl hover:border-green-500 transition-all group">
                    <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-green-600 group-hover:scale-110 transition-transform">
                      <Activity size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">I have Body Pain</h2>
                    <p className="text-slate-500 text-sm">Fix Neck, Back & Fatigue</p>
                  </button>
                </div>
              </motion.div>
            )}

            {view !== 'selection' && (
              <motion.div key="routine" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <button onClick={() => { setView('selection'); stopPractice(); }} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors">
                  <ArrowLeft size={20} /> Back to feelings
                </button>
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-4 rounded-2xl ${view === 'mental' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'}`}>
                    {view === 'mental' ? <Brain size={32} /> : <Activity size={32} />}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">{view === 'mental' ? mentalPath.title : physicalPath.title}</h2>
                    <p className="text-slate-500">{view === 'mental' ? mentalPath.subtitle : physicalPath.subtitle}</p>
                  </div>
                </div>
                <div className="grid gap-6">
                  {(view === 'mental' ? mentalPath : physicalPath).steps.map((step) => (
                    <div key={step.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-8 shadow-sm relative overflow-hidden">
                      {activeStep === step.id && (
                        <motion.div className="absolute bottom-0 left-0 h-1.5 bg-indigo-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                      )}
                      <img src={step.image} alt={step.title} className="w-full md:w-48 h-48 object-cover rounded-3xl bg-slate-200" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                          <p className="text-slate-600 mt-2 text-lg leading-relaxed">{step.detail}</p>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-4">
                          {activeStep === step.id ? (
                            <>
                              <span className="text-3xl font-mono font-black text-indigo-600 bg-indigo-50 px-6 py-3 rounded-2xl flex items-center gap-2">
                                <Timer size={24} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                              </span>
                              <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="p-4 bg-slate-900 text-white rounded-2xl font-black">
                                {isTimerRunning ? <Pause size={24} /> : <Play size={24} />}
                              </button>
                              <button onClick={stopPractice} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors">
                                <Square size={24} fill="currentColor" />
                              </button>
                            </>
                          ) : (
                            <button onClick={() => startPractice(step)} className={`px-10 py-4 text-white rounded-2xl font-black flex items-center gap-2 shadow-lg transition-transform hover:scale-105 ${view === 'mental' ? 'bg-indigo-600 shadow-indigo-100' : 'bg-green-600 shadow-green-100'}`}>
                              <Play size={20} fill="currentColor" /> Start Practice
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
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
    </Layout>
  )
}