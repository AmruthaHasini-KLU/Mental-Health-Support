import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../layouts/Layout'
import { User, Calendar, Clock, Bookmark, X, ArrowRight, BookOpen, Check, Sparkles, ShoppingCart, ThumbsUp } from 'lucide-react'

export default function Counseling() {
  const [selectedTherapist, setSelectedTherapist] = useState(null)
  const [bookingStatus, setBookingStatus] = useState(null)
  const [activeBook, setActiveBook] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
  const [bookingDetails, setBookingDetails] = useState({
    drName: '',
    date: '',
    timeBlock: 'Early Morning (08:00 - 10:00)'
  })

  const therapists = [
    { id: 1, name: 'Dr. Aisha Rahman', specialty: 'Academic Burnout Specialist', availability: ['Feb 25 - 10:00 AM', 'Feb 26 - 11:00 AM'] },
    { id: 2, name: 'Dr. Luis Moreno', specialty: 'High-Anxiety & Triage Lead', availability: ['Feb 26 - 09:00 AM', 'Feb 27 - 01:00 PM'] },
    { id: 3, name: 'Dr. Hannah Park', specialty: 'Clinical Sleep Specialist', availability: ['Feb 26 - 03:00 PM', 'Feb 28 - 10:00 AM'] }
  ]

  const famousBooks = [
    { 
      title: "Why Zebras Don't Get Ulcers", 
      author: "Robert Sapolsky", 
      tag: "SCIENCE OF STRESS", 
      summary: "Understand how chronic stress impacts your biology and how to manage 'mental lions.'",
      shopLink: "https://www.google.com/search?tbm=shop&q=Why+Zebras+Don%27t+Get+Ulcers+Robert+Sapolsky" 
    },
    { 
      title: "Deep Work", 
      author: "Cal Newport", 
      tag: "FOCUS", 
      summary: "A guide on how to foster intense focus to kill stress and increase productivity.",
      shopLink: "https://www.google.com/search?tbm=shop&q=Deep+Work+Cal+Newport" 
    },
    { 
      title: "The Upward Spiral", 
      author: "Alex Korb", 
      tag: "BRAIN HEALTH", 
      summary: "Uses neuroscience to show how small lifestyle changes can reverse stress spirals.",
      shopLink: "https://www.google.com/search?tbm=shop&q=The+Upward+Spiral+Alex+Korb" 
    },
    { 
      title: "The 7 Habits of Highly Effective People", 
      author: "Stephen Covey", 
      tag: "MANAGEMENT", 
      summary: "Focus on your 'Circle of Influence' to stop panicking about things you cannot control.",
      shopLink: "https://www.google.com/search?tbm=shop&q=The+7+Habits+of+Highly+Effective+People+Stephen+Covey" 
    },
    { 
      title: "Man's Search for Meaning", 
      author: "Viktor Frankl", 
      tag: "RESILIENCE", 
      summary: "Finding a clear 'Why' for your studies helps you survive any difficult 'How' during semesters.",
      shopLink: "https://www.google.com/search?tbm=shop&q=Man%27s+Search+for+Meaning+Viktor+Frankl" 
    },
    { 
      title: "Flow", 
      author: "Mihaly Csikszentmihalyi", 
      tag: "MINDSET", 
      summary: "Learn to enter the 'Flow' state where tasks feel effortless and stress disappears.",
      shopLink: "https://www.google.com/search?tbm=shop&q=Flow+Mihaly+Csikszentmihalyi" 
    }
  ]

  const handleOpenModal = (dr) => {
    setBookingDetails({ ...bookingDetails, drName: dr.name })
    setShowModal(true)
  }

  const confirmFinalBooking = () => {
    setBookingStatus({ dr: bookingDetails.drName, date: bookingDetails.date || "Selected Date" })
    setShowModal(false)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-12 px-4 md:py-20 font-sans">
        <div className="max-w-6xl mx-auto">
          
          <header className="mb-16 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles size={14} /> Care Triage Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Support Triage & Wisdom</h1>
          </header>

          {/* 1. CARE TRIAGE SECTION */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {therapists.map((dr) => (
              <div key={dr.id} className={`bg-white border-2 rounded-[2.5rem] p-8 transition-all h-fit ${selectedTherapist === dr.id ? 'border-indigo-500 shadow-xl' : 'border-slate-100 shadow-sm'}`}>
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-400">
                  <User size={30} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">{dr.name}</h3>
                <p className="text-indigo-600 font-bold text-sm mb-8">{dr.specialty}</p>
                <button onClick={() => setSelectedTherapist(selectedTherapist === dr.id ? null : dr.id)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                  <Calendar size={18} /> View Slots
                </button>
                <AnimatePresence>
                  {selectedTherapist === dr.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                      {dr.availability.map((time) => (
                        <button key={time} onClick={() => handleOpenModal(dr)} className="w-full py-3 px-5 bg-indigo-50/50 text-indigo-700 rounded-2xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-between group">
                          {time} <Clock size={16} />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* 2. EXPANDED WELLNESS LIBRARY */}
          <section className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-16">
              <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                <Bookmark size={32} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">The Wellness Library</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
              {famousBooks.map((book) => (
                <div key={book.title} className="flex flex-col h-full group bg-slate-50/50 p-8 rounded-[2rem] border border-transparent hover:border-indigo-100 hover:bg-white transition-all shadow-sm">
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-white text-slate-400 text-[10px] font-black tracking-widest rounded-lg border border-slate-100 uppercase">
                      {book.tag}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{book.title}</h4>
                  <p className="text-sm font-bold text-slate-400 mb-6 italic">by {book.author}</p>
                  
                  <div className="mt-auto space-y-4">
                    <button onClick={() => setActiveBook(book)} className="flex items-center gap-2 text-indigo-600 text-xs font-bold group/btn">
                      READ SUMMARY <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <a href={book.shopLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                      <ShoppingCart size={14} /> SHOP ON GOOGLE
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 3. MODALS & SUCCESS OVERLAY */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={() => setShowModal(false)}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Schedule Consultation</h3>
                <div className="space-y-6 mb-10 text-left">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Select Date</label>
                    <input type="date" onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})} className="mt-2 w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" />
                  </div>
                </div>
                <button onClick={confirmFinalBooking} disabled={!bookingDetails.date} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 disabled:opacity-50">Confirm Booking</button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {bookingStatus && (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] p-12 max-w-sm w-full text-center shadow-2xl border-4 border-indigo-50">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><ThumbsUp size={40} /></div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Confirmed!</h2>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">Your session with <span className="text-indigo-600 font-bold">{bookingStatus.dr}</span> on <span className="text-indigo-600 font-bold">{bookingStatus.date}</span> is booked.</p>
                <button onClick={() => { setBookingStatus(null); setSelectedTherapist(null); }} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black">Close</button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {activeBook && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={() => setActiveBook(null)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[3rem] p-10 max-w-lg w-full relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setActiveBook(null)} className="absolute top-8 right-8 text-slate-300"><X size={28} /></button>
              <div className="p-4 bg-indigo-50 rounded-2xl w-fit text-indigo-600 mb-8"><BookOpen size={30} /></div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">{activeBook.title}</h3>
              <p className="text-slate-600 leading-relaxed text-xl font-medium">{activeBook.summary}</p>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  )
}