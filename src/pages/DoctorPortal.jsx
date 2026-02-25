import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Clipboard,
  Lightbulb,
  Stethoscope,
  LogOut,
  Menu,
  Check,
  Clock,
  AlertCircle,
  Phone,
  Users,
  CheckCircle2,
  XCircle,
  Send,
  UserCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function DoctorPortal() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [assignedRequests, setAssignedRequests] = useState([])
  const [completedRequests, setCompletedRequests] = useState([])
  const [filter, setFilter] = useState('pending')
  const [tipsInput, setTipsInput] = useState('')
  const [doctorTips, setDoctorTips] = useState([])

  // Load assigned requests and tips from localStorage
  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem('therapy_requests') || '[]')
    const assigned = allRequests.filter(req => req.doctorName === user?.name && req.status === 'Pending')
    const completed = allRequests.filter(req => req.doctorName === user?.name && (req.status === 'Scheduled' || req.status === 'Completed'))
    
    setAssignedRequests(assigned)
    setCompletedRequests(completed)

    // Load doctor tips
    const allTips = JSON.parse(localStorage.getItem('doctor_tips') || '[]')
    setDoctorTips(allTips)
  }, [user?.name])

  const acceptRequest = (requestId) => {
    const allRequests = JSON.parse(localStorage.getItem('therapy_requests') || '[]')
    const updated = allRequests.map(req =>
      req.id === requestId ? { ...req, status: 'Scheduled' } : req
    )
    localStorage.setItem('therapy_requests', JSON.stringify(updated))
    
    setAssignedRequests(assignedRequests.filter(req => req.id !== requestId))
    const acceptedReq = assignedRequests.find(req => req.id === requestId)
    if (acceptedReq) {
      setCompletedRequests([...completedRequests, { ...acceptedReq, status: 'Scheduled' }])
    }
  }

  const rejectRequest = (requestId) => {
    const allRequests = JSON.parse(localStorage.getItem('therapy_requests') || '[]')
    const updated = allRequests.map(req =>
      req.id === requestId ? { ...req, status: 'Rejected', doctorName: null } : req
    )
    localStorage.setItem('therapy_requests', JSON.stringify(updated))
    
    setAssignedRequests(assignedRequests.filter(req => req.id !== requestId))
  }

  const postTip = () => {
    if (!tipsInput.trim()) return

    const newTip = {
      id: Date.now(),
      doctorName: user?.name,
      doctorSpecialty: user?.specialization,
      content: tipsInput,
      createdAt: new Date().toISOString()
    }

    const updated = [newTip, ...doctorTips]
    localStorage.setItem('doctor_tips', JSON.stringify(updated))
    setDoctorTips(updated)
    setTipsInput('')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      case 'Low': return 'bg-green-100 text-green-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={16} className="text-yellow-600" />
      case 'Scheduled': return <CheckCircle2 size={16} className="text-green-600" />
      case 'Completed': return <Check size={16} className="text-green-600" />
      case 'Rejected': return <XCircle size={16} className="text-red-600" />
      default: return null
    }
  }

  const pendingCount = assignedRequests.length
  const scheduledCount = completedRequests.filter(r => r.status === 'Scheduled').length
  const totalCount = pendingCount + scheduledCount

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-screen">
        {/* SIDEBAR */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          className={`fixed left-0 top-0 h-screen bg-slate-900 text-white w-72 z-40 flex flex-col shadow-xl hidden lg:flex`}
        >
          {/* Logo */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center">
                <Stethoscope size={24} />
              </div>
              <div>
                <h2 className="font-bold text-lg">HealthSupport</h2>
                <p className="text-xs text-slate-400">Doctor Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'assignments'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Clipboard size={20} />
              <span className="font-medium">Assignments</span>
            </button>

            <button
              onClick={() => setActiveTab('insights')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'insights'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Lightbulb size={20} />
              <span className="font-medium">Share Insights</span>
            </button>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-3 p-3 bg-slate-800 rounded-xl">
              <UserCircle size={32} className="text-indigo-400" />
              <div className="flex-1">
                <p className="font-medium text-sm">{user?.name || 'Doctor'}</p>
                <p className="text-xs text-slate-400">{user?.specialization || 'Not specified'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </motion.aside>

        {/* MAIN CONTENT */}
        <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-72' : ''} lg:ml-72 transition-all`}>
          {/* Top Bar */}
          <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
            >
              <Menu size={24} className="text-slate-700" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'assignments' && 'All Assignments'}
              {activeTab === 'insights' && 'Share Insights'}
            </h1>
            <div className="w-10"></div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6 bg-white dark:bg-[#0f172a]">
            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Doctor Profile Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-2xl text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                      <Stethoscope size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{user?.name || 'Doctor'}</h2>
                      <p className="text-indigo-100 text-lg">{user?.specialization || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <Clock className="text-yellow-600" size={24} />
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{pendingCount}</span>
                    </div>
                    <h3 className="text-slate-600 font-medium">Pending Requests</h3>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="text-green-600" size={24} />
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{scheduledCount}</span>
                    </div>
                    <h3 className="text-slate-600 font-medium">Scheduled Sessions</h3>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Users className="text-blue-600" size={24} />
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{totalCount}</span>
                    </div>
                    <h3 className="text-slate-600 font-medium">Total Assigned</h3>
                  </div>
                </div>

                {/* Quick Overview */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Quick Overview</h3>
                  <p className="text-slate-600 leading-relaxed">
                    You have <span className="font-bold">{pendingCount}</span> pending therapy request{pendingCount !== 1 ? 's' : ''} waiting for your response and <span className="font-bold">{scheduledCount}</span> scheduled session{scheduledCount !== 1 ? 's' : ''}. 
                    Review assignments and share your professional insights with our student community in the next sections.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ASSIGNMENTS TAB */}
            {activeTab === 'assignments' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Filter Buttons */}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filter === 'pending'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    Pending ({pendingCount})
                  </button>
                  <button
                    onClick={() => setFilter('scheduled')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filter === 'scheduled'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    Scheduled ({scheduledCount})
                  </button>
                </div>

                {/* Requests List */}
                <div className="space-y-4">
                  {filter === 'pending' && assignedRequests.length === 0 && (
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
                      <AlertCircle className="mx-auto text-slate-400 mb-3" size={40} />
                      <p className="text-slate-600 font-medium">No pending requests at the moment.</p>
                    </div>
                  )}

                  {filter === 'scheduled' && completedRequests.length === 0 && (
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
                      <AlertCircle className="mx-auto text-slate-400 mb-3" size={40} />
                      <p className="text-slate-600 font-medium">No scheduled sessions yet.</p>
                    </div>
                  )}

                  {filter === 'pending' && assignedRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-900">{request.studentName}</h3>
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getSeverityColor(request.severity)}`}>
                              {request.severity} Priority
                            </span>
                            <span className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-700">
                              {getStatusIcon(request.status)}
                              Pending
                            </span>
                          </div>

                          <div className="space-y-2 text-sm text-slate-600">
                            <p><span className="font-medium">Issue:</span> {request.issue}</p>
                            <div className="flex items-center gap-4 flex-wrap">
                              <p className="flex items-center gap-1">
                                <Phone size={14} />
                                <span>{request.contactNumber}</span>
                              </p>
                              <p className="flex items-center gap-1">
                                <Users size={14} />
                                <span>{request.numberOfPeople} {request.numberOfPeople === 1 ? 'person' : 'people'}</span>
                              </p>
                              {request.requestedDate && (
                                <p className="flex items-center gap-1">
                                  <Check size={14} />
                                  <span>{new Date(request.requestedDate).toLocaleDateString()}</span>
                                </p>
                              )}
                              {request.timeSlot && (
                                <p className="flex items-center gap-1">
                                  <Clock size={14} />
                                  <span>{request.timeSlot}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => acceptRequest(request.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm whitespace-nowrap border border-blue-700 dark:border-blue-500"
                          >
                            <Check size={16} />
                            <span className="hidden sm:inline">Accept</span>
                          </button>
                          <button
                            onClick={() => rejectRequest(request.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm whitespace-nowrap border border-red-700 dark:border-red-500"
                          >
                            <XCircle size={16} />
                            <span className="hidden sm:inline">Reject</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 mt-3">
                        Booked: {request.createdAt ? new Date(request.createdAt).toLocaleString() : 'N/A'}
                      </p>
                    </motion.div>
                  ))}

                  {filter === 'scheduled' && completedRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-900">{request.studentName}</h3>
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getSeverityColor(request.severity)}`}>
                              {request.severity} Priority
                            </span>
                            <span className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle2 size={14} />
                              Scheduled
                            </span>
                          </div>

                          <div className="space-y-2 text-sm text-slate-600">
                            <p><span className="font-medium">Issue:</span> {request.issue}</p>
                            <div className="flex items-center gap-4 flex-wrap">
                              <p className="flex items-center gap-1">
                                <Phone size={14} />
                                <span>{request.contactNumber}</span>
                              </p>
                              <p className="flex items-center gap-1">
                                <Users size={14} />
                                <span>{request.numberOfPeople} {request.numberOfPeople === 1 ? 'person' : 'people'}</span>
                              </p>
                              {request.requestedDate && (
                                <p className="flex items-center gap-1">
                                  <Check size={14} />
                                  <span>{new Date(request.requestedDate).toLocaleDateString()}</span>
                                </p>
                              )}
                              {request.timeSlot && (
                                <p className="flex items-center gap-1">
                                  <Clock size={14} />
                                  <span>{request.timeSlot}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium text-sm text-center">
                          ✓ Scheduled
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 mt-3">
                        Booked: {request.createdAt ? new Date(request.createdAt).toLocaleString() : 'N/A'}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SHARE INSIGHTS TAB */}
            {activeTab === 'insights' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Post Tip Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Share Your Expertise</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Post tips, advice, and insights for students. Your contributions help the community stay mentally healthy.
                  </p>
                  <div className="space-y-3">
                    <textarea
                      value={tipsInput}
                      onChange={(e) => setTipsInput(e.target.value)}
                      placeholder="Share a tip, thought, or advice for students (e.g., 'Managing exam stress: Break study sessions into 25-minute focused blocks...')"
                      className="w-full p-4 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 resize-none"
                      rows="4"
                    />
                    <button
                      onClick={postTip}
                      disabled={!tipsInput.trim()}
                      className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                    >
                      <Send size={18} />
                      <span>Post Insight</span>
                    </button>
                  </div>
                </div>

                {/* Tips List */}
                <div className="space-y-4">
                  {doctorTips.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
                      <Lightbulb className="mx-auto text-slate-400 mb-3" size={40} />
                      <p className="text-slate-600 font-medium">No insights shared yet. Be the first!</p>
                    </div>
                  ) : (
                    doctorTips.map((tip) => (
                      <motion.div
                        key={tip.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold text-slate-900">{tip.doctorName}</h4>
                              <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-medium">
                                {tip.doctorSpecialty}
                              </span>
                            </div>
                            <p className="text-slate-600 leading-relaxed mb-3">{tip.content}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(tip.createdAt).toLocaleDateString()} at {new Date(tip.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 h-screen bg-slate-900 text-white w-72 z-40 flex flex-col lg:hidden"
            >
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center">
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">HealthSupport</h2>
                    <p className="text-xs text-slate-400">Doctor Portal</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('dashboard')
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard size={20} />
                  <span className="font-medium">Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('assignments')
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'assignments'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Clipboard size={20} />
                  <span className="font-medium">Assignments</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('insights')
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'insights'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Lightbulb size={20} />
                  <span className="font-medium">Share Insights</span>
                </button>
              </nav>

              <div className="p-4 border-t border-slate-700">
                <div className="flex items-center gap-3 mb-3 p-3 bg-slate-800 rounded-xl">
                  <UserCircle size={32} className="text-indigo-400" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user?.name || 'Doctor'}</p>
                    <p className="text-xs text-slate-400">{user?.specialization || 'Not specified'}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
