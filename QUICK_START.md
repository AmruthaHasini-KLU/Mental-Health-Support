# Quick Start Guide - HealthSupport

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

### 3. Build for Production
```bash
npm run build
npm run preview  # Test production build
```

---

## 📂 Project Structure Overview

```
healthsupport/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation bar
│   │   ├── Hero.jsx        # Hero section
│   │   ├── Features.jsx    # Features showcase
│   │   ├── MoodTracker.jsx # Mood tracking chart
│   │   ├── Testimonials.jsx # User reviews
│   │   ├── CTA.jsx         # Call-to-action
│   │   ├── Footer.jsx      # Footer
│   │   └── index.js        # Component exports
│   ├── pages/              # Page components (full pages)
│   │   ├── Home.jsx        # Home page
│   │   ├── Resources.jsx   # Resources page
│   │   ├── Counseling.jsx  # Counseling page
│   │   ├── SupportGroups.jsx # Support groups
│   │   └── Login.jsx       # Login/Signup
│   ├── layouts/            # Layout wrappers
│   │   └── Layout.jsx      # Main layout (Navbar + Footer)
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # Entry point
│   ├── App.css             # Global styles
│   └── index.css           # Tailwind styles
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
└── index.html              # HTML template
```

---

## 🎯 Available Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with features showcase |
| `/resources` | Resources | Mental health resources library |
| `/counseling` | Counseling | Professional therapy booking |
| `/support-groups` | Support Groups | Community support communities |
| `/login` | Login/Signup | Authentication page |

---

## 🎨 Key Features

### ✨ Design
- Soft calming colors (indigo, lavender, blue, green)
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Professional shadow effects

### 🎭 Components
- **Navbar** - Fixed navigation with mobile menu
- **Hero** - Eye-catching headline and CTA buttons
- **Features** - 3 premium service cards
- **MoodTracker** - Animated chart visualization
- **Testimonials** - User reviews with ratings
- **CTA** - Call-to-action sections
- **Footer** - Comprehensive footer with links and support info

### 📱 Pages
- **Home** - Shows all home components
- **Resources** - 6 resource categories with descriptions
- **Counseling** - Therapist profiles and session booking
- **Support Groups** - Community groups directory
- **Login** - Sign in / Sign up forms

---

## 🛠️ Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: { /* Change primary color */ },
  calm: { /* Change calm color */ },
  sage: { /* Change sage color */ },
}
```

### Add Environment Variables
1. Copy `.env.example` to `.env`
2. Add your configuration values
3. Access with `import.meta.env.VITE_*`

### Modify Navigation
Edit `src/components/Navbar.jsx` to change links and branding.

---

## 📦 Install Additional Libraries

### State Management (if needed)
```bash
npm install zustand  # or redux, jotai, recoil
```

### Form Handling (if needed)
```bash
npm install react-hook-form
```

### API Calls (if needed)
```bash
npm install axios  # or fetch-based solution
```

### Notifications (if needed)
```bash
npm install react-toastify  # or sonner, react-hot-toast
```

---

## 🚀 Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint checks |

---

## 🎓 Quick Tips

### 1. Tailwind Utilities
```jsx
// Responsive text
<h1 className="text-2xl md:text-4xl lg:text-5xl">

// Gradient
<div className="bg-gradient-to-r from-primary-600 to-primary-700">

// Hover effects
<button className="hover:scale-105 transition-all">

// Shadows
<div className="shadow-soft hover:shadow-soft-lg">
```

### 2. Animation
```jsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
  Animated content
</motion.div>
```

### 3. Navigation
```jsx
import { Link, useLocation } from 'react-router-dom'

<Link to="/resources">Resources</Link>

const location = useLocation() // Get current route
```

---

## 🐛 Troubleshooting

### Tailwind not working?
```bash
# Restart dev server
npm run dev

# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Port already in use?
```bash
npm run dev -- --port 3000
```

### Build errors?
```bash
npm install  # Reinstall dependencies
npm run build  # Try again
```

---

## 📱 Testing on Mobile

### Local Network
```bash
# Get your IP
ipconfig getifaddr en0  # macOS/Linux

# Access from phone
http://YOUR_IP:5173
```

### Browser DevTools
- Open DevTools (F12)
- Click device toolbar icon
- Select device type and test

---

## 🚢 Deploy (Choose One)

### Vercel (Easiest)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag 'dist' folder to Netlify
```

### GitHub Pages
Configure in `vite.config.js` and push to GitHub

---

## 📚 Learn More

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [React Router](https://reactrouter.com)
- [Vite](https://vitejs.dev)

---

## 💡 Next Steps

1. **Customize colors** in `tailwind.config.js`
2. **Update content** in components/pages
3. **Add authentication** logic
4. **Connect backend API**
5. **Deploy to production**

---

Happy Building! 🎉
