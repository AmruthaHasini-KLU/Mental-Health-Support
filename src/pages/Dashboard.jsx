import { useState } from 'react'
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
    intensity: 'Moderate'
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
    ]
  }

  const stressorTypes = ['Exams', 'Deadlines', 'Presentations', 'Projects']
  const stressLevels = ['Low', 'Moderate', 'High']

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddStressor = (event) => {
    event.preventDefault()
    if (!formData.title.trim()) {
      return
    }

    const nextStressor = {
      id: Date.now(),
      title: formData.title.trim(),
      type: formData.type,
      intensity: formData.intensity,
      createdAt: 'Just now'
    }

    setStressors((prev) => [nextStressor, ...prev])
    setFormData({ title: '', type: formData.type, intensity: formData.intensity })
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
      <section className="py-8 md:py-12 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Personalized Greeting Header */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="text-indigo-600 font-semibold text-sm mb-2">Academic Stress Action Plan</p>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Hello {user.name}</h1>
              <p className="text-xl text-slate-500 mt-2">
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
                    <h2 className="text-3xl font-bold text-slate-900">Stress Tracker</h2>
                    <p className="text-slate-500 mt-1">Log your academic stressors and apply Level 1 relief</p>
                  </div>
                  <motion.button
                    onClick={() => navigate('/yoga')}
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-2 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Yoga & Relief Hub
                  </motion.button>
                </div>

                <motion.form
                  onSubmit={handleAddStressor}
                  className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 border border-slate-100 rounded-2xl bg-white mb-6"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Stressor</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      placeholder="Exams, deadlines, projects"
                      className="mt-2 w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleFormChange}
                      className="mt-2 w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                      {stressorTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Intensity</label>
                    <select
                      name="intensity"
                      value={formData.intensity}
                      onChange={handleFormChange}
                      className="mt-2 w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                      {stressLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      Add Stressor
                    </button>
                  </div>
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
                      className="p-6 border border-slate-100 rounded-2xl bg-white"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{stressor.title}</h3>
                          <p className="text-sm text-slate-500 mt-1">
                            {stressor.type} · {stressor.intensity} · {stressor.createdAt}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
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
                              className="p-4 border border-slate-100 rounded-xl bg-slate-50"
                            >
                              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                <StrategyIcon size={16} className="text-indigo-600" />
                                {strategy.title}
                              </div>
                              <p className="text-sm text-slate-500 mt-2">{strategy.detail}</p>
                            </div>
                          )}
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                className="p-6 border border-slate-100 rounded-2xl bg-white h-fit"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">Level 1 Relief Toolkit</h3>
                <p className="text-slate-500 mb-6">
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
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <ItemIcon size={16} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{item.title}</p>
                          <p className="text-sm text-slate-500">{item.detail}</p>
                        </div>
                      </div>
                    )}
                  )}
                </div>
                <button
                  onClick={() => navigate('/yoga')}
                  className="mt-6 w-full px-4 py-2 border border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
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
