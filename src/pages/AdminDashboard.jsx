import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderOpen,
  Clipboard,
  Users,
  Activity,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Clock,
  CheckCircle,
  UserCircle,
  Stethoscope,
  MessageSquare,
  LogOut,
  Menu,
  Power,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // --- STATS STATE ---
  const [stats] = useState({
    totalRequests: 47,
    activeDoctors: 12,
    pendingRequests: 15,
    completedSessions: 32
  })

  // --- CONTENT MANAGER STATE (Stress Busters & Yoga) ---
  const [stressBusters, setStressBusters] = useState(() => {
    const saved = localStorage.getItem('stress_busters')
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'Deep Breathing Exercise',
        description: 'Take 5 deep breaths, hold for 4 seconds each time',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400'
      },
      {
        id: 2,
        title: 'Progressive Muscle Relaxation',
        description: 'Tense and relax each muscle group systematically',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
      }
    ]
  })

  const [yogaTechniques, setYogaTechniques] = useState(() => {
    const saved = localStorage.getItem('yoga_techniques')
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'Child\'s Pose',
        description: 'Calming pose that gently stretches the back',
        imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400'
      },
      {
        id: 2,
        title: 'Cat-Cow Stretch',
        description: 'Flowing movement to relieve tension in spine',
        imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400'
      }
    ]
  })

  const [showContentModal, setShowContentModal] = useState(false)
  const [contentType, setContentType] = useState('stress') // 'stress' or 'yoga'
  const [editingContent, setEditingContent] = useState(null)
  const [contentForm, setContentForm] = useState({ title: '', description: '', imageUrl: '' })

  // --- DOCTOR MANAGEMENT STATE ---
  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem('healthsupport_doctors')
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Dr. Sarah Johnson', email: 'dr.sarah@gmail.com', specialization: 'Anxiety & Depression', active: true, createdAt: new Date().toISOString() },
      { id: 2, name: 'Dr. Michael Chen', email: 'dr.michael@gmail.com', specialization: 'PTSD & Trauma', active: true, createdAt: new Date().toISOString() },
      { id: 3, name: 'Dr. Emily Rodriguez', email: 'dr.emily@gmail.com', specialization: 'Academic Stress', active: true, createdAt: new Date().toISOString() },
      { id: 4, name: 'Dr. James Wilson', email: 'dr.james@gmail.com', specialization: 'Relationship Therapy', active: true, createdAt: new Date().toISOString() }
    ]
  })

  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [doctorForm, setDoctorForm] = useState({ name: '', email: '', password: '', specialization: '' })

  // --- THERAPY REQUESTS STATE ---
  const defaultTherapyRequests = [
    {
      id: 1,
      studentName: 'Alex Kumar',
      doctorName: 'Dr. Aisha Rahman',
      contactNumber: '+1 (555) 123-4567',
      numberOfPeople: 1,
      issue: 'Exam Anxiety',
      severity: 'Medium',
      requestedDate: '2026-02-25',
      status: 'Pending'
    },
    {
      id: 2,
      studentName: 'Maria Garcia',
      doctorName: 'Dr. Luis Moreno',
      contactNumber: '+1 (555) 987-6543',
      numberOfPeople: 2,
      issue: 'Depression',
      severity: 'High',
      requestedDate: '2026-02-24',
      status: 'Pending'
    },
    {
      id: 3,
      studentName: 'John Smith',
      doctorName: 'Dr. Hannah Park',
      contactNumber: '+1 (555) 456-7890',
      numberOfPeople: 1,
      issue: 'Stress Management',
      severity: 'Low',
      requestedDate: '2026-02-26',
      status: 'Scheduled'
    },
    {
      id: 4,
      studentName: 'Lisa Chen',
      doctorName: 'Dr. Aisha Rahman',
      contactNumber: '+1 (555) 321-0987',
      numberOfPeople: 3,
      issue: 'Academic Burnout',
      severity: 'High',
      requestedDate: '2026-02-25',
      status: 'Pending'
    }
  ]

  const [therapyRequests, setTherapyRequests] = useState(defaultTherapyRequests)

  const formatStatusLabel = (status) => {
    if (!status) return 'Pending'
    const normalized = status.toString().toLowerCase()
    return normalized.charAt(0).toUpperCase() + normalized.slice(1)
  }

  const normalizeTherapyRequest = (row) => ({
    id: row.id,
    studentName: row.student_name || row.studentName || 'Student',
    doctorName: row.doctor_name || row.doctorName || '',
    contactNumber: row.student_contact || row.contactNumber || '',
    numberOfPeople: row.attendees_count || row.numberOfPeople || 1,
    issue: row.issue ?? 'Therapy Request',
    severity: row.severity || 'Medium',
    requestedDate: row.requested_date || row.requestedDate || '',
    timeSlot: row.time_slot || row.timeSlot || '',
    createdAt: row.created_at || row.createdAt || '',
    status: formatStatusLabel(row.status ?? 'pending')
  })

  // Load therapy requests from Supabase (real-time) and localStorage
  useEffect(() => {
    const fetchTherapyRequests = async () => {
      let allRequests = []

      // Fetch from Supabase if available
      if (supabase) {
        const { data, error } = await supabase
          .from('therapy_requests')
          .select('*')

        if (!error && data) {
          const normalized = data.map(normalizeTherapyRequest)
          allRequests = allRequests.concat(normalized)
        }
      }

      // Also fetch from localStorage to catch recent bookings
      const savedRequests = localStorage.getItem('therapy_requests')
      if (savedRequests) {
        try {
          const localRequests = JSON.parse(savedRequests)
          if (Array.isArray(localRequests)) {
            const normalized = localRequests.map(normalizeTherapyRequest)
            // Avoid duplicates - only add if not already in allRequests
            const existingIds = new Set(allRequests.map(r => r.id))
            const uniqueLocal = normalized.filter(r => !existingIds.has(r.id))
            allRequests = allRequests.concat(uniqueLocal)
          }
        } catch (e) {
          console.error('Error parsing localStorage therapy requests:', e)
        }
      }

      // Set combined results or defaults
      setTherapyRequests(allRequests.length > 0 ? allRequests : defaultTherapyRequests)
    }

    fetchTherapyRequests()

    // Set up Supabase real-time subscription if available
    if (supabase) {
      const channel = supabase
        .channel('therapy-requests-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'therapy_requests' },
          () => {
            fetchTherapyRequests()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [theme])

  // Save stress busters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('stress_busters', JSON.stringify(stressBusters))
  }, [stressBusters])

  // Save yoga techniques to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('yoga_techniques', JSON.stringify(yogaTechniques))
  }, [yogaTechniques])

  // --- CONTENT CRUD OPERATIONS ---
  const openContentModal = (type, item = null) => {
    setContentType(type)
    if (item) {
      setEditingContent(item)
      setContentForm({ title: item.title, description: item.description, imageUrl: item.imageUrl })
    } else {
      setEditingContent(null)
      setContentForm({ title: '', description: '', imageUrl: '' })
    }
    setShowContentModal(true)
  }

  const saveContent = () => {
    if (!contentForm.title || !contentForm.description) return

    const newItem = {
      id: editingContent ? editingContent.id : Date.now(),
      ...contentForm
    }

    if (contentType === 'stress') {
      if (editingContent) {
        setStressBusters(stressBusters.map(item => item.id === editingContent.id ? newItem : item))
      } else {
        setStressBusters([...stressBusters, newItem])
      }
    } else {
      if (editingContent) {
        setYogaTechniques(yogaTechniques.map(item => item.id === editingContent.id ? newItem : item))
      } else {
        setYogaTechniques([...yogaTechniques, newItem])
      }
    }

    setShowContentModal(false)
    setContentForm({ title: '', description: '', imageUrl: '' })
    setEditingContent(null)
  }

  const deleteContent = (type, id) => {
    if (type === 'stress') {
      setStressBusters(stressBusters.filter(item => item.id !== id))
    } else {
      setYogaTechniques(yogaTechniques.filter(item => item.id !== id))
    }
  }

  // --- DOCTOR CRUD OPERATIONS ---
  const openDoctorModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor)
      setDoctorForm({ name: doctor.name, email: doctor.email, password: doctor.password, specialization: doctor.specialization })
    } else {
      setEditingDoctor(null)
      setDoctorForm({ name: '', email: '', password: '', specialization: '' })
    }
    setShowDoctorModal(true)
  }

  const saveDoctor = () => {
    if (!doctorForm.name || !doctorForm.email || !doctorForm.password || !doctorForm.specialization) return
    
    // Validate email format
    if (!doctorForm.email.startsWith('dr.') || !doctorForm.email.endsWith('@gmail.com')) {
      alert('Doctor email must follow format: dr.<name>@gmail.com')
      return
    }

    const newDoctor = {
      id: editingDoctor ? editingDoctor.id : Date.now(),
      ...doctorForm,
      active: editingDoctor ? editingDoctor.active : true,
      createdAt: editingDoctor ? editingDoctor.createdAt : new Date().toISOString()
    }

    let updatedDoctors
    if (editingDoctor) {
      updatedDoctors = doctors.map(doc => doc.id === editingDoctor.id ? newDoctor : doc)
    } else {
      updatedDoctors = [...doctors, newDoctor]
    }
    
    setDoctors(updatedDoctors)
    localStorage.setItem('healthsupport_doctors', JSON.stringify(updatedDoctors))

    setShowDoctorModal(false)
    setDoctorForm({ name: '', email: '', password: '', specialization: '' })
    setEditingDoctor(null)
  }

  const deleteDoctor = (id) => {
    const updated = doctors.filter(doc => doc.id !== id)
    setDoctors(updated)
    localStorage.setItem('healthsupport_doctors', JSON.stringify(updated))
  }

  const toggleDoctorStatus = (id) => {
    const updated = doctors.map(doc =>
      doc.id === id ? { ...doc, active: !doc.active } : doc
    )
    setDoctors(updated)
    localStorage.setItem('healthsupport_doctors', JSON.stringify(updated))
  }

  // --- THERAPY REQUEST OPERATIONS ---
  const updateTherapyRequest = async (id, updates) => {
    if (!supabase) {
      return
    }

    const { error } = await supabase
      .from('therapy_requests')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Failed to update therapy request:', error)
    }
  }

  const acceptTherapyRequest = async (id) => {
    setTherapyRequests(therapyRequests.map(req =>
      req.id === id ? { ...req, status: 'Scheduled' } : req
    ))

    if (supabase) {
      await updateTherapyRequest(id, { status: 'scheduled' })
      return
    }

    const allRequests = therapyRequests.map(req =>
      req.id === id ? { ...req, status: 'Scheduled' } : req
    )
    localStorage.setItem('therapy_requests', JSON.stringify(allRequests.filter(r => !r.issue || r.doctorName)))
  }

  const rejectTherapyRequest = async (id) => {
    setTherapyRequests(therapyRequests.map(req =>
      req.id === id ? { ...req, status: 'Rejected' } : req
    ))

    if (supabase) {
      await updateTherapyRequest(id, { status: 'rejected' })
      return
    }

    const allRequests = therapyRequests.map(req =>
      req.id === id ? { ...req, status: 'Rejected' } : req
    )
    localStorage.setItem('therapy_requests', JSON.stringify(allRequests.filter(r => !r.issue || r.doctorName)))
  }

  const assignRequestToDoctor = async (requestId, doctorName) => {
    const updated = therapyRequests.map(req =>
      req.id === requestId ? { ...req, doctorName, status: 'Pending' } : req
    )
    setTherapyRequests(updated)

    if (supabase) {
      await updateTherapyRequest(requestId, { doctor_name: doctorName, status: 'pending' })
      return
    }

    localStorage.setItem('therapy_requests', JSON.stringify(updated))
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-green-100 text-green-700'
      case 'Pending': return 'bg-yellow-100 text-yellow-700'
      case 'Rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex">
        {/* SIDEBAR */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          className={`fixed left-0 top-0 h-screen bg-slate-900 text-white w-72 z-40 flex flex-col shadow-xl`}
        >
          {/* Logo */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center">
                <Stethoscope size={24} />
              </div>
              <div>
                <h2 className="font-bold text-lg">HealthSupport</h2>
                <p className="text-xs text-slate-400">Admin Panel</p>
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
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'content'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FolderOpen size={20} />
              <span className="font-medium">Content Manager</span>
            </button>

            <button
              onClick={() => setActiveTab('therapy')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'therapy'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Clipboard size={20} />
              <span className="font-medium">Therapy Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('doctors')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'doctors'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Users size={20} />
              <span className="font-medium">Doctor Management</span>
            </button>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-3 p-3 bg-slate-800 rounded-xl">
              <UserCircle size={32} className="text-indigo-400" />
              <div className="flex-1">
                <p className="font-medium text-sm">{user?.name || 'Admin'}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
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
        <div className={`flex-1 ${sidebarOpen ? 'ml-72' : 'ml-0'} transition-all`}>
          {/* Top Bar */}
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-slate-700 dark:text-slate-300" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'content' && 'Content Manager'}
              {activeTab === 'therapy' && 'Therapy Hub'}
              {activeTab === 'doctors' && 'Doctor Management'}
            </h1>
            <div className="w-10"></div>
          </div>

          {/* Content Area */}
          <div className="p-6 bg-white dark:bg-[#0f172a]">
            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                        <Clipboard className="text-indigo-600 dark:text-indigo-400" size={24} />
                      </div>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalRequests}</span>
                    </div>
                    <h3 className="text-slate-600 dark:text-slate-300 font-medium">Total Requests</h3>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                        <Users className="text-green-600 dark:text-green-400" size={24} />
                      </div>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeDoctors}</span>
                    </div>
                    <h3 className="text-slate-600 dark:text-slate-300 font-medium">Active Doctors</h3>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                        <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
                      </div>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pendingRequests}</span>
                    </div>
                    <h3 className="text-slate-600 dark:text-slate-300 font-medium">Pending Requests</h3>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <CheckCircle className="text-blue-600 dark:text-blue-400" size={24} />
                      </div>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completedSessions}</span>
                    </div>
                    <h3 className="text-slate-600 dark:text-slate-300 font-medium">Completed Sessions</h3>
                  </div>
                </div>

                {/* Quick Overview */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-2xl text-white">
                  <h2 className="text-2xl font-bold mb-2">Welcome to HealthSupport Admin</h2>
                  <p className="text-indigo-100">
                    Manage therapy requests, content, and doctors all in one place. Navigate using the sidebar to get started.
                  </p>
                </div>
              </motion.div>
            )}

            {/* CONTENT MANAGER TAB */}
            {activeTab === 'content' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stress Busters Section */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Stress Busters</h2>
                    <button
                      onClick={() => openContentModal('stress')}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus size={18} />
                      <span>Add Stress Buster</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stressBusters.map((item) => (
                      <div key={item.id} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{item.description}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openContentModal('stress', item)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-500 transition-colors"
                          >
                            <Edit2 size={14} />
                            <span className="text-sm">Edit</span>
                          </button>
                          <button
                            onClick={() => deleteContent('stress', item.id)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white dark:bg-slate-600 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-slate-500 transition-colors"
                          >
                            <Trash2 size={14} />
                            <span className="text-sm">Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Yoga Techniques Section */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Yoga Techniques</h2>
                    <button
                      onClick={() => openContentModal('yoga')}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus size={18} />
                      <span>Add Yoga Technique</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {yogaTechniques.map((item) => (
                      <div key={item.id} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{item.description}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openContentModal('yoga', item)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-500 transition-colors"
                          >
                            <Edit2 size={14} />
                            <span className="text-sm">Edit</span>
                          </button>
                          <button
                            onClick={() => deleteContent('yoga', item.id)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white dark:bg-slate-600 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-slate-500 transition-colors"
                          >
                            <Trash2 size={14} />
                            <span className="text-sm">Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* THERAPY HUB TAB */}
            {activeTab === 'therapy' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Therapy Requests</h2>
                  <div className="space-y-3">
                    {therapyRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-slate-900 dark:text-white">{request.studentName}</h3>
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getSeverityColor(request.severity)}`}>
                              {request.severity} Priority
                            </span>
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                            <span className="font-medium">Issue:</span> {request.issue}
                          </p>
                          {request.doctorName && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                              <span className="font-medium">Assigned Doctor:</span> {request.doctorName}
                            </p>
                          )}
                          {request.contactNumber && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                              <span className="font-medium">Contact:</span> {request.contactNumber}
                            </p>
                          )}
                          {request.numberOfPeople && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                              <span className="font-medium">Attendees:</span> {request.numberOfPeople} {request.numberOfPeople === 1 ? 'person' : 'people'}
                            </p>
                          )}
                          {request.requestedDate && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-medium">Date:</span> {new Date(request.requestedDate).toLocaleDateString()}
                            </p>
                          )}
                          {request.timeSlot && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-medium">Time:</span> {request.timeSlot}
                            </p>
                          )}
                          {request.createdAt && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                              Booked: {new Date(request.createdAt).toLocaleString()}
                            </p>
                          )}
                        </div>

                        {/* Doctor Assignment & Actions */}
                        <div className="flex flex-col gap-2 ml-4">
                          {!request.doctorName || request.status === 'Pending' ? (
                            <>
                              <select
                                value={request.doctorName || ''}
                                onChange={(e) => assignRequestToDoctor(request.id, e.target.value)}
                                className="px-3 py-2 border border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              >
                                <option value="">Assign Doctor...</option>
                                {doctors.filter(d => d.active).map(doctor => (
                                  <option key={doctor.id} value={doctor.name}>
                                    {doctor.name} ({doctor.specialization})
                                  </option>
                                ))}
                              </select>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => acceptTherapyRequest(request.id)}
                                  className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium border border-blue-700 dark:border-blue-500"
                                >
                                  <Check size={14} />
                                  Accept
                                </button>
                                <button
                                  onClick={() => rejectTherapyRequest(request.id)}
                                  className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium border border-red-700 dark:border-red-500"
                                >
                                  <X size={14} />
                                  Reject
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="text-center">
                              <div className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                                ✓ Assigned to {request.doctorName}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* DOCTOR MANAGEMENT TAB */}
            {activeTab === 'doctors' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Doctor Accounts</h2>
                    <button
                      onClick={() => openDoctorModal()}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus size={18} />
                      <span>Add Doctor</span>
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="text-left py-3 px-4 text-sm font-bold text-slate-700 dark:text-slate-300">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-bold text-slate-700 dark:text-slate-300">Email</th>
                          <th className="text-left py-3 px-4 text-sm font-bold text-slate-700 dark:text-slate-300">Specialization</th>
                          <th className="text-left py-3 px-4 text-sm font-bold text-slate-700 dark:text-slate-300">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-bold text-slate-700 dark:text-slate-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctors.map((doctor) => (
                          <tr key={doctor.id} className={`border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 ${!doctor.active ? 'opacity-60' : ''}`}>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                                  <Stethoscope className="text-indigo-600 dark:text-indigo-400" size={18} />
                                </div>
                                <span className="font-medium text-slate-900 dark:text-white">{doctor.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-slate-600 dark:text-slate-300 text-sm">{doctor.email}</td>
                            <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{doctor.specialization}</td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                  doctor.active
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {doctor.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => toggleDoctorStatus(doctor.id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    doctor.active
                                      ? 'text-amber-600 hover:bg-amber-50'
                                      : 'text-green-600 hover:bg-green-50'
                                  }`}
                                  title={doctor.active ? 'Deactivate' : 'Activate'}
                                >
                                  {doctor.active ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                <button
                                  onClick={() => openDoctorModal(doctor)}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => deleteDoctor(doctor.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT MODAL (Stress Busters & Yoga) */}
      <AnimatePresence>
        {showContentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                {editingContent ? 'Edit' : 'Add'} {contentType === 'stress' ? 'Stress Buster' : 'Yoga Technique'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={contentForm.title}
                    onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                  <textarea
                    value={contentForm.description}
                    onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows="3"
                    placeholder="Enter description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image URL (optional)</label>
                  <input
                    type="text"
                    value={contentForm.imageUrl}
                    onChange={(e) => setContentForm({ ...contentForm, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveContent}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  {editingContent ? 'Update' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setShowContentModal(false)
                    setContentForm({ title: '', description: '', imageUrl: '' })
                    setEditingContent(null)
                  }}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DOCTOR MODAL */}
      <AnimatePresence>
        {showDoctorModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                {editingDoctor ? 'Edit Doctor' : 'Add Doctor'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email (dr.name@gmail.com)</label>
                  <input
                    type="email"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    disabled={editingDoctor ? true : false}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-600"
                    placeholder="dr.john@gmail.com"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Format: dr.{'{name}'}@gmail.com</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={doctorForm.password}
                    onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Secure password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Specialization</label>
                  <input
                    type="text"
                    value={doctorForm.specialization}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Anxiety & Depression"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveDoctor}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  {editingDoctor ? 'Update' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setShowDoctorModal(false)
                    setDoctorForm({ name: '', email: '', password: '', specialization: '' })
                    setEditingDoctor(null)
                  }}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
