import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function CTA() {
  const benefits = [
    'Free initial consultation',
    'Flexible scheduling',
    'Professional therapists',
    'Confidential & secure',
  ]

  return (
    <section className="py-20 md:py-32 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Start Your Healing Journey?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join thousands of users who've found support and healing through HealthSupport
          </p>

          {/* Benefits List */}
          <motion.div
            className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto py-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 text-white/95"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <CheckCircle size={20} className="flex-shrink-0" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-primary-700 font-semibold rounded-2xl hover:shadow-soft-lg hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2 group"
            >
              Get Started Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/counseling"
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border-2 border-white/20 hover:border-white/50 hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
