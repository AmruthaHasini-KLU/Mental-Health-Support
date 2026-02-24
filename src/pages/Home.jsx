import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Layout from '../layouts/Layout'
import MoodTracker from '../components/MoodTracker'
import { Activity, Heart, Sparkles, Users, MessageCircle, Headphones, BookOpen, ChevronLeft, ChevronRight, Star, User } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Mock testimonials from students
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Psychology Student',
      content: 'MindEase has been a game-changer for my mental health journey. The therapy sessions helped me work through my anxiety, and the peer support feature makes me feel less alone.',
      rating: 5
    },
    {
      id: 2,
      name: 'James Chen',
      role: 'Engineering Student',
      content: 'I struggled with depression during my first year. The resources here are incredible and the counselors are genuinely caring. Highly recommend to anyone seeking support.',
      rating: 5
    },
    {
      id: 3,
      name: 'Emma Williams',
      role: 'Medical Student',
      content: 'The mood tracker helped me identify patterns in my emotional well-being. Combined with the virtual therapy, I feel so much better. Thank you MindEase!',
      rating: 5
    }
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-slate-50 flex items-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen justify-items-center">
            
            {/* Left Content */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full border border-slate-100"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles size={18} className="text-indigo-600" />
                <span className="text-sm font-semibold text-slate-700">Your Mental Health Matters</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Your Mind Matters.
                <br />
                <span className="text-indigo-600">Support is Just One Click Away.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                className="text-xl text-slate-500 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Connect with professional therapists, access evidence-based resources, and build meaningful connections with peers who understand your journey.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart size={20} />
                  Get Started
                </button>
                <button
                  onClick={() => navigate('/therapy')}
                  className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl border border-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Schedule Session
                </button>
              </motion.div>

              {/* Trust Metrics */}
              <motion.div
                className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div>
                  <p className="text-3xl font-bold text-indigo-600">500+</p>
                  <p className="text-sm text-slate-500">Students Supported</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-indigo-600">24/7</p>
                  <p className="text-sm text-slate-500">Crisis Support</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-indigo-600">50+</p>
                  <p className="text-sm text-slate-500">Therapists</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              className="relative w-full h-96 md:h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                className="relative w-80 h-80 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-center"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <Activity size={64} className="text-indigo-600" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16 md:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Comprehensive Mental Health Support
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Everything you need to prioritize your mental wellness in one place
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Virtual Therapy Card */}
            <motion.div
              className="group p-8 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors bg-white"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <motion.div
                className="p-4 bg-slate-50 border border-slate-100 rounded-2xl w-fit mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Headphones className="text-indigo-600" size={32} />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Virtual Therapy</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Connect with licensed therapists via video, phone, or chat. Flexible scheduling to fit your lifestyle.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  Licensed professionals
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  Personalized treatment plans
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  Flexible scheduling
                </li>
              </ul>
            </motion.div>

            {/* Self-Help Resources Card */}
            <motion.div
              className="group p-8 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors bg-white"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <motion.div
                className="p-4 bg-slate-50 border border-slate-100 rounded-2xl w-fit mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <BookOpen className="text-indigo-600" size={32} />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Self-Help Resources</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Access curated resources including articles, videos, meditation guides, and coping strategies.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  Evidence-based materials
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  Meditation & mindfulness
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  Self-care tools
                </li>
              </ul>
            </motion.div>

            {/* Peer Support Card */}
            <motion.div
              className="group p-8 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors bg-white"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <motion.div
                className="p-4 bg-slate-50 border border-slate-100 rounded-2xl w-fit mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Users className="text-indigo-600" size={32} />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Peer Support</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Join support groups and communities with others facing similar challenges. Build meaningful connections.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  Supportive community
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  Group discussions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  Shared experiences
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mood Tracker Section */}
      <MoodTracker />

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16 md:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Trusted by Students Like You
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Read real reviews from students who've transformed their mental health journey
            </p>
          </motion.div>

          {/* Testimonial Slider */}
          <motion.div
            className="relative max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Testimonial Card */}
            <motion.div
              key={currentTestimonial}
              className="bg-white p-10 md:p-12 text-center border border-slate-100 rounded-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              {/* Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xl text-slate-700 mb-8 leading-relaxed italic">
                "{testimonials[currentTestimonial].content}"
              </p>

              {/* Avatar & Name */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <User size={28} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-900">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <motion.button
                onClick={prevTestimonial}
                className="p-3 bg-white rounded-full hover:bg-indigo-50 transition-colors border border-slate-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={24} className="text-indigo-600" />
              </motion.button>
              <motion.button
                onClick={nextTestimonial}
                className="p-3 bg-white rounded-full hover:bg-indigo-50 transition-colors border border-slate-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight size={24} className="text-indigo-600" />
              </motion.button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'bg-indigo-600 w-8'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Begin?
          </motion.h2>
          <motion.p
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Start your journey with professional, compassionate mental health support.
          </motion.p>
          <motion.button
            onClick={() => navigate('/login')}
            className="px-10 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </div>
      </section>
    </Layout>
  )
}
