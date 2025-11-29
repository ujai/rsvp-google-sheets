# Research Findings - UI Improvement

## Research Completed: 2025-11-29

---

## 1. Vercel Deployment Optimization

### Key Findings

#### Build Configuration Best Practices
```js
// next.config.js
const nextConfig = {
  // Performance optimizations
  swcMinify: true,
  compress: true,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },

  // Disable powered-by header
  poweredByHeader: false,

  // Production source maps (disable for faster builds)
  productionBrowserSourceMaps: false,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ]
  },
}
```

#### Common Deployment Failure Solutions
1. **Build timeouts**: Use `vercel.json` to increase build timeout
2. **Memory issues**: Optimize bundle size, use code splitting
3. **Type errors**: Run `tsc --noEmit` locally before deploying
4. **ESLint errors**: Configure `eslint.ignoreDuringBuilds` if needed (not recommended for production)
5. **Missing environment variables**: Ensure all env vars are set in Vercel dashboard

#### Vercel Configuration (Optional)
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

#### Performance Optimization
- Use Next.js `Image` component for automatic optimization
- Implement code splitting with dynamic imports
- Enable compression (default in Next.js)
- Use ISR (Incremental Static Regeneration) for semi-static pages
- Optimize package imports with `optimizePackageImports`

---

## 2. Animation Libraries Research

### Recommended: Framer Motion
**Best choice for 60fps mobile-first animations**

#### Why Framer Motion?
- Hardware-accelerated animations (GPU)
- Built-in `prefers-reduced-motion` support
- Tree-shakeable (only import what you use)
- Excellent mobile performance
- React 19 compatible

#### Installation
```bash
npm install framer-motion
```

#### Key Features for This Project

**1. Smooth 60fps Animations**
```jsx
import { motion } from 'framer-motion'

// Simple fade-in
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

**2. Respects Reduced Motion**
```jsx
const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeInVariants}
  // Automatically respects prefers-reduced-motion
/>
```

**3. Stagger Children (for form controls)**
```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

<motion.form variants={containerVariants} initial="hidden" animate="visible">
  <motion.div variants={itemVariants}>Field 1</motion.div>
  <motion.div variants={itemVariants}>Field 2</motion.div>
</motion.form>
```

**4. Layout Animations**
```jsx
<motion.div layout>
  {/* Smoothly animates layout changes */}
</motion.div>
```

### Alternative: React Spring
- Excellent for physics-based animations
- Slightly heavier than Framer Motion
- More complex API

**Verdict**: Stick with Framer Motion for this project

---

## 3. Confetti Library

### Recommended: canvas-confetti
**Lightweight, performant, mobile-optimized**

#### Installation
```bash
npm install canvas-confetti
```

#### Basic Usage
```jsx
import confetti from 'canvas-confetti'

const handleSuccess = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  })
}
```

#### Optimized for Mobile
```jsx
const isMobile = window.innerWidth < 768

confetti({
  particleCount: isMobile ? 50 : 100, // Fewer particles on mobile
  spread: 70,
  origin: { y: 0.6 },
  disableForReducedMotion: true // Respect user preferences
})
```

#### Custom Colors (Baby Blue Theme)
```jsx
confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: ['#a4c8e1', '#c8dcea', '#d4af37', '#8fa8b8'] // Your theme colors
})
```

---

## 4. Modern UI Components (shadcn/ui Pattern)

### Form Components with Radix UI Primitives

#### Why shadcn/ui Pattern?
- Built on Radix UI (fully accessible)
- Copy-paste components (no package dependency bloat)
- Tailwind CSS integration
- TypeScript support
- Full keyboard navigation

#### Recommended Components

**1. Toast Notifications - Sonner**
```bash
npm install sonner
```

**Usage:**
```jsx
import { Toaster, toast } from 'sonner'

// In your layout
<Toaster position="top-center" />

// Trigger toast
toast.success('RSVP submitted successfully!')
toast.error('Please fill all required fields')
```

**Why Sonner?**
- Recommended by shadcn/ui (replaces old toast)
- Center positioning support
- Accessible
- Beautiful animations
- Mobile-optimized

**2. Radio Group (Radix UI)**
```bash
npm install @radix-ui/react-radio-group
```

**Pattern:**
```jsx
import * as RadioGroup from '@radix-ui/react-radio-group'

<RadioGroup.Root>
  <RadioGroup.Item value="yes">
    <RadioGroup.Indicator />
  </RadioGroup.Item>
</RadioGroup.Root>
```

**3. Progress Bar**
```bash
npm install @radix-ui/react-progress
```

```jsx
import * as Progress from '@radix-ui/react-progress'

<Progress.Root value={uploadProgress}>
  <Progress.Indicator style={{ width: `${uploadProgress}%` }} />
