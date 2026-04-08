import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section className="min-h-screen pt-20 bg-gradient-to-br from-primary-50 via-white to-calm-50 flex items-center">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-4">
              <motion.p
                variants={itemVariants}
                className="text-primary-600 font-semibold text-lg"
              >
                Welcome to Your Mental Health Journey
              </motion.p>
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Your Mind Matters. Support is Just One
                <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  {' '}Click Away.
                </span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-600 leading-relaxed"
              >
                Connect with professional therapists, access self-help resources, and join a supportive community. Your mental health journey starts here.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link to="/login" className="btn-primary inline-flex items-center justify-center gap-2 group">
                Get Started
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/therapy" className="btn-secondary inline-flex items-center justify-center gap-2">
                Book Session
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={itemVariants} className="flex items-center gap-8 pt-8 border-t border-primary-100">
              <div>
                <p className="text-2xl font-bold text-primary-700">500+</p>
                <p className="text-sm text-gray-600">Licensed Therapists</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-700">10K+</p>
                <p className="text-sm text-gray-600">Active Members</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-700">4.9/5</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Visual */}
          <motion.div
            variants={itemVariants}
            className="relative h-96 md:h-full min-h-96"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-200/50 to-calm-200/50 rounded-4xl blur-3xl"></div>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative h-full rounded-4xl bg-gradient-to-br from-primary-100 to-calm-100 border border-primary-200 shadow-soft-lg flex items-center justify-center"
            >
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-4xl">💭</span>
                </div>
                <p className="text-primary-700 font-semibold text-lg">Mental Wellness Starts Here</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
