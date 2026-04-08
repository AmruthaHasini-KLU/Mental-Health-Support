# HealthSupport - Mental Health Web Application

A modern, production-level frontend for a comprehensive mental health support platform built with **React**, **Vite**, and **Tailwind CSS**.

## 🎨 Features

### Design Excellence
- **Modern & Clean UI** - Minimal, professional design with calming aesthetic
- **Soft Color Palette** - Indigo, lavender, light blue, soft green colors for psychological comfort
- **Fully Responsive** - Mobile-first approach with seamless tablet and desktop experience
- **Smooth Animations** - Subtle animations using Framer Motion for professional feel
- **Accessibility** - WCAG compliant with proper color contrast and semantic HTML

### Core Pages
- **Home** - Hero section, features showcase, mood tracker preview, testimonials, and CTA
- **Resources** - 6 categories of mental health resources (articles, meditations, workbooks, etc.)
- **Counseling** - Professional therapy session booking with therapist profiles
- **Support Groups** - Community-driven support groups for various mental health topics
- **Login/Signup** - Secure authentication with social login options

### Component Architecture
```
src/
├── components/       # Reusable UI components
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── Features.jsx
│   ├── MoodTracker.jsx
│   ├── Testimonials.jsx
│   ├── CTA.jsx
│   └── Footer.jsx
├── pages/           # Page components
│   ├── Home.jsx
│   ├── Resources.jsx
│   ├── Counseling.jsx
│   ├── SupportGroups.jsx
│   └── Login.jsx
├── layouts/         # Layout wrappers
│   └── Layout.jsx
├── App.jsx          # Main app with routing
├── main.jsx         # Entry point
└── index.css        # Tailwind styles
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Development server:**
```bash
npm run dev
```
Visit `http://localhost:5173` (or shown URL) in your browser.

3. **Build for production:**
```bash
npm run build
```

4. **Preview production build:**
```bash
npm run preview
```

## 📦 Dependencies

### Core
- **React** ^19.2.0 - UI library
- **React Router DOM** ^6.26.0 - Client-side routing
- **Vite** ^7.3.1 - Build tool and dev server

### Styling & Animation
- **Tailwind CSS** ^3.4.1 - Utility-first CSS framework
- **Framer Motion** ^11.0.8 - React animation library
- **Lucide React** ^0.408.0 - Icon library

### Development
- **PostCSS** ^8.4.35 - CSS transformation
- **Autoprefixer** ^10.4.18 - CSS prefixes
- **ESLint** ^9.39.1 - Code linting

## 🎯 Key Features Explained

### 1. **Navbar Component**
- Fixed positioning with glass-morphism effect
- Active route highlighting
- Mobile-responsive hamburger menu
- Quick access to login/signup

### 2. **Hero Section**
- Eye-catching headline with gradient text
- Two prominent CTA buttons
- Trust indicators (therapist count, members, rating)
- Animated floating visual element

### 3. **Features Section**
- 3 premium service cards with hover animations
- Icons from Lucide React
- Smooth card lift effect on hover
- Custom color backgrounds per feature

### 4. **Mood Tracker Preview**
- Animated bar chart with data visualization
- Weekly mood tracking display
- Performance metrics (average mood, best day)
- Inspiration to explore full features

### 5. **Testimonials**
- 3 sample user testimonials
- Star ratings display
- User profile with emoji avatars
- Hover effects and animations

### 6. **Support for All Pages**
- Professional Resources Directory
- Therapist Profiles & Booking
- Support Groups Community
- Comprehensive Auth Pages

## 🎨 Customization Guide

### Colors
Modify color palette in `tailwind.config.js`:
```javascript
colors: {
  primary: { 50: '#f5f3ff', ..., 900: '#4c1d95' },
  calm: { 50: '#f0f9ff', ..., 700: '#0369a1' },
  sage: { 50: '#f6faf5', ..., 700: '#4a7c59' },
}
```

### Fonts
Change fonts in `tailwind.config.js`:
```javascript
fontFamily: {
  sans: ['Your-Font', 'system-ui', 'sans-serif'],
}
```

### Animations
Add custom animations in `tailwind.config.js` under `keyframes` and `animation`:
```javascript
animation: {
  'fade-in': 'fadeIn 0.6s ease-in',
  'slide-up': 'slideUp 0.6s ease-out',
}
```

## 📱 Responsive Design

The application uses mobile-first approach:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

Responsive utilities are used throughout for optimal experience across all devices.

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- High contrast color schemes
- Focus management on interactive elements

## 🔒 Security Considerations

- Login page includes emergency contact info
- TBA: Auth state management
- TBA: Protected routes
- TBA: Secure session handling
- TBA: Input validation

## 📈 Performance Optimization

- Code-splitting with React Router
- Image optimization ready
- Lazy loading animation with Framer Motion
- Minimal CSS with Tailwind utility approach
- Optimized bundle size

## 🎓 Learning Resources

### Tailwind CSS
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- Utility classes for all styling needs
- Custom theme configuration

### Framer Motion
- [Framer Motion Docs](https://www.framer.com/motion/)
- Smooth animations and transitions
- Gesture interactions available

### React Router
- [React Router Docs](https://reactrouter.com/)
- Client-side navigation
- Dynamic route parameters

## 🐛 Troubleshooting

### Tailwind styles not appearing
1. Check `tailwind.config.js` content paths
2. Restart dev server: Ctrl+C then `npm run dev`
3. Clear browser cache

### Build errors
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Try `npm run build`

### Animation not working
- Ensure Framer Motion is installed: `npm install framer-motion`
- Check component is wrapped in `motion.div`

## 📚 File Structure Explanation

**tailwind.config.js** - Tailwind CSS configuration with custom colors and animations
**postcss.config.js** - PostCSS configuration for Tailwind processing
**vite.config.js** - Vite build configuration with React plugin

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag and drop 'dist' folder to Netlify
```

### GitHub Pages
Configure in `vite.config.js` and push to GitHub

## 📋 Checklist for Production

- [ ] Update favicon and meta tags in `index.html`
- [ ] Add analytics integration
- [ ] Implement actual authentication
- [ ] Add error boundary
- [ ] Set up 404 page
- [ ] Configure environment variables
- [ ] Add rate limiting
- [ ] Implement proper error handling
- [ ] Add loading states
- [ ] Test on actual devices

## 🤝 Contributing

Feel free to enhance this template with:
- Additional pages
- Dark mode support
- Multi-language support
- Advanced state management
- Backend integration

## 📄 License

This project is free to use and modify for personal and commercial projects.

## 💡 Tips for Best Results

1. **Mobile Testing** - Always test on real devices
2. **Performance** - Use Lighthouse for audits
3. **Accessibility** - Use axe DevTools extension
4. **Code Quality** - Run `npm run lint` regularly
5. **User Testing** - Get feedback from real users

---

**Built with ❤️ for mental health support** 🧠✨
