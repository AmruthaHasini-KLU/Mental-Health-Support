# HealthSupport - Design System Reference

## 🎨 Visual Design Guide

### Usage Examples for Developers

---

## 📐 Color System

### Primary Colors (Indigo)
Used for main CTAs, highlights, primary actions
```jsx
// Light background
className="bg-primary-50"      // #f5f3ff

// Medium tones
className="bg-primary-200"     // #ddd6fe
className="bg-primary-400"     // #a78bfa

// Dark tones (for text)
className="text-primary-700"   // #6d28d9
className="text-primary-900"   // #4c1d95

// Gradients
className="bg-gradient-to-r from-primary-600 to-primary-700"

// Hover states
className="hover:bg-primary-700"
className="hover:text-primary-600"
```

### Calm Colors (Light Blue)
Used for secondary elements, calming sections
```jsx
className="bg-calm-50"         // #f0f9ff
className="bg-calm-300"        // #7dd3fc
className="text-calm-600"      // #0284c7
className="bg-gradient-to-b from-calm-50 to-white"
```

### Sage Colors (Soft Green)
Used for wellness features, positive actions
```jsx
className="bg-sage-50"         // #f6faf5
className="bg-sage-200"        // #d9ead7
className="text-sage-700"      // #4a7c59
className="border-sage-300"    // #c6dfc4
```

### Neutral Colors (Gray)
Used for text, borders, backgrounds
```jsx
className="text-gray-900"      // Text primary
className="text-gray-600"      // Text secondary
className="text-gray-400"      // Text tertiary
className="bg-gray-50"         // Background light
className="border-gray-300"    // Border color
```

---

## 📝 Typography

### Headings
```jsx
// Large heading
<h1 className="text-5xl md:text-6xl font-bold text-gray-900">
  Title
</h1>

// Medium heading
<h2 className="text-4xl md:text-5xl font-bold text-gray-900">
  Section Title
</h2>

// Small heading
<h3 className="text-2xl font-bold text-gray-900">
  Subsection
</h3>

// Card heading
<h4 className="text-xl font-bold text-gray-900">
  Card Title
</h4>
```

### Body Text
```jsx
// Primary text (large)
<p className="text-lg text-gray-700">
  Large body text with emphasis
</p>

// Standard text
<p className="text-base text-gray-600">
  Standard body text for descriptions
</p>

// Secondary text (small)
<p className="text-sm text-gray-600">
  Small secondary text for metadata
</p>

// Extra small text
<p className="text-xs text-gray-500">
  Extra small for captions or labels
</p>
```

### Text Weights
```jsx
className="font-light"      // 300 weight
className="font-normal"     // 400 weight
className="font-semibold"   // 600 weight
className="font-bold"       // 700 weight
```

---

## ✨ Button Styles

### Primary Button
```jsx
<button className="btn-primary">
  Primary Action
</button>

// Output styles:
// - Gradient background (primary-600 to primary-700)
// - White text
// - Rounded corners (rounded-2xl)
// - Hover: scale-105, shadow-soft-lg
// - Smooth transition
```

### Secondary Button
```jsx
<button className="btn-secondary">
  Secondary Action
</button>

// Output styles:
// - White background with primary border
// - Primary text color
// - Rounded corners
// - Hover: opacity and shadow effects
```

### Ghost Button
```jsx
<button className="btn-ghost">
  Ghost Action
</button>

// Output styles:
// - No background
// - Primary text color
// - Hover: primary light background
// - Minimal style
```

---

## 🎭 Cards & Containers

### Card Base (static)
```jsx
<div className="card-base p-8">
  Content
</div>

// Output: Rounded corners, soft shadow
```

### Card Hover (interactive)
```jsx
<div className="card-hover p-8">
  Hoverable content
</div>

// Output:
// - Hover: scale-105, translate-y-2, shadow-soft-lg
// - Smooth transition-all
```

### Card Examples
```jsx
// Feature card
<motion.div className="card-hover p-8">
  <Icon className="w-8 h-8 mb-4" />
  <h3>Title</h3>
  <p>Description</p>
</motion.div>

// Testimonial card
<div className="card-base bg-gradient-to-br from-primary-50 to-white p-8">
  <StarRating />
  <p>"Review text"</p>
  <UserInfo />
</div>
```

---

## 🌊 Shadows & Depth

### Soft Shadow (default)
```jsx
className="shadow-soft"
// 4px 6px -1px rgba(0, 0, 0, 0.05)
```

### Medium Shadow
```jsx
className="shadow-soft-md"
// 10px 15px -3px rgba(0, 0, 0, 0.08)
```

### Large Shadow (hover)
```jsx
className="shadow-soft-lg"
// 20px 25px -5px rgba(0, 0, 0, 0.1)
```

### Combined Effects
```jsx
className="shadow-soft hover:shadow-soft-lg transition-shadow"
// Smooth transition between shadow states
```

---

## 🎨 Rounded Corners

