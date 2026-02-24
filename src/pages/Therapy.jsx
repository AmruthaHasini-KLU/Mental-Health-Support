import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../layouts/Layout'
import { User, Phone, Users, X, ArrowRight, BookOpen, Check, Sparkles, ShoppingCart, Bookmark, Clock } from 'lucide-react'

export default function Therapy() {
  const [selectedTherapist, setSelectedTherapist] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [activeBook, setActiveBook] = useState(null)
  const [therapists, setTherapists] = useState([])
  
  const [bookingForm, setBookingForm] = useState({
    doctorName: '',
    contactNumber: '',
    numberOfPeople: 1,
    studentName: 'Current User', // Would come from auth context
    issue: 'General Consultation',
    severity: 'Medium',
    requestedDate: '',
    timeSlot: ''
  })

  // Load doctors dynamically from localStorage
  useEffect(() => {
    const doctors = JSON.parse(localStorage.getItem('healthsupport_doctors') || '[]')
    const activeDoctors = doctors
      .filter(doc => doc.active)
      .map(doc => ({
        id: doc.id,
        name: doc.name,
        specialty: doc.specialization || 'General Wellness'
      }))
    
    // If no doctors are registered yet, show default ones
    if (activeDoctors.length === 0) {
      setTherapists([
        { id: 1, name: 'Dr. Aisha Rahman', specialty: 'Academic Burnout Specialist' },
        { id: 2, name: 'Dr. Luis Moreno', specialty: 'High-Anxiety & Stress Management' },
        { id: 3, name: 'Dr. Hannah Park', specialty: 'Clinical Sleep Specialist' }
      ])
    } else {
      setTherapists(activeDoctors)
    }
  }, [])

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

  const handleOpenBookingModal = (therapist) => {
    setBookingForm({ ...bookingForm, doctorName: therapist.name })
    setSelectedTherapist(therapist)
    setShowBookingModal(true)
  }

  const handleConfirmBooking = () => {
    if (!bookingForm.contactNumber || !bookingForm.numberOfPeople || !bookingForm.requestedDate || !bookingForm.timeSlot) {
      return
    }

    // Save to therapy_requests (would integrate with backend/localStorage)
    const therapyRequest = {
      id: Date.now(),
      studentName: bookingForm.studentName,
      doctorName: bookingForm.doctorName,
      contactNumber: bookingForm.contactNumber,
      numberOfPeople: bookingForm.numberOfPeople,
      issue: bookingForm.issue,
      severity: bookingForm.severity,
      requestedDate: bookingForm.requestedDate,
      timeSlot: bookingForm.timeSlot,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    }
    
    // Save to localStorage for admin to see
    const existingRequests = JSON.parse(localStorage.getItem('therapy_requests') || '[]')
    existingRequests.push(therapyRequest)
    localStorage.setItem('therapy_requests', JSON.stringify(existingRequests))
    
    setShowBookingModal(false)
    setBookingSuccess(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setBookingForm({
        doctorName: '',
        contactNumber: '',
        numberOfPeople: 1,
        studentName: 'Current User',
        issue: 'General Consultation',
        severity: 'Medium',
        requestedDate: '',
        timeSlot: ''
      })
      setSelectedTherapist(null)
    }, 500)
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 md:py-20 font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="max-w-6xl mx-auto">
          
          <header className="mb-16 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--primary-blue)', border: '1px solid' }}>
              <Sparkles size={14} /> Therapy Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>Professional Therapy & Wellness</h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Connect with our experienced therapists for personalized support and guidance.
            </p>
          </header>

          {/* 1. THERAPY BOOKING SECTION */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {therapists.map((therapist) => (
              <div key={therapist.id} className="border-2 rounded-[2.5rem] p-8 transition-all shadow-sm hover:shadow-lg" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--primary-blue)' }}>
                  <User size={30} />
                </div>
                <h3 className="text-2xl font-bold leading-tight mb-2" style={{ color: 'var(--text-primary)' }}>{therapist.name}</h3>
                <p className="font-bold text-sm mb-8" style={{ color: 'var(--primary-blue)' }}>{therapist.specialty}</p>
                <button 
                  onClick={() => handleOpenBookingModal(therapist)} 
                  className="w-full py-4 text-white rounded-2xl font-black transition-all shadow-md"
                  style={{ backgroundColor: 'var(--primary-blue)' }}
                >
                  Book Therapy
                </button>
              </div>
            ))}
          </div>

          {/* 2. WELLNESS LIBRARY */}
          <section className="rounded-[3.5rem] p-10 md:p-16 border transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-4 mb-16">
              <div className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--primary-blue)' }}>
                <Bookmark size={32} />
              </div>
              <h2 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>The Wellness Library</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
              {famousBooks.map((book) => (
                <div key={book.title} className="flex flex-col h-full group p-8 rounded-[2rem] border transition-all" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                  <div className="mb-4">
                    <span className="px-3 py-1 text-[10px] font-black tracking-widest rounded-lg border uppercase transition-colors" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
                      {book.tag}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 leading-tight transition-colors group-hover:" style={{ color: 'var(--text-primary)' }}>{book.title}</h4>
                  <p className="text-sm font-bold mb-6 italic" style={{ color: 'var(--text-secondary)' }}>by {book.author}</p>
                  
                  <div className="mt-auto space-y-4">
                    <button onClick={() => setActiveBook(book)} className="flex items-center gap-2 text-xs font-bold group/btn" style={{ color: 'var(--primary-blue)' }}>
                      READ SUMMARY <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <a href={book.shopLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 border text-xs font-bold rounded-xl transition-all" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                      <ShoppingCart size={14} /> SHOP ON GOOGLE
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* BOOKING MODAL */}
        <AnimatePresence>
          {showBookingModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={() => setShowBookingModal(false)}>
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }}
                className="rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border" 
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Book Therapy</h3>
                  <button onClick={() => setShowBookingModal(false)} style={{ color: 'var(--text-tertiary)' }}>
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>Therapist</p>
                  <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{bookingForm.doctorName}</p>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <label className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <Phone size={16} style={{ color: 'var(--primary-blue)' }} />
                      Contact Number
                    </label>
                    <input 
                      type="tel" 
                      value={bookingForm.contactNumber}
                      onChange={(e) => setBookingForm({...bookingForm, contactNumber: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                      className="w-full p-4 rounded-2xl font-medium outline-none transition-all"
                      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', border: '1px solid' }}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <Users size={16} style={{ color: 'var(--primary-blue)' }} />
                      Number of People Attending
                    </label>
                    <input 
                      type="number" 
                      min="1"
                      max="10"
                      value={bookingForm.numberOfPeople}
                      onChange={(e) => setBookingForm({...bookingForm, numberOfPeople: parseInt(e.target.value) || 1})}
                      className="w-full p-4 rounded-2xl font-medium outline-none transition-all"
                      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', border: '1px solid' }}
                      required
                    />
                    <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>Include yourself and any companions (max 10)</p>
                  </div>

                  <div>
                    <label className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <Check size={16} style={{ color: 'var(--primary-blue)' }} />
                      Preferred Date
                    </label>
                    <input 
                      type="date" 
                      value={bookingForm.requestedDate}
                      onChange={(e) => setBookingForm({...bookingForm, requestedDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-4 rounded-2xl font-medium outline-none transition-all"
                      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', border: '1px solid' }}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <Clock size={16} style={{ color: 'var(--primary-blue)' }} />
                      Preferred Time Slot
                    </label>
                    <select 
                      value={bookingForm.timeSlot}
                      onChange={(e) => setBookingForm({...bookingForm, timeSlot: e.target.value})}
                      className="w-full p-4 rounded-2xl font-medium outline-none transition-all"
                      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', border: '1px solid' }}
                      required
                    >
                      <option value="">Select a time slot</option>
                      <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                      <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                      <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                      <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                      <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleConfirmBooking}
                  disabled={!bookingForm.contactNumber || bookingForm.numberOfPeople < 1 || !bookingForm.requestedDate || !bookingForm.timeSlot}
                  className="w-full py-4 rounded-2xl font-black shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{ backgroundColor: 'var(--primary-blue)', color: '#fff' }}
                >
                  Confirm Booking
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* SUCCESS MESSAGE */}
        <AnimatePresence>
          {bookingSuccess && (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.8, opacity: 0 }}
                className="rounded-[3rem] p-12 max-w-sm w-full text-center shadow-2xl border-4"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--bg-tertiary)' }}
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--primary-blue)' }}>
                  <Check size={40} strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>Appointment Booked Successfully!</h2>
                <p className="font-medium mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Your therapy request has been sent. Our admin team will review and confirm your appointment shortly.
                </p>
                <button 
                  onClick={() => setBookingSuccess(false)} 
                  className="w-full py-4 rounded-2xl font-black transition-colors"
                  style={{ backgroundColor: 'var(--primary-blue)', color: '#fff' }}
                >
                  Done
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* BOOK SUMMARY MODAL */}
        {activeBook && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={() => setActiveBook(null)}>
            <motion.div 
              initial={{ scale: 0.9, y: 30 }} 
              animate={{ scale: 1, y: 0 }} 
              className="rounded-[3rem] p-10 max-w-lg w-full relative shadow-2xl border"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setActiveBook(null)} className="absolute top-8 right-8 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                <X size={28} />
              </button>
              <div className="p-4 rounded-2xl w-fit mb-8" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--primary-blue)' }}>
                <BookOpen size={30} />
              </div>
              <h3 className="text-3xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>{activeBook.title}</h3>
              <p className="leading-relaxed text-xl font-medium" style={{ color: 'var(--text-primary)' }}>{activeBook.summary}</p>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  )
}