</Progress.Root>
```

---

## 5. Google Integration

### Google Maps Embed

#### Recommended Approach: `@googlemaps/js-api-loader`
```bash
npm install @googlemaps/js-api-loader
```

**React Component Pattern:**
```jsx
import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useRef } from 'react'

export function EventMap({ lat, lng }) {
  const mapRef = useRef(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    })

    loader.load().then(() => {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 15,
      })

      new google.maps.Marker({
        position: { lat, lng },
        map,
      })
    })
  }, [lat, lng])

  return <div ref={mapRef} className="h-64 w-full rounded-lg" />
}
```

**Alternative: Simple iframe embed (no API key needed)**
```jsx
<iframe
  width="100%"
  height="300"
  frameBorder="0"
  src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${address}`}
  allowFullScreen
/>
```

### Add to Google Calendar Button

#### Recommended: `add-to-calendar-button-react`
```bash
npm install add-to-calendar-button-react
```

**Usage:**
```jsx
import { AddToCalendarButton } from 'add-to-calendar-button-react'

<AddToCalendarButton
  name="Baby Boy Aqiqah"
  startDate="2025-12-01"
  startTime="10:00"
  endTime="14:00"
  timeZone="Asia/Kuala_Lumpur"
  location="Event Venue Address"
  options={['Google', 'Apple', 'Outlook']}
  lightMode="bodyScheme"
/>
```

**Alternative: Manual Google Calendar Link**
```jsx
const createGoogleCalendarUrl = (event) => {
  const { title, start, end, location, description } = event
  const startTime = new Date(start).toISOString().replace(/-|:|\.\d+/g, '')
  const endTime = new Date(end).toISOString().replace(/-|:|\.\d+/g, '')

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startTime}/${endTime}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(description)}`
}

<a href={createGoogleCalendarUrl(event)} target="_blank">
  Add to Google Calendar
</a>
```

---

## 6. Performance Optimization Strategies

### Mobile-First Animation Strategy

**1. Reduce Animations on Mobile**
```jsx
const isMobile = () => window.innerWidth < 768

const variants = {
  hidden: { opacity: 0, y: isMobile() ? 10 : 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: isMobile() ? 0.3 : 0.5
    }
  }
}
```

**2. Use will-change Sparingly**
```css
/* Only on elements actively animating */
.animating {
  will-change: transform, opacity;
}
```

**3. Prefer transform and opacity**
```jsx
// Good (GPU accelerated)
<motion.div animate={{ x: 100, opacity: 0.5 }} />

// Avoid (causes layout recalculation)
<motion.div animate={{ width: '100%', margin: 20 }} />
```

**4. Lazy Load Heavy Components**
```jsx
import dynamic from 'next/dynamic'

const ConfettiComponent = dynamic(() => import('./Confetti'), {
  ssr: false,
  loading: () => null
})
```

---

## Recommended Tech Stack Summary

### Core Libraries
| Purpose | Library | Size | Why? |
|---------|---------|------|------|
| Animations | Framer Motion | ~30KB | 60fps, mobile-optimized, reduced-motion support |
| Confetti | canvas-confetti | ~3KB | Lightweight, performant, customizable |
| Toast | Sonner | ~5KB | shadcn recommended, center positioning |
| Form Components | Radix UI | ~10KB/component | Accessible, unstyled primitives |
| Progress Bar | Radix Progress | ~5KB | Accessible, easy to style |
| Calendar Button | add-to-calendar-button-react | ~15KB | Multi-platform support |
| Maps | Google Maps Embed API | 0KB (CDN) | No package needed, official |

### Total Bundle Impact
- **Core UI improvements**: ~30KB (Framer Motion)
- **Interactivity**: ~8KB (confetti + sonner)
- **Form controls**: ~15KB (Radix components)
- **Calendar**: ~15KB (add-to-calendar-button)
- **Total**: ~68KB additional bundle size

**Performance Impact**: Minimal (well within budget for comprehensive overhaul)

---

## Implementation Recommendations

### Priority Order
1. **Fix Vercel deployment issues first**
   - Audit current build errors
   - Update `next.config.js` with optimizations
   - Test deployment pipeline

2. **Install and configure core libraries**
   - Framer Motion for animations
   - Sonner for toasts
   - canvas-confetti for celebrations

3. **Upgrade form components**
   - Implement Radix Radio Group
   - Add progress bar for submissions
   - Improve visual hierarchy

4. **Add event information features**
   - Implement countdown timer
   - Add Google Maps embed
   - Add calendar export button

5. **Polish and optimize**
   - Test on mobile devices
   - Verify 60fps animations
   - Check accessibility
   - Optimize bundle size

---

## Next Steps

1. ✅ Research completed
2. ⏳ Create detailed specification document
3. ⏳ Generate implementation tasks list
4. ⏳ Begin implementation phase