### Standard Radius
```jsx
className="rounded-lg"      // 8px
className="rounded-xl"      // 12px
className="rounded-2xl"     // 16px (most used)
className="rounded-4xl"     // 32px (hero sections)
```

### Specific Corners
```jsx
className="rounded-t-2xl"   // Top corners only
className="rounded-b-2xl"   // Bottom corners only
className="rounded-l-2xl"   // Left corners only
className="rounded-r-2xl"   // Right corners only
```

---

## 🌈 Gradients

### To Right
```jsx
className="bg-gradient-to-r from-primary-600 to-primary-700"
className="bg-gradient-to-r from-calm-500 to-calm-600"
```

### To Bottom
```jsx
className="bg-gradient-to-b from-primary-50 to-white"
className="bg-gradient-to-b from-primary-200/50 to-calm-200/50"
```

### To Corner
```jsx
className="bg-gradient-to-br from-primary-600 to-primary-700"
className="bg-gradient-to-tr from-white to-primary-50"
```

### Text Gradient
```jsx
className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent"
```

---

## ✨ Animations

### Fade In
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Slide Up
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  Content
</motion.div>
```

### Stagger Container
```jsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {/* Children will stagger */}
</motion.div>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}
```

### Hover Scale
```jsx
<motion.div
  whileHover={{ scale: 1.05 }}
  className="cursor-pointer"
>
  Hover me
</motion.div>
```

### Viewport Animation
```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  Animates when in view
</motion.div>
```

---

## 📱 Responsive Patterns

### Responsive Text
```jsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>
```

### Responsive Grid
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* 1 col on mobile, 2 on tablet, 3 on desktop */}
</div>
```

### Responsive Navigation
```jsx
<nav className="hidden md:flex">
  {/* Hidden on mobile, shown on mid-size+ */}
</nav>
```

### Responsive Padding
```jsx
<div className="px-4 sm:px-6 lg:px-8 py-12 md:py-20">
  {/* Padding increases on larger screens */}
</div>
```

---

## 🎯 Interactive States

### Hover State
```jsx
<button className="hover:bg-primary-700 transition-colors">
  Hover me
</button>
```

### Focus State
```jsx
<input className="focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none" />
```

### Active State
```jsx
<button className="active:scale-95 transition-transform">
  Click me
</button>
```

### Disabled State
```jsx
<button className="disabled:opacity-50 disabled:cursor-not-allowed">
  Disabled
</button>
```

---

## 🖼️ Layout Patterns

### Container
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Centered, responsive container */}
</div>
```

### Section
```jsx
<section className="py-20 md:py-32 bg-gradient-to-br from-primary-50 to-white">
  {/* Full-width section with padding */}
</section>
```

### Grid Layout
```jsx
<div className="grid md:grid-cols-3 gap-8">
  {/* 3 equal columns on desktop */}
  {items.map(item => (
    <div key={item.id} className="card-hover p-8">
      {item.content}
    </div>
  ))}
</div>
```

---

## 📊 Component Code Examples

### Complete Feature Card
```jsx
import { motion } from 'framer-motion'
import { Icon } from 'lucide-react'

<motion.div
  className="card-hover p-8"
  whileHover={{ y: -5 }}
>
  <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
    <Icon className="w-8 h-8" />
  </div>
  <h3 className="text-2xl font-bold text-gray-900 mb-3">
    Feature Title
  </h3>
  <p className="text-gray-600 leading-relaxed">
    Feature description text
  </p>
</motion.div>
```

### Complete Button Group
```jsx
<div className="flex flex-col sm:flex-row gap-4">
  <button className="btn-primary">
    Primary Action
  </button>
  <button className="btn-secondary">
    Secondary Action
  </button>
</div>
```

### Complete Stats Section
```jsx
<div className="flex items-center gap-8">
  <div>
    <p className="text-3xl font-bold text-primary-700">500+</p>
    <p className="text-sm text-gray-600">Therapists</p>
  </div>
  <div>
    <p className="text-3xl font-bold text-primary-700">10K+</p>
    <p className="text-sm text-gray-600">Members</p>
  </div>
</div>
```

---

## 🚀 Performance Tips

### Optimize Animations
- Use `will-change` sparingly
- Avoid animating layout properties
- Use `transform` and `opacity` for smooth animations
- Allow GPU acceleration

### Optimize Colors
- Use Tailwind utility classes
- Avoid inline color definitions
- Leverage theme colors
- Keep color palette consistent

### Optimize Responsive
- Mobile-first approach
- Use breakpoint utilities properly
- Test responsive across devices
- Optimize for touch on mobile

---

## ✅ QA Checklist

- [ ] All colors match design
- [ ] All shadows appear correctly
- [ ] Animations are smooth (60fps)
- [ ] Responsive looks good on all sizes
- [ ] Hover states work on desktop
- [ ] Touch states work on mobile
- [ ] Contrast meets WCAG AA
- [ ] No layout shifts during load
- [ ] Transitions are smooth
- [ ] Focus states visible

---

**This guide should answer most design questions. When in doubt, check the component implementations!** 🎨
