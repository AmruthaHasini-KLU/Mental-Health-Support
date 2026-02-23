import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../layouts/Layout'
import { User, Star, Clock, Calendar, Check, Bookmark, X, ArrowRight, BookOpen } from 'lucide-react'

export default function Counseling() {
  const [selectedTherapist, setSelectedTherapist] = useState(null)
  const [bookingStatus, setBookingStatus] = useState(null)
  const [activeBook, setActiveBook] = useState(null)

  const therapists = [
    {
      id: 1,
      name: 'Dr. Aisha Rahman',
      specialty: 'Academic Burnout Specialist',
      experience: '11 Years',
      rating: 4.9,
      availability: ['Feb 25 - 10:00 AM', 'Feb 25 - 02:00 PM', 'Feb 26 - 11:00 AM']
    },
    {
      id: 2,
      name: 'Dr. Luis Moreno',
      specialty: 'High-Anxiety & Triage Lead',
      experience: '9 Years',
      rating: 5.0,
      availability: ['Feb 25 - 09:00 AM', 'Feb 27 - 01:00 PM', 'Feb 27 - 04:00 PM']
    },
    {
      id: 3,
      name: 'Dr. Hannah Park',
      specialty: 'Clinical Sleep Specialist',
      experience: '10 Years',
      rating: 4.8,
      availability: ['Feb 26 - 03:00 PM', 'Feb 26 - 05:00 PM', 'Feb 28 - 10:00 AM']
    }
  ]

  const famousBooks = [
    {
      title: "Why Zebras Don't Get Ulcers",
      author: "Robert Sapolsky",
      tag: "Science of Stress",
      summary: "Zebras only feel stress when a lion chases them. Humans feel stress over exams that haven't even happened yet. The lesson? Your body is reacting to 'mental lions.' To stop the ulcer, you have to tell your brain the lion isn't real right now."
    },
    {
      title: "Deep Work",
      author: "Cal Newport",
      tag: "Focus",
      summary: "Stress usually comes from 'shallow work' (checking notifications). The fix is 90 minutes of zero-distraction focus. When you actually get work done, your anxiety naturally drops."
    },
    {
      title: "The Upward Spiral",
      author: "Alex Korb",
      tag: "Brain Health",
      summary: "Your brain can get stuck in a 'downward spiral' of worry. One tiny positive action—like naming one thing you're grateful for—starts an 'upward spiral' that resets your neurochemistry."
    },
    {
      title: "The 7 Habits of Highly Effective People",
      author: "Stephen Covey",
      tag: "Management",
      summary: "Focus on your 'Circle of Influence.' If you worry about things you can't control (like how hard the exam will be), stress grows. If you focus on what you CAN do, stress shrinks."
    },
    {
      title: "Man's Search for Meaning",
      author: "Viktor Frankl",
      tag: "Resilience",
      summary: "The ultimate stress-killer is 'Purpose.' Even when things are hard, if you know WHY you are doing this, you can survive almost any HOW."
    },
    {
      title: "Flow",
      author: "Mihaly Csikszentmihalyi",
      tag: "Mindset",
      summary: "Stress happens when a task is too hard. Boredom happens when it's too easy. 'Flow' is that sweet spot in the middle where you lose track of time."
    }
  ]

  const handleBooking = (time) => {
    setBookingStatus(`Booking confirmed with ${selectedTherapist.name} for ${time}`)
    setTimeout(() => {
      setBookingStatus(null)
      setSelectedTherapist(null)
    }, 3000)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-12 px-4 md:py-20 font-sans">
        <div className="max-w-6xl mx-auto">
          
          <header className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Support Triage & Wisdom Hub</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto italic">
              "Hey, let's build a fresh day. Master your stress with our library or book a session for advanced care."
            </p>
          </header>

          {/* 1. CARE TRIAGE SECTION (Booking) */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {therapists.map((dr) => (
              <motion.div 
                key={dr.id}
                className={`bg-white border-2 rounded-[2rem] p-8 transition-all ${selectedTherapist?.id === dr.id ? 'border-indigo-500 shadow-2xl' : 'border-slate-100 shadow-sm'}`}
              >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-400">
                  <User size={30} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{dr.name}</h3>
                <p className="text-indigo-600 font-bold text-sm mb-6">{dr.specialty}</p>
                
                <button 
                  onClick={() => setSelectedTherapist(dr)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar size={18} /> View Slots
                </button>

                <AnimatePresence>
                  {selectedTherapist?.id === dr.id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-slate-100 space-y-3"
                    >
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Available Sessions:</p>
                      {dr.availability.map((time) => (
                        <button 
                          key={time}
                          onClick={() => handleBooking(time)}
                          className="w-full py-3 px-5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all flex items-center justify-between group"
                        >
                          {time} <Clock size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* 2. NEATLY ORGANIZED WELLNESS LIBRARY */}
          <section className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-16">
              <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                <Bookmark size={32} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">The Wellness Library</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {famousBooks.map((book) => (
                <motion.div 
                  key={book.title} 
                  whileHover={{ y: -8 }}
                  className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 transition-all hover:bg-white hover:shadow-2xl hover:border-indigo-100 group"
                >
                  <div className="mb-6">
                    <span className="px-4 py-1.5 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-50 shadow-sm">
                      {book.tag}
                    </span>
                  </div>

                  <div className="flex-grow">
                    <h4 className="text-2xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                      {book.title}
                    </h4>
                    <p className="text-sm font-bold text-slate-400 mb-6">
                      by {book.author}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-200/60">
                    <button 
                      onClick={() => setActiveBook(book)}
                      className="flex items-center justify-between w-full text-indigo-600 text-sm font-black group/btn"
                    >
                      <span>Read Quick Summary</span>
                      <div className="p-2 rounded-full bg-indigo-50 group-hover/btn:bg-indigo-600 group-hover/btn:text-white transition-all shadow-sm">
                        <ArrowRight size={18} />
                      </div>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* 3. INTERACTIVE SUMMARY MODAL */}
        <AnimatePresence>
          {activeBook && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
              onClick={() => setActiveBook(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => setActiveBook(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
                  <X size={28} />
                </button>
                <div className="p-4 bg-indigo-50 rounded-2xl w-fit text-indigo-600 mb-8">
                  <BookOpen size={30} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{activeBook.title}</h3>
                <p className="text-xs font-black text-indigo-500 mb-8 uppercase tracking-widest">The Core Lesson:</p>
                <p className="text-slate-600 leading-relaxed text-xl font-medium">{activeBook.summary}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. BOOKING SUCCESS TOAST */}
        <AnimatePresence>
          {bookingStatus && (
            <motion.div 
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-12 left-1/2 bg-slate-900 text-white px-10 py-5 rounded-full shadow-2xl flex items-center gap-4 z-50 border border-slate-700"
            >
              <div className="bg-green-500 p-1.5 rounded-full shadow-inner"><Check size={20} className="text-white" /></div>
              <span className="font-bold tracking-tight text-sm md:text-base">{bookingStatus}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}