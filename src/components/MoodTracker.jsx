import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'

export default function MoodTracker() {
  const moodData = [
    { day: 'Mon', value: 65, emoji: '😊' },
    { day: 'Tue', value: 72, emoji: '😄' },
    { day: 'Wed', value: 58, emoji: '😐' },
    { day: 'Thu', value: 75, emoji: '😊' },
    { day: 'Fri', value: 82, emoji: '😄' },
    { day: 'Sat', value: 88, emoji: '😄' },
    { day: 'Sun', value: 79, emoji: '😊' },
  ]

  const maxValue = 100

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-primary-50 to-calm-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Track Your Mood Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitor your emotional well-being with our intuitive mood tracking tools
          </p>
        </motion.div>

        {/* Main Container */}
        <motion.div
          className="card-base bg-white p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Chart Section */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <BarChart3 className="text-primary-700" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Weekly Mood</h3>
              </div>

              <motion.div
                className="flex items-end justify-between h-64 gap-3 p-6 bg-gray-50 rounded-2xl"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {moodData.map((data, index) => (
                  <motion.div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2"
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{
                      height: `${(data.value / maxValue) * 100}%`,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.1,
                    }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg cursor-pointer hover:shadow-soft-lg transition-shadow"
                      whileHover={{ scaleY: 1.05 }}
                      title={`${data.day}: ${data.value}%`}
                    ></motion.div>
                    <span className="text-xs text-gray-600 font-medium mt-2">
                      {data.day}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Info Section */}
            <div className="space-y-8">
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">
                  Your Progress This Week
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  You're showing great progress! Your mood has improved by 24% compared to last week. Keep up the positive momentum!
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-primary-50 rounded-xl border border-primary-200">
                  <p className="font-semibold text-primary-900 mb-1">Average Mood</p>
                  <p className="text-3xl font-bold text-primary-700">75%</p>
                </div>
                <div className="p-4 bg-sage-50 rounded-xl border border-sage-200">
                  <p className="font-semibold text-sage-900 mb-1">Best Day</p>
                  <p className="text-3xl font-bold text-sage-700">Saturday</p>
                </div>
              </div>

              <button className="btn-primary w-full">
                View Full Mood History
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
