import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Users, AlertTriangle, Activity, BookOpen, ChevronRight, LogOut } from 'lucide-react'
import Layout from '../layouts/Layout'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout, isLoading } = useAuth()

  // Wait for loading state before rendering - prevents "disappearing dashboard" bug
  if (isLoading) {
    return (
      <Layout>
        <section className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-600 font-medium">Loading dashboard...</p>
          </div>
        </section>
      </Layout>
    )
  }

  // Protect route - only admin can access
  if (!user || user.role !== 'admin') {
    navigate(user ? '/dashboard' : '/login')
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Dashboard Overview Stats
  const dashboardStats = [
    { label: 'Total Students', value: '1,247', icon: Users, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'High-Stress Triage Cases', value: '34', icon: AlertTriangle, bgColor: 'bg-red-50', iconColor: 'text-red-600' },
    { label: 'Yoga Sessions Completed', value: '89', icon: Activity, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
    { label: 'Library Resource Reads', value: '2,341', icon: BookOpen, bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  ]

  // Triage Queue Mock Data
  const [triageQueue] = useState([
    { id: 1, name: 'Sophia Martinez', category: 'Critical', timeSince: '45 minutes ago' },
    { id: 2, name: 'Jacob Chen', category: 'Critical', timeSince: '2 hours ago' },
    { id: 3, name: 'Emma Wilson', category: 'Moderate', timeSince: '30 minutes ago' },
    { id: 4, name: 'Liam Davis', category: 'Level 1', timeSince: '1 hour ago' },
    { id: 5, name: 'Olivia Brown', category: 'Moderate', timeSince: '3 hours ago' },
  ])

  // Therapist Workload Data
  const [therapists] = useState([
    { id: 1, name: 'Dr. Aisha', capacity: 85 },
    { id: 2, name: 'Dr. Luis', capacity: 72 },
    { id: 3, name: 'Dr. Hannah', capacity: 91 },
  ])

  // Animation variants
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

  const getCategoryStyles = (category) => {
    switch (category) {
      case 'Critical':
        return 'bg-red-100 text-red-700'
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-700'
      case 'Level 1':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getCapacityColor = (capacity) => {
    if (capacity >= 85) return 'bg-red-500'
    if (capacity >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <Layout>
      <section className="min-h-screen bg-slate-50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            className="flex justify-between items-start mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="text-indigo-600 font-semibold text-sm mb-2 uppercase tracking-wide">Admin Dashboard</p>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                Welcome, {user.name}
              </h1>
              <p className="text-lg text-slate-600">
                Monitor triage cases, track therapist workload, and manage system operations
              </p>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 border border-red-200 text-red-600 font-semibold rounded-[2.5rem] hover:bg-red-100 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </motion.button>
          </motion.div>

          {/* Dashboard Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {dashboardStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`${stat.bgColor} border border-slate-200 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bgColor} border border-slate-300`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm font-semibold mb-2">{stat.label}</p>
                  <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Main Content: Triage Queue + Therapist Workload */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Triage Management System */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Triage Queue</h2>
              
              {/* Triage Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">Student Name</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">Stress Category</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">Time Since Request</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {triageQueue.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <p className="font-semibold text-slate-900">{item.name}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryStyles(item.category)}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-slate-600 text-sm">{item.timeSince}</p>
                        </td>
                        <td className="py-4 px-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/triage/${item.id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors"
                          >
                            Priority Review
                            <ChevronRight size={16} />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Therapist Workload Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm h-fit"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Therapist Workload</h2>
              
              <div className="space-y-6">
                {therapists.map((therapist, index) => (
                  <motion.div
                    key={therapist.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-slate-900">{therapist.name}</p>
                      <span className="text-sm font-semibold text-slate-600">{therapist.capacity}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <motion.div
                        className={`h-full rounded-full transition-all ${getCapacityColor(therapist.capacity)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${therapist.capacity}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {therapist.capacity >= 85 ? 'Near Capacity' : therapist.capacity >= 70 ? 'High Load' : 'Available'}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-8 border-t border-slate-200">
                <p className="text-sm font-semibold text-slate-700 mb-3">System Health</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Avg. Capacity</span>
                    <span className="font-semibold text-slate-900">
                      {Math.round(therapists.reduce((sum, t) => sum + t.capacity, 0) / therapists.length)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cases in Queue</span>
                    <span className="font-semibold text-slate-900">{triageQueue.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>
    </Layout>
  )
}
