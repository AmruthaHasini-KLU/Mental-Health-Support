# HealthSupport Development Guide

## 🛠️ Development Best Practices

### Code Style
- Use functional components with React hooks
- Use descriptive component and variable names
- Keep components small and focused (single responsibility)
- Use proper TypeScript types (when using TS)

### Component Structure
```jsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SomeIcon from 'lucide-react'

export default function ComponentName() {
  // Hooks
  const [state, setState] = useState()
  
  // Variables
  const containerVariants = { /* ... */ }
  
  // Handlers
  const handleClick = () => { /* ... */ }
  
  // Render
  return (
    <motion.div variants={containerVariants}>
      {/* Content */}
    </motion.div>
  )
}
```

### Tailwind CSS Best Practices
- Use responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Use predefined colors from theme
- Combine utilities instead of writing custom CSS
- Use `@apply` directive in CSS for reusable patterns
- Mobile-first approach: style mobile, then use breakpoints

### Animation Guidelines
- Use Framer Motion `motion` components
- Define animation variants for reusability
- Stagger animations for visual hierarchy
- Use `whileInView` for scroll animations
- Keep animations under 600ms for better UX

### Component Naming
- **Pages**: PascalCase, singular (Home, Resources, Counseling)
- **Components**: PascalCase (Navbar, Hero, Features)
- **Hooks**: camelCase with 'use' prefix (useAuth, useFetch)
- **Constants**: CONSTANT_CASE
- **Utils**: camelCase (formatDate, validateEmail)

## 🌐 Routing

### Adding New Routes
```jsx
// In App.jsx
import NewPage from './pages/NewPage'

<Routes>
  <Route path="/new-page" element={<NewPage />} />
</Routes>
```

### Dynamic Routes
```jsx
// Params
<Route path="/profile/:userId" element={<Profile />} />

// In component
import { useParams } from 'react-router-dom'
const { userId } = useParams()
```

## 📦 Component Expansion

### Adding a New Home Section
1. Create component in `src/components/NewSection.jsx`
2. Import and add to `src/pages/Home.jsx`
3. Use consistent animation patterns

### Creating a Modal
```jsx
import { motion } from 'framer-motion'

export default function Modal({ isOpen, onClose }) {
  if (!isOpen) return null
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl p-8 max-w-md"
      >
        {/* Content */}
      </motion.div>
    </motion.div>
  )
}
```

## 🎨 Styling Tips

### Using Custom Colors
```jsx
// Primary gradient
className="bg-gradient-to-r from-primary-600 to-primary-700"

// Soft shadows
className="shadow-soft hover:shadow-soft-lg"

// Responsive text
className="text-2xl md:text-4xl lg:text-5xl"
```

### Custom Tailwind Component
```css
/* In index.css */
@layer components {
  .custom-button {
    @apply px-6 py-3 bg-primary-600 text-white rounded-2xl hover:shadow-soft-lg transition-all;
  }
}
```

## 🔄 State Management

### Local State
```jsx
const [isOpen, setIsOpen] = useState(false)
```

### Context API (for global state)
```jsx
// Create context
const ThemeContext = createContext()

// Provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Use in component
const { theme } = useContext(ThemeContext)
```

## 🐛 Debugging

### React DevTools
- Install React DevTools browser extension
- Inspect component props and state
- Check component hierarchy

### Framer Motion DevTools
- Use `animate` inspection
- Verify animation transitions
- Check viewport triggers

### Console Debugging
```jsx
console.log('Component mounted', data)
console.error('Error occurred:', error)
console.table(arrayOfObjects)
```

## ⚡ Performance Optimization

### Code Splitting
```jsx
import { lazy, Suspense } from 'react'
const LazyComponent = lazy(() => import('./LazyComponent'))

// Use with Suspense
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

### Memoization
```jsx
import { memo } from 'react'

const MemoComponent = memo(function Component(props) {
  return <div>{props.data}</div>
})
```

### useCallback for Event Handlers
```jsx
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies])
```

## 🧪 Testing

### Testing Components (Jest + React Testing Library)
```jsx
import { render, screen } from '@testing-library/react'

test('renders button', () => {
  render(<button>Click me</button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

### Manual Testing Checklist
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Test keyboard navigation
- [ ] Test animations are smooth
- [ ] Test responsive breakpoints
- [ ] Test with screen reader

## 📱 Responsive Design Strategy

### Mobile First Workflow
1. Write styles for mobile (base)
2. Add `sm:` for small screens
3. Add `md:` for medium screens
4. Add `lg:` for large screens

### Breakpoints
- `sm`: 640px - for tablets
- `md`: 768px - for small desktops
- `lg`: 1024px - for desktops
- `xl`: 1280px - for large screens

## 🎬 Adding Features

### Booking System
```jsx
// Create form component for appointment booking
export default function BookingForm() {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  
  // Handle form submission
}
```

### User Profile
```jsx
// Add user profile page
// Include edit profile, view history, preferences
```

### Chat System
```jsx
// Integrate real-time messaging
// Use WebSocket or Firebase
```

### Payment Integration
```jsx
// Stripe or Razorpay integration
// Handle payments for premium features
```

## 🔐 Security

### Environment Variables
- Never commit `.env` files
- Store sensitive data in environment variables
- Use `.env.example` as template

### Input Validation
```jsx
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

### XSS Prevention
- React escapes text by default
- Use `dangerouslySetInnerHTML` carefully
- Sanitize user inputs

## 📊 Analytics Integration

### Google Analytics
```jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function usePageTracking() {
  const location = useLocation()
  
  useEffect(() => {
    // Send page view to analytics
    window.gtag?.('config', 'GA_MEASUREMENT_ID', {
      page_path: location.pathname,
    })
  }, [location])
}
```

## 🚀 Deployment Checklist

- [ ] Update meta tags in `index.html`
- [ ] Add favicon
- [ ] Optimize images
- [ ] Add 404 page
- [ ] Test build output
- [ ] Set up redirects
- [ ] Configure CDN
- [ ] Enable compression
- [ ] Add security headers
- [ ] Set up monitoring

## 📚 Resources for Developers

- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/
- React Router: https://reactrouter.com/
- Vite: https://vitejs.dev/
- Lucide Icons: https://lucide.dev/

## 🐞 Common Issues & Solutions

### Issue: Tailwind classes not applying
**Solution**: Check `tailwind.config.js` content path, restart server

### Issue: Animations stuttering
**Solution**: Use `will-change` CSS property, reduce animation complexity

### Issue: Build size too large
**Solution**: Code splitting, tree shaking, optimize dependencies

### Issue: Layout shift
**Solution**: Define fixed dimensions, use aspect-ratio utilities

---

Happy coding! For questions or issues, check the main README.md 🎉
