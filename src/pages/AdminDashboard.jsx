import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../layouts/Layout'
import { Users, Calendar, AlertTriangle, Plus, Trash2, Edit, CheckCircle, Clock, Activity, X } from 'lucide-react'

export default function AdminDashboard() {
  // --- STATE FOR MANAGEMENT ---
  const [specialists, setSpecialists] = useState([
    { id: 1, name: 'Dr. Aisha Rahman', specialty: 'Academic Burnout', status: 'Active' },
    { id: 2, name: 'Dr. Luis Moreno', specialty: 'Triage Lead', status: 'Active' },
    { id: 3, name: 'Dr. Hannah Chen', specialty: 'Anxiety & Stress', status: 'Active' }
  ])

  const [appointments, setAppointments] = useState([
    { id: 101, student: 'Amrutha Hasini', dr: 'Dr. Aisha', date: 'Feb 25', status: 'Pending' },
    { id: 102, student: 'Sophia Martinez', dr: 'Dr. Luis', date: 'Feb 26', status: 'Pending' },
    { id: 103, student: 'Jacob Chen', dr: 'Dr. Hannah', date: 'Feb 27', status: 'Confirmed' }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [newDr, setNewDr] = useState({ name: '', specialty: '' })
  const [editingDr, setEditingDr] = useState(null)

  // Community Growth stat
  const communityGrowth = 1284

  // --- OPERATIONS ---
  const addSpecialist = () => {
    if (newDr.name && newDr.specialty) {
      setSpecialists([...specialists, { ...newDr, id: Date.now(), status: 'Active' }])
      setShowAddModal(false)
      setNewDr({ name: '', specialty: '' })
    }
  }

  const deleteSpecialist = (id) => {
    setSpecialists(specialists.filter(dr => dr.id !== id))
  }

  const openEditModal = (specialist) => {
    setEditingDr(specialist)
    setShowEditModal(true)
  }

  const updateSpecialist = () => {
    if (editingDr && editingDr.name && editingDr.specialty) {
      setSpecialists(specialists.map(dr => 
        dr.id === editingDr.id ? editingDr : dr
      ))
      setShowEditModal(false)
      setEditingDr(null)
    }
  }

  const confirmAppointment = (id) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: 'Confirmed' } : app
    ))
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900">Admin Operations</h1>
              <p className="text-slate-500 font-medium">Manage specialists and community appointments.</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} /> Add Doctor
            </button>
          </header>

          {/* Community Growth Stat Card */}
          <div className="mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] p-8 shadow-lg text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 font-semibold mb-2">Community Growth</p>
                  <h2 className="text-5xl font-black">{communityGrowth.toLocaleString()}</h2>
                  <p className="text-indigo-100 mt-2">Students joined the platform</p>
                </div>
                <div className="bg-white/20 p-6 rounded-3xl">
                  <Users size={48} className="text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* APPOINTMENT MANAGEMENT */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-2">
                  <Calendar className="text-indigo-600" /> Manage Appointments
                </h3>
                <div className="space-y-4">
                  {appointments.map(app => (
                    <motion.div 
                      key={app.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{app.student}</p>
                        <p className="text-xs text-slate-400">{app.date} • Assigned: {app.dr}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${app.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                          {app.status}
                        </span>
                        {app.status === 'Pending' && (
                          <button 
                            onClick={() => confirmAppointment(app.id)} 
                            className="p-2 bg-white text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* SPECIALIST DIRECTORY (CRUD) */}
            <aside className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-slate-100">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-2">
                <Users className="text-indigo-600" /> Specialist Directory
              </h3>
              <div className="space-y-6">
                <AnimatePresence>
                  {specialists.map(dr => (
                    <motion.div 
                      key={dr.id} 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100"
                    >
                      <p className="font-bold text-slate-900">{dr.name}</p>
                      <p className="text-xs text-slate-500 mb-4">{dr.specialty}</p>
                      <div className="flex gap-2 justify-end pt-4 border-t border-slate-200">
                        <button 
                          onClick={() => openEditModal(dr)}
                          className="p-2 bg-white text-slate-400 hover:text-indigo-600 rounded-lg shadow-sm transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => deleteSpecialist(dr.id)} 
                          className="p-2 bg-white text-slate-400 hover:text-red-600 rounded-lg shadow-sm transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ADD SPECIALIST MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-3xl font-black mb-6">New Specialist</h2>
              <div className="space-y-4 mb-8">
                <input 
                  type="text" 
                  placeholder="Doctor Name" 
                  value={newDr.name} 
                  onChange={(e) => setNewDr({...newDr, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-indigo-300"
                />
                <input 
                  type="text" 
                  placeholder="Specialty (e.g. Anxiety)" 
                  value={newDr.specialty} 
                  onChange={(e) => setNewDr({...newDr, specialty: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-indigo-300"
                />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={addSpecialist} 
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-colors"
                >
                  Add to Team
                </button>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT SPECIALIST MODAL */}
      <AnimatePresence>
        {showEditModal && editingDr && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-3xl font-black mb-6">Edit Specialist</h2>
              <div className="space-y-4 mb-8">
                <input 
                  type="text" 
                  placeholder="Doctor Name" 
                  value={editingDr.name} 
                  onChange={(e) => setEditingDr({...editingDr, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-indigo-300"
                />
                <input 
                  type="text" 
                  placeholder="Specialty" 
                  value={editingDr.specialty} 
                  onChange={(e) => setEditingDr({...editingDr, specialty: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-indigo-300"
                />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={updateSpecialist} 
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-colors"
                >
                  Update
                </button>
                <button 
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingDr(null)
                  }} 
                  className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  )
}
