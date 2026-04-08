import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Resources', path: '/resources' },
    { label: 'Therapy', path: '/therapy' },
    { label: 'Support Groups', path: '/support-groups' },
  ]

  const resources = [
    { label: 'Blog', path: '#' },
    { label: 'Guides', path: '#' },
    { label: 'FAQ', path: '#' },
    { label: 'Testimonials', path: '#' },
  ]

  const company = [
    { label: 'About Us', path: '#' },
    { label: 'Careers', path: '#' },
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms of Service', path: '#' },
  ]

  const socialLinks = [
    { icon: Facebook, url: '#', label: 'Facebook' },
    { icon: Twitter, url: '#', label: 'Twitter' },
    { icon: Linkedin, url: '#', label: 'LinkedIn' },
    { icon: Instagram, url: '#', label: 'Instagram' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold">HS</span>
              </div>
              <span className="font-bold text-lg text-white">HealthSupport</span>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Your trusted partner in mental health and wellness.
            </p>
            
            {/* Emergency Contact */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <p className="text-xs font-semibold text-primary-400 mb-2">EMERGENCY SUPPORT</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Phone size={16} />
                <a href="tel:1-988-4357826" className="hover:text-primary-400 transition-colors">
                  1-988-435-7826
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              {company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">
              Get In Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:support@healthsupport.com" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  support@healthsupport.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123 Wellness Ave, Health City, HC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-12"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-400">
            © {currentYear} HealthSupport. All rights reserved. Providing mental health support with compassion and care.
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.url}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors group"
                >
                  <Icon size={18} className="text-gray-400 group-hover:text-white" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
