import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Activity, BookOpen, Calendar, Timer, ChevronRight } from 'lucide-react'
import Layout from '../layouts/Layout'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stressors, setStressors] = useState([
    {
      id: 1,
      title: 'Midterm coverage in Algorithms',
      type: 'Exams',
      intensity: 'High',
      createdAt: 'Today'
    },
    {
      id: 2,
      title: 'Final project milestones',
      type: 'Deadlines',
      intensity: 'Moderate',
      createdAt: 'Yesterday'
    },
    {
      id: 3,
      title: 'Group presentation outline',
      type: 'Presentations',
      intensity: 'Low',
      createdAt: '2 days ago'
    }
  ])
  const [formData, setFormData] = useState({
    title: '',
    type: 'Exams',
    intensity: 'Moderate',
    customType: '' // For 'Other' option
  })

  if (!user) {
    navigate('/login')
    return null
  }

  const reliefStrategies = {
    Exams: [
      { title: 'Pomodoro Sprint', detail: '25 min focus + 5 min reset cycles', icon: Timer },
      { title: 'Active Recall', detail: 'Closed-book retrieval after each topic', icon: BookOpen },
      { title: 'Time Blocking', detail: 'Block two deep-work windows on your calendar', icon: Calendar },
    ],
    Deadlines: [
      { title: 'Priority Map', detail: 'Label tasks as must / should / could', icon: Calendar },
      { title: 'Time Block', detail: 'Stack 90-minute work blocks with breaks', icon: Timer },
      { title: 'Active Recall', detail: 'End each block with quick recaps', icon: BookOpen },
    ],
    Presentations: [
      { title: 'Pomodoro Sprint', detail: 'Build the outline in two short sprints', icon: Timer },
      { title: 'Active Recall', detail: 'Practice without slides for 3 minutes', icon: BookOpen },
      { title: 'Time Blocking', detail: 'Reserve review time the day before', icon: Calendar },
    ],
    Projects: [
      { title: 'Priority Map', detail: 'Define the next smallest deliverable', icon: Calendar },
      { title: 'Pomodoro Sprint', detail: 'Start with a 25-minute kickoff', icon: Timer },
      { title: 'Active Recall', detail: 'Summarize progress after each sprint', icon: BookOpen },
    ],
    Financial: [
      { title: 'Budget Plan', detail: 'Track expenses and prioritize needs', icon: Calendar },
      { title: 'Time Blocking', detail: 'Set aside time for financial planning', icon: Timer },
      { title: 'Resource Check', detail: 'Research scholarships and aid options', icon: BookOpen },
    ],
    'Personal/Family': [
      { title: 'Time Blocking', detail: 'Schedule regular check-ins with loved ones', icon: Calendar },
      { title: 'Pomodoro Sprint', detail: 'Take short breaks to process emotions', icon: Timer },
      { title: 'Active Recall', detail: 'Journal about your feelings', icon: BookOpen },
    ],
    'Social/Peer Pressure': [
      { title: 'Priority Map', detail: 'Identify your true values and priorities', icon: Calendar },
      { title: 'Time Blocking', detail: 'Schedule time for authentic connections', icon: Timer },
      { title: 'Active Recall', detail: 'Reflect on positive relationships', icon: BookOpen },
    ],
    Health: [
      { title: 'Time Blocking', detail: 'Schedule regular exercise and meals', icon: Calendar },
      { title: 'Pomodoro Sprint', detail: 'Take movement breaks every hour', icon: Timer },
      { title: 'Active Recall', detail: 'Track symptoms and wellness patterns', icon: BookOpen },
    ],
    Other: [
      { title: 'Pomodoro Sprint', detail: 'Break the challenge into small steps', icon: Timer },
      { title: 'Priority Map', detail: 'Identify what you can control', icon: Calendar },
      { title: 'Active Recall', detail: 'Reflect on past successes', icon: BookOpen },
    ]
  }

  const stressorTypes = ['Exams', 'Deadlines', 'Presentations', 'Projects', 'Financial', 'Personal/Family', 'Social/Peer Pressure', 'Health', 'Other']
  const stressLevels = ['Low', 'Moderate', 'High']

  const loadStressors = () => {
    const stored = JSON.parse(localStorage.getItem('student_stressors') || '[]')
    if (Array.isArray(stored) && stored.length > 0) {
      setStressors(stored)
    }
  }

  useEffect(() => {
    loadStressors()

    const handleStorageChange = (event) => {
      if (event.key === 'student_stressors') {
        loadStressors()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddStressor = (event) => {
    event.preventDefault()
    if (!formData.title.trim()) {
      return
    }

    // Use customType if 'Other' is selected, otherwise use type
    const finalType = formData.type === 'Other' && formData.customType.trim() 
      ? formData.customType.trim() 
      : formData.type

    const nextStressor = {
      id: Date.now(),
      title: formData.title.trim(),
      type: finalType,
      intensity: formData.intensity,
      createdAt: 'Just now'
    }

    setStressors((prev) => [nextStressor, ...prev])
    
    // Save to localStorage for Admin Therapy Hub sync
    const existingStressors = JSON.parse(localStorage.getItem('student_stressors') || '[]')
    existingStressors.push(nextStressor)
    localStorage.setItem('student_stressors', JSON.stringify(existingStressors))
    
    setFormData({ title: '', type: formData.type, intensity: formData.intensity, customType: '' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <Layout>
      <section className="py-8 md:py-12 min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Personalized Greeting Header */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="font-semibold text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Academic Stress Action Plan</p>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">Hello {user.name}</h1>
              <p className="text-xl mt-2" style={{ color: 'var(--text-secondary)' }}>
                Track stressors, apply Level 1 relief, and stay steady.
              </p>
            </div>
          </motion.div>

          {/* Stress Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Stress Tracker</h2>
                    <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Log your academic stressors and apply Level 1 relief</p>
                  </div>
                  <motion.button
                    onClick={() => navigate('/yoga')}
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-2 border text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors" style={{ borderColor: 'var(--primary-blue)' }}
                  >
                    Yoga & Relief Hub
                  </motion.button>
                </div>

                <motion.form
                  onSubmit={handleAddStressor}
                  className="grid grid-cols-1 gap-4 p-6 border rounded-2xl mb-6 transition-colors" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Stressor</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        placeholder="Exams, deadlines, projects"
                        className="mt-2 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleFormChange}
                        className="mt-2 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
                      >
                        {stressorTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Intensity</label>
                      <select
                        name="intensity"
                        value={formData.intensity}
                        onChange={handleFormChange}
                        className="mt-2 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
                      >
                        {stressLevels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full px-4 py-2 text-white font-semibold rounded-xl transition-colors border"
                        style={{ backgroundColor: 'var(--primary-blue)', borderColor: 'var(--primary-blue)' }}
                      >
                        Add Stressor
                      </button>
                    </div>
                  </div>
                  
                  {/* Custom Type Input - Shows when 'Other' is selected */}
                  {formData.type === 'Other' && (
                    <div className="mt-2">
                      <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Specify custom stressor type</label>
                      <input
                        type="text"
                        name="customType"
                        value={formData.customType}
                        onChange={handleFormChange}
                        placeholder="e.g., Homesickness, Loneliness, Career uncertainty"
                        className="mt-2 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  )}
                </motion.form>

                <motion.div
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {stressors.map((stressor) => (
                    <motion.div
                      key={stressor.id}
                      variants={itemVariants}
                      className="p-6 border rounded-2xl transition-colors" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{stressor.title}</h3>
                          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {stressor.type} · {stressor.intensity} · {stressor.createdAt}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold rounded-full px-3 py-1 text-indigo-600" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                          <Activity size={14} />
                          Level 1 Relief
                        </span>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mt-6">
                        {(reliefStrategies[stressor.type] || reliefStrategies.Exams).map((strategy) => {
                          const StrategyIcon = strategy.icon
                          return (
                            <div
                              key={strategy.title}
                              className="p-4 border rounded-xl transition-colors" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}
                            >
                              <div className="flex items-center gap-2 font-semibold" style={{ color: 'var(--text-primary)' }}>
                                <StrategyIcon size={16} className="text-indigo-600" />
                                {strategy.title}
                              </div>
                              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{strategy.detail}</p>
                            </div>
                          )}
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                className="p-6 border rounded-2xl h-fit transition-colors" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Level 1 Relief Toolkit</h3>
                <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Quick resets to keep you steady during heavy academic weeks.
                </p>
                <div className="space-y-4">
                  {[
                    { title: 'Pomodoro Timer', detail: '25 / 5 cycles to reduce overwhelm', icon: Timer },
                    { title: 'Active Recall', detail: 'Short retrieval drills after each topic', icon: BookOpen },
                    { title: 'Time Blocking', detail: 'Protect focus windows on your calendar', icon: Calendar },
                  ].map((item) => {
                    const ItemIcon = item.icon
                    return (
                      <div key={item.title} className="flex items-start gap-3">
                        <div className="p-2 rounded-lg border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                          <ItemIcon size={16} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{item.title}</p>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.detail}</p>
                        </div>
                      </div>
                    )}
                  )}
                </div>
                <button
                  onClick={() => navigate('/yoga')}
                  className="mt-6 w-full px-4 py-2 border text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2" style={{ borderColor: 'var(--primary-blue)', color: 'var(--primary-blue)' }}
                >
                  Open Yoga & Relief Hub
                  <ChevronRight size={18} />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}
