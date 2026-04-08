import { motion } from 'framer-motion'
import { Video, BookOpen, Users } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Video,
      title: 'Virtual Therapy',
      description: 'Connect with licensed therapists via secure video sessions. Get professional support from the comfort of your home.',
      color: 'from-primary-600 to-primary-700',
      bgColor: 'bg-primary-50',
    },
    {
      icon: BookOpen,
      title: 'Self-Help Resources',
      description: 'Access a vast library of articles, guided meditations, and exercises designed by mental health professionals.',
      color: 'from-calm-600 to-calm-700',
      bgColor: 'bg-calm-50',
    },
    {
      icon: Users,
      title: 'Peer Support Forums',
      description: 'Join supportive communities and connect with others on similar mental health journeys. Share experiences safely.',
      color: 'from-sage-600 to-sage-700',
      bgColor: 'bg-sage-50',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-calm-100 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Comprehensive Mental Health Support
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need for your mental wellness journey in one place
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card-hover p-8"
              >
                <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group`}>
                  <Icon className={`w-8 h-8 text-gray-900 group-hover:scale-110 transition-transform`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <button className="text-primary-700 font-semibold hover:text-primary-600 transition-colors inline-flex items-center gap-2 group">
                  Learn More
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
