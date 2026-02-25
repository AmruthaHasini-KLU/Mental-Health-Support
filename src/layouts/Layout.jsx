import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
