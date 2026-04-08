import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../layouts/Layout'
import AIAssistant from '../components/AIAssistant'
import { BookOpen, Music, FileText, Video, Zap, Heart, ExternalLink, Lightbulb, Stethoscope } from 'lucide-react'

export default function Resources() {
  const [doctorTips, setDoctorTips] = useState([])

  useEffect(() => {
    const tips = JSON.parse(localStorage.getItem('doctor_tips') || '[]')
    setDoctorTips(tips)
  }, [])

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
      <section className="py-16 md:py-24 border-b" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Resource Hub & Expert Tips
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Curated articles, exercises, and professional insights to help you manage academic stress and mental wellness. Verified sources only.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Doctor Tips Section */}
      {doctorTips.length > 0 && (
        <section className="py-16 border-b" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--primary-blue)' }}>
                  <Lightbulb size={24} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Professional Tips from Our Doctors</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>Practical advice and insights from licensed mental health professionals.</p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {doctorTips.map((tip, index) => (
                <motion.div
                  key={tip.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="border rounded-2xl p-6 hover:shadow-lg transition-shadow" 
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--primary-blue)' }}>
                      <Stethoscope size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{tip.doctorName}</h3>
                      <p className="text-xs font-medium" style={{ color: 'var(--primary-blue)' }}>{tip.doctorSpecialty}</p>
                    </div>
                  </div>

                  <p className="leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>{tip.content}</p>

                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {new Date(tip.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Resources Grid */}
      <section className="py-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>External Resources & Tools</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Explore verified resources from trusted mental health organizations.</p>
          </motion.div>

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
                  className="border rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer group flex flex-col" 
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                  onClick={() => openResource(resource.link)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${getTagColor(resource.tag).split(' ')[0]}`}>
                      <Icon className={`w-6 h-6 ${getTagColor(resource.tag).split(' ')[2]}`} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                      {resource.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {resource.title}
                  </h3>
                  <p className="text-sm mb-6 flex-grow" style={{ color: 'var(--text-secondary)' }}>
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getTagColor(resource.tag)}`}>
                      {resource.tag}
                    </span>
                    <ExternalLink size={18} className="transition-colors" style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* AI Wellness Assistant */}
      <AIAssistant />
    </Layout>
  )
}