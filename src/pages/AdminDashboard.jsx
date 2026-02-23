import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LogOut, Plus, Edit2, Trash2, Users, BookOpen, Calendar, BarChart3, Check, X, AlertCircle, MessageSquare, Search } from 'lucide-react'
import Layout from '../layouts/Layout'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showAddResource, setShowAddResource] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [resourceForm, setResourceForm] = useState({ title: '', category: '', description: '' })
  const [searchResources, setSearchResources] = useState('')

  if (!user || user.role !== 'admin') {
    navigate('/login')
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Mock stats
  const adminStats = [
    { label: 'Total Users', value: '1,250', icon: Users, tone: 'text-blue-600', change: '+45' },
    { label: 'Active Therapists', value: '42', icon: BookOpen, tone: 'text-green-600', change: '+3' },
    { label: 'Sessions This Week', value: '127', icon: Calendar, tone: 'text-purple-600', change: '+15' },
    { label: 'New Resources', value: '18', icon: BarChart3, tone: 'text-pink-600', change: '+7' },
  ]

  // Mock resources
  const [resources, setResources] = useState([
    { id: 1, title: 'Anxiety Management Guide', category: 'Article', status: 'published', date: '2024-02-20', views: 1240 },
    { id: 2, title: 'Meditation for Beginners', category: 'Video', status: 'published', date: '2024-02-18', views: 892 },
    { id: 3, title: 'Sleep Hygiene Tips', category: 'Article', status: 'draft', date: '2024-02-15', views: 0 },
    { id: 4, title: 'Stress Relief Techniques', category: 'Video', status: 'published', date: '2024-02-12', views: 1567 },
    { id: 5, title: 'Depression Support Resources', category: 'Guide', status: 'published', date: '2024-02-10', views: 2341 },
  ])

  // Mock counseling queue
  const [counselingQueue] = useState([
    { id: 1, student: 'Alex Johnson', email: 'alex@email.com', topic: 'Anxiety Support', status: 'pending', priority: 'high' },
    { id: 2, student: 'Maria Garcia', email: 'maria@email.com', topic: 'Academic Stress', status: 'pending', priority: 'medium' },
    { id: 3, student: 'James Wilson', email: 'james@email.com', topic: 'Sleep Issues', status: 'pending', priority: 'medium' },
  ])

  // Mock moderation items
  const [moderationItems] = useState([
    { id: 1, author: 'User_123', content: 'Great tips on managing anxiety...', date: '2h ago', status: 'pending', engagement: 243 },
    { id: 2, author: 'User_456', content: 'This helped me so much, thank you...', date: '4h ago', status: 'approved', engagement: 89 },
    { id: 3, author: 'User_789', content: 'Inappropriate content...', date: '6h ago', status: 'flagged', engagement: 12 },
  ])

  const handleAddResource = (e) => {
    e.preventDefault()
    if (resourceForm.title && resourceForm.category && resourceForm.description) {
      setResources([...resources, {
        id: resources.length + 1,
        title: resourceForm.title,
        category: resourceForm.category,
        status: 'draft',
        date: new Date().toISOString().split('T')[0],
        views: 0
      }])
      setResourceForm({ title: '', category: '', description: '' })
      setShowAddResource(false)
    }
  }

  const handleDeleteResource = (id) => {
    setResources(resources.filter(r => r.id !== id))
    setShowDeleteConfirm(null)
  }

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchResources.toLowerCase())
  )

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
      <section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Admin Header */}
          <motion.div 
            className="flex justify-between items-start mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="text-indigo-600 font-semibold text-sm mb-2">Admin Control Panel</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Welcome, {user.name}
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Manage resources, handle requests, and monitor platform activity
              </p>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 border border-red-600 text-red-600 font-semibold rounded-2xl hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </motion.button>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {adminStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white p-6 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <Icon className={`w-6 h-6 ${stat.tone}`} />
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Two column layout: Resource Manager & Counseling Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
            
            {/* Resource Manager */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:col-span-2 bg-white p-8 border border-gray-100 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Resource Manager</h2>
                <motion.button
                  onClick={() => setShowAddResource(true)}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <Plus size={18} />
                  Add Resource
                </motion.button>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-white border border-gray-100 rounded-lg">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchResources}
                  onChange={(e) => setSearchResources(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700"
                />
              </div>

              {/* Resources Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Views</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResources.map((resource) => (
                      <motion.tr
                        key={resource.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <p className="font-semibold text-gray-900">{resource.title}</p>
                          <p className="text-xs text-gray-500">{resource.date}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">{resource.category}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            resource.status === 'published' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {resource.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">{resource.views}</td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-2 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              <Edit2 size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => setShowDeleteConfirm(resource.id)}
                              className="p-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Counseling Queue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white p-8 border border-gray-100 rounded-2xl h-fit"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Counseling Queue ({counselingQueue.length})</h2>
              <div className="space-y-4">
                {counselingQueue.map((request, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border border-gray-100 border-l-4 bg-white ${
                      request.priority === 'high' 
                        ? 'border-l-red-300' 
                        : 'border-l-yellow-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{request.student}</p>
                        <p className="text-xs text-gray-600">{request.email}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        request.priority === 'high'
                          ? 'bg-red-200 text-red-700'
                          : 'bg-yellow-200 text-yellow-700'
                      }`}>
                        {request.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{request.topic}</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="w-full py-2 border border-indigo-600 text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      Assign to Counselor
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Moderation Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white p-8 border border-gray-100 rounded-2xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Peer Support Forum Moderation</h2>
            <div className="space-y-4">
              {moderationItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-gray-900">{item.author}</p>
                        <span className="text-xs text-gray-500">{item.date}</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{item.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-2">
                          <MessageSquare size={14} className="text-gray-400" />
                          {item.engagement} engagements
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {item.status === 'pending' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="p-2 border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                            title="Approve"
                          >
                            <Check size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="p-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                            title="Reject"
                          >
                            <X size={18} />
                          </motion.button>
                        </>
                      )}
                      {item.status === 'flagged' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-2 border border-orange-200 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors"
                          title="Review"
                        >
                          <AlertCircle size={18} />
                        </motion.button>
                      )}
                      {item.status === 'approved' && (
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                          ✓ Approved
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Add Resource Modal */}
        <AnimatePresence>
          {showAddResource && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddResource(false)}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Resource</h3>
                <form onSubmit={handleAddResource} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={resourceForm.title}
                      onChange={(e) => setResourceForm({...resourceForm, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      placeholder="Resource title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      value={resourceForm.category}
                      onChange={(e) => setResourceForm({...resourceForm, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="">Select category</option>
                      <option value="Article">Article</option>
                      <option value="Video">Video</option>
                      <option value="Guide">Guide</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={resourceForm.description}
                      onChange={(e) => setResourceForm({...resourceForm, description: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      placeholder="Resource description"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      onClick={() => setShowAddResource(false)}
                      className="flex-1 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                      whileHover={{ scale: 1.02 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 py-2 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50"
                      whileHover={{ scale: 1.02 }}
                    >
                      Add
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-sm w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Delete Resource?</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this resource? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                    whileHover={{ scale: 1.02 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteResource(showDeleteConfirm)}
                    className="flex-1 py-2 border border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50"
                    whileHover={{ scale: 1.02 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </Layout>
  )
}
