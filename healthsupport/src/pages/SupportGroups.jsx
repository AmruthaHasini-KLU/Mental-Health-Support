import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Layout from '../layouts/Layout'
import AIAssistant from '../components/AIAssistant'
import { Users, Calendar, MapPin, MessageSquare, Heart, TrendingUp } from 'lucide-react'

export default function SupportGroups() {
  const groups = [
    {
      name: 'Anxiety Support Circle',
      members: 342,
      meetings: 'Daily at 7 PM',
      emoji: '😰',
      focus: 'Anxiety Management',
      description: 'A safe space for people dealing with anxiety disorders to share experiences and coping strategies.',
      nextMeeting: 'Today',
    },
    {
      name: 'Depression Fighters',
      members: 521,
      meetings: 'Twice Weekly',
      emoji: '🌤️',
      focus: 'Depression Support',
      description: 'Connect with others on their journey to recovery and discover new perspectives on managing depression.',
      nextMeeting: 'Tomorrow',
    },
    {
      name: 'Wellness Warriors',
      members: 418,
      meetings: 'Weekdays 6 PM',
      emoji: '💪',
      focus: 'General Wellness',
      description: 'A positive community focused on holistic wellness, fitness, and mental health improvement.',
      nextMeeting: 'Today',
    },
    {
      name: 'Stress Busters',
      members: 267,
      meetings: 'Saturdays 10 AM',
      emoji: '🧘',
      focus: 'Stress Management',
      description: 'Learn proven techniques to manage stress and build resilience in daily life.',
      nextMeeting: 'Saturday',
    },
    {
      name: 'Mindfulness Collective',
      members: 389,
      meetings: '3x Weekly',
      emoji: '🧠',
      focus: 'Mindfulness',
      description: 'Explore meditation, mindfulness practices, and inner peace with like-minded individuals.',
      nextMeeting: 'Tomorrow',
    },
    {
      name: 'Life Transitions Hub',
      members: 156,
      meetings: 'Sundays 5 PM',
      emoji: '🌱',
      focus: 'Life Changes',
      description: 'Support for navigating major life transitions and building resilience through change.',
      nextMeeting: 'Sunday',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-50 to-calm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Support Groups & Communities
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with people who understand your journey. Share, support, and grow together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: Heart, title: 'Feel Less Alone', desc: 'Connect with others who truly understand' },
              { icon: MessageSquare, title: 'Share Experiences', desc: 'Safe space to express and be heard' },
              { icon: TrendingUp, title: 'Personal Growth', desc: 'Learn and grow through shared wisdom' },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center card-base p-8"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
                    <Icon className="w-8 h-8 text-primary-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Groups Grid */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-16">Available Groups</h2>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {groups.map((group, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card-hover bg-white p-8"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{group.emoji}</div>
                  <div className="text-xs font-semibold px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                    {group.focus}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{group.description}</p>

                <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} />
                    <span>{group.members} Active Members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{group.meetings}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary-600 font-semibold">
                    <MapPin size={16} />
                    <span>{group.nextMeeting}</span>
                  </div>
                </div>

                <Link to="/login" className="btn-primary w-full text-center">
                  Join Group
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How Support Groups Work</h2>
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                step: 1,
                title: 'Create Your Profile',
                desc: 'Sign up and tell us about your interests and mental health journey.',
              },
              {
                step: 2,
                title: 'Explore Groups',
                desc: 'Browse our diverse support groups and find ones that resonate with you.',
              },
              {
                step: 3,
                title: 'Join Meetings',
                desc: 'Attend online or in-person meetings at your convenience.',
              },
              {
                step: 4,
                title: 'Connect & Grow',
                desc: 'Share your story, offer support, and build meaningful connections.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-lg">
                    {item.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-700 to-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              You're Not Alone in This
            </h2>
            <p className="text-white/90 mb-8">
              Join our supportive communities and connect with people who care
            </p>
            <Link to="/login" className="px-8 py-4 bg-white text-primary-700 font-semibold rounded-2xl hover:shadow-soft-lg hover:scale-105 transition-all duration-300 inline-block">
              Explore Groups Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* AI Wellness Assistant */}
      <AIAssistant />
    </Layout>
  )
}
