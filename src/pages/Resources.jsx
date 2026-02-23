import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Layout from '../layouts/Layout'
import { BookOpen, Music, FileText, Video, Zap, Heart, ExternalLink } from 'lucide-react'

export default function Resources() {
  const resources = [
    {
      title: 'Understanding Stress & How to Manage It',
      category: 'Article',
      type: 'article',
      link: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/stress/signs-and-symptoms-of-stress/',
      description: 'A professional breakdown of stress symptoms and actionable management tips.',
      tag: 'stress',
      icon: BookOpen,
    },
    {
      title: 'Box Breathing: 5 Minute Guided Session',
      category: 'Video',
      type: 'video',
      link: 'https://www.youtube.com/watch?v=tEmt1ZnuxAk',
      description: 'The Navy SEAL technique to calm your nervous system instantly.',
      tag: 'anxiety',
      icon: Video,
    },
    {
      title: 'Academic Stress: A Student Guide',
      category: 'Article',
      type: 'article',
      link: 'https://www.helpguide.org/articles/stress/stress-in-college.htm',
      description: 'Specifically designed for students balancing heavy workloads and exams.',
      tag: 'general',
      icon: FileText,
    },
    {
      title: 'Daily Habits for Low Mood',
      category: 'Article',
      type: 'article',
      link: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/',
      description: 'The "Five Steps to Wellbeing" developed by the NHS to lift your spirit.',
      tag: 'depression',
      icon: BookOpen,
    },
    {
      title: '10-Minute Sleep Meditation',
      category: 'Audio',
      type: 'video',
      link: 'https://www.youtube.com/watch?v=aEqlQv6bt2w',
      description: 'Calming audio to help you disconnect after a long day of study.',
      tag: 'sleep',
      icon: Music,
    },
    {
      title: 'CBT Techniques for Beginners',
      category: 'Article',
      type: 'article',
      link: 'https://www.psychologytoday.com/us/basics/cognitive-behavioral-therapy',
      description: 'Understand how changing your thoughts can change your feelings.',
      tag: 'depression',
      icon: BookOpen,
    },
    {
      title: 'Mindfulness for Academic Focus',
      category: 'Video',
      type: 'video',
      link: 'https://www.youtube.com/watch?v=ssss7V1_eyA',
      description: 'Guided mindfulness to improve concentration before studying.',
      tag: 'mindfulness',
      icon: Video,
    },
    {
      title: 'Managing Social Anxiety in Groups',
      category: 'Article',
      type: 'article',
      link: 'https://www.anxietyuk.org.uk/anxiety-type/social-anxiety/',
      description: 'Strategies for students navigating group projects and social events.',
      tag: 'anxiety',
      icon: BookOpen,
    },
    {
      title: 'Self-Esteem & Academic Confidence',
      category: 'Audio',
      type: 'video',
      link: 'https://www.youtube.com/watch?v=6m89_2Gvj6A',
      description: 'Affirmations to help you overcome imposter syndrome in college.',
      tag: 'self-esteem',
      icon: Zap,
    },
    {
      title: 'Progressive Muscle Relaxation (PMR)',
      category: 'Video',
      type: 'video',
      link: 'https://www.youtube.com/watch?v=1nZEdqcGVzo',
      description: 'Release the physical tension stored in your shoulders and jaw.',
      tag: 'stress',
      icon: Video,
    },
    {
      title: 'Nurturing Healthy Peer Relationships',
      category: 'Article',
      type: 'article',
      link: 'https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/relationships-and-community',
      description: 'How to build a supportive community during your university years.',
      tag: 'relationships',
      icon: Heart,
    },
    {
      title: 'Chair Yoga for Study Breaks',
      category: 'Video',
      type: 'video',
      link: 'https://www.youtube.com/watch?v=tAUf7aajBWE',
      description: 'Quick movements to relieve desk fatigue and back pain.',
      tag: 'stress',
      icon: Video,
    },
  ]

  const tags = ['stress', 'anxiety', 'depression', 'sleep', 'mindfulness', 'general', 'self-esteem', 'relationships']

  // ... (Keep the rest of your logic like containerVariants, itemVariants, getTagColor, and openResource the same)

  const getTagColor = (tag) => {
    const colorMap = {
      stress: 'from-blue-100 to-blue-200 text-blue-700',
      anxiety: 'from-indigo-100 to-indigo-200 text-indigo-700',
      depression: 'from-slate-100 to-slate-200 text-slate-700',
      sleep: 'from-purple-100 to-purple-200 text-purple-700',
      mindfulness: 'from-teal-100 to-teal-200 text-teal-700',
      general: 'from-gray-100 to-gray-200 text-gray-700',
      'self-esteem': 'from-amber-100 to-amber-200 text-amber-700',
      relationships: 'from-rose-100 to-rose-200 text-rose-700',
    }
    return colorMap[tag] || 'from-gray-100 to-gray-200 text-gray-700'
  }

  const openResource = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Resource Hub
            </h1>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto">
              Curated articles and exercises to help you manage academic stress and physical fatigue. Verified sources only.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid - Rest of the component remains the same */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {resources.map((resource, index) => {
              const Icon = resource.icon
              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer group flex flex-col"
                  onClick={() => openResource(resource.link)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${getTagColor(resource.tag).split(' ')[0]}`}>
                      <Icon className={`w-6 h-6 ${getTagColor(resource.tag).split(' ')[2]}`} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {resource.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 flex-grow">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getTagColor(resource.tag)}`}>
                      {resource.tag}
                    </span>
                    <ExternalLink size={18} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}