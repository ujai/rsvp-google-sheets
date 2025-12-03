# Performance Optimization Checklist

## Project Information
**Project:** Majlis Aqiqah RSVP Application
**Phase:** Phase 7 - Polish & Optimization
**Date:** 2025-12-03

---

## Core Web Vitals Targets

### Target Metrics (WCAG 2.1 / Google Guidelines)

| Metric | Target | Good | Needs Improvement | Poor | Priority |
|--------|--------|------|-------------------|------|----------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | < 2.5s | 2.5s - 4.0s | > 4.0s | Critical |
| **FID** (First Input Delay) | ≤ 100ms | < 100ms | 100ms - 300ms | > 300ms | Critical |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | < 0.1 | 0.1 - 0.25 | > 0.25 | Critical |
| **FCP** (First Contentful Paint) | ≤ 1.8s | < 1.8s | 1.8s - 3.0s | > 3.0s | High |
| **TBT** (Total Blocking Time) | ≤ 300ms | < 200ms | 200ms - 600ms | > 600ms | High |
| **TTI** (Time to Interactive) | ≤ 3.8s | < 3.8s | 3.8s - 7.3s | > 7.3s | Medium |
| **Speed Index** | ≤ 3.4s | < 3.4s | 3.4s - 5.8s | > 5.8s | Medium |

---

## Lighthouse Score Targets

### Target Scores

| Category | Target | Status |
|----------|--------|--------|
| **Performance** | ≥ 90 | [ ] |
| **Accessibility** | = 100 | [ ] |
| **Best Practices** | ≥ 90 | [ ] |
| **SEO** | ≥ 90 | [ ] |

### How to Run Lighthouse

```bash
# Build production version
npm run build
npm run start

# Open Chrome DevTools
# 1. Open Chrome Incognito window (avoid extensions)
# 2. Navigate to http://localhost:3000
# 3. Open DevTools (F12)
# 4. Click "Lighthouse" tab
# 5. Select:
#    - Mode: Navigation
#    - Device: Mobile & Desktop (run both)
#    - Categories: All
# 6. Click "Analyze page load"
```

---

## 1. Image Optimization

### Hero Image
**File:** `/public/images/hero.jpeg`

- [ ] **Format optimized**
  - Convert to WebP or AVIF
  - Maintain JPEG as fallback
  - Next.js Image component handles this automatically

- [ ] **Size optimized**
  - Target: < 200KB
  - Compressed without quality loss
  - Use tools: TinyPNG, Squoosh, ImageOptim

- [ ] **Dimensions appropriate**
  - Original: 860 x 886
  - Serves different sizes for different viewports
  - Next.js generates responsive sizes

- [ ] **Loading strategy**
  - `priority` prop used (above-fold)
  - `loading="eager"`
  - Critical image loads first

**Check:**
```tsx
<Image
  src="/images/hero.jpeg"
  alt="Majlis Aqiqah Rahmat"
  width={860}
  height={886}
  priority          // ✅ Loads eagerly
  loading="eager"   // ✅ No lazy loading
  className="w-full h-auto"
/>
```

### Other Images
- [ ] **Baby image** (if present)
  - Optimized format
  - Appropriate size
  - Lazy loaded if below fold

- [ ] **No unused images**
  - Remove unused assets from `/public`
  - Clean up old images

**Current Status:**
- ✅ Using Next.js Image component
- ✅ Automatic WebP/AVIF conversion (next.config.ts)
- [ ] Verify hero.jpeg is < 200KB

---

## 2. Resource Hints

### DNS Prefetch & Preconnect

Add to `app/layout.tsx` in the `<head>`:

```tsx
{/* Resource hints for Google Maps */}
<link rel="dns-prefetch" href="https://maps.googleapis.com" />
<link rel="preconnect" href="https://maps.googleapis.com" />
<link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="" />
```

### Benefits
- **DNS Prefetch:** Resolves domain early (saves ~20-120ms)
- **Preconnect:** Establishes connection early (saves ~100-500ms)
- **Critical for:** Google Maps embed, which loads on every page view

### Implementation Checklist
- [ ] Add dns-prefetch for maps.googleapis.com
- [ ] Add preconnect for maps.googleapis.com
- [ ] Add preconnect for maps.gstatic.com
- [ ] Verify in Network tab (earlier connection)

---

## 3. Critical CSS

### Inline Critical CSS

Next.js automatically inlines critical CSS. Verify:

- [ ] **Critical CSS inlined** in `<head>`
  - Hero section styles
  - Above-fold content styles
  - Layout styles

- [ ] **Non-critical CSS** loaded asynchronously
  - Below-fold styles can load later

**Check in source:**
```html
<head>
  <style data-href="/_next/static/css/...">
    /* Critical CSS should be here */
  </style>
</head>
```

### Tailwind CSS Optimization

- [ ] **Unused classes purged**
  - Automatic with Tailwind
  - Configured in `tailwind.config.ts`
  - Production builds only include used classes

- [ ] **CSS file size**
  - Target: ≤ 30KB gzipped
  - Check in build output

---

## 4. JavaScript Bundle Optimization

### Bundle Size Targets

| Bundle Type | Target | Status |
|-------------|--------|--------|
| Main bundle | ≤ 150KB gzipped | [ ] |
| Route bundles | ≤ 50KB gzipped each | [ ] |
| Total initial load | ≤ 200KB gzipped | [ ] |

### Optimization Strategies

#### 4.1 Tree-Shaking
- [x] **Framer Motion** - named imports only
- [x] **Radix UI** - granular imports
- [x] **Lucide Icons** - optimized in config
- [x] **No wildcard imports** (`import *`)

#### 4.2 Code Splitting
- [ ] **Route-based splitting** (automatic with Next.js)
  - Each page is separate bundle
  - `/edit/[token]` separate from homepage

- [ ] **Component splitting** (consider)
  - Confirmation component (with confetti) as dynamic import
  - Add to Calendar component as dynamic import

**Example dynamic import:**
```tsx
import dynamic from 'next/dynamic';

const Confirmation = dynamic(
  () => import('@/components/client/confirmation'),
  {
    loading: () => <LoadingSkeleton />,
    ssr: false // Client-only component
  }
);
```

#### 4.3 Package Optimization
- [x] **Configured in next.config.ts:**
```typescript
experimental: {
  optimizePackageImports: [
    'framer-motion',
    'lucide-react',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-progress',
  ],
}
```

---

## 5. Loading Strategies

### Image Loading

- [x] **Hero image:** `priority` + `eager` (above-fold)
- [ ] **Other images:** `lazy` (below-fold)

```tsx
// Above-fold (hero)
<Image priority loading="eager" />

// Below-fold
<Image loading="lazy" />
```

### Component Loading

| Component | Strategy | Reason | Status |
|-----------|----------|--------|--------|
| Hero Section | Eager | Above-fold, critical | ✅ |
| Countdown Timer | Eager | Above-fold, small bundle | ✅ |
| Event Details | Eager | Critical content | ✅ |
| RSVP Form | Eager | Primary action | ✅ |
| Google Maps | Lazy (iframe) | Below-fold | [ ] |
| Confirmation | Dynamic Import | Post-submit only | [ ] |
| Confetti | With Confirmation | Only after submit | [ ] |

### Google Maps Lazy Loading

Option 1: Intersection Observer (load when scrolled into view)
Option 2: User interaction (load on button click)
Option 3: Delay load by 2-3 seconds after page load

**Recommended:** Intersection Observer

```tsx
const MapEmbed = dynamic(
  () => import('@/components/map-embed'),
  {
    loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
    ssr: false
  }
);
```

---

## 6. Font Optimization

### Font Loading Strategy

Next.js automatically optimizes fonts. Verify:

- [ ] **Fonts preloaded**
  - System fonts used (no web fonts needed)
  - `font-family: system-ui, -apple-system, ...`

- [ ] **No font flash (FOIT/FOUT)**
  - System fonts load instantly
  - No layout shift from font loading

**Current approach:**
```css
--font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
```

✅ **Optimal:** No external font requests needed.

---

## 7. Third-Party Scripts

### Google Maps

**Current implementation:** Iframe embed

**Optimization:**
- [ ] Add resource hints (dns-prefetch, preconnect) ✅
- [ ] Consider lazy loading
- [ ] Use `loading="lazy"` on iframe

```tsx
<iframe
  loading="lazy"        // ✅ Lazy load iframe
  src="https://www.google.com/maps/embed/..."
/>
```

### Add to Calendar Button

**Package:** `add-to-calendar-button-react` (~15KB)

**Optimization:**
- [ ] Consider dynamic import if used infrequently
- [ ] Current: Loaded on every page (acceptable if small)

---

## 8. Animation Performance

### Framer Motion Optimization

- [x] **Use GPU-accelerated properties**
  - `transform`, `opacity` (not `width`, `height`, `top`, `left`)
  - Already using: `opacity`, `scale`, `x`, `y`

- [ ] **Disable animations on low-end devices**
  - Use `prefers-reduced-motion`
  - Already implemented in globals.css

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Confetti Performance

- [ ] **Particle count optimized**
  - Lower count on mobile
  - Check implementation in `confirmation.tsx`

- [ ] **Duration limited**
  - 3 seconds max
  - Auto cleanup

- [ ] **No layout blocking**
  - Uses canvas (off main thread)
  - Doesn't block interaction

### Countdown Timer

- [ ] **Efficient updates**
  - Uses `setInterval` (not `requestAnimationFrame`)
  - Updates once per second (not every frame)

- [ ] **Cleanup on unmount**
  - `clearInterval` in useEffect cleanup
  - No memory leaks

---

## 9. Layout Stability (CLS)

### Prevent Layout Shifts

- [ ] **Image dimensions set**
  - Width and height props on all images
  - Prevents shift when image loads

```tsx
<Image
  width={860}
  height={886}  // ✅ Prevents CLS
  src="/images/hero.jpeg"
/>
```

- [ ] **Font loading doesn't shift**
  - Using system fonts (instant load)
  - No web font FOUT

- [ ] **Dynamic content reserved space**
  - Countdown timer has fixed height
  - Form fields have defined heights

- [ ] **No injected content above-fold**
  - No ads or dynamic banners
  - No cookie notices (or pushed below-fold)

- [ ] **Skeleton loaders**
  - Loading states don't cause shifts
  - Maintain layout during loading

---

## 10. Caching Strategy

### Next.js Caching

- [x] **Static assets cached**
  - Images: `Cache-Control: public, max-age=31536000, immutable`
  - JS/CSS: Hashed filenames, long cache

- [x] **API routes cached appropriately**
  - Health checks: No cache
  - RSVP data: No cache (dynamic)

### Service Worker (Optional)

- [ ] **Consider for offline support**
  - Cache static assets
  - Cache API responses
  - Not critical for RSVP form

---

## 11. Network Optimization

### Compression

- [x] **Gzip/Brotli enabled**
  - Vercel automatically compresses
  - Verify in Network tab: `Content-Encoding: br` or `gzip`

### Request Optimization

- [ ] **Minimize requests**
  - Combine where possible
  - Use CSS sprites for multiple icons (if applicable)
  - Inline small SVGs

- [ ] **No blocking requests**
  - Scripts don't block rendering
  - Next.js handles automatically

### CDN Usage

- [x] **Vercel Edge Network**
  - Static assets served from CDN
  - Geo-distributed for speed

---

## 12. Performance Monitoring

### Lighthouse CI

Run automated performance tests:

```bash
# Install Lighthouse CI
npm install -D @lhci/cli

# Run audit
npx lhci autorun
```

Configuration in `.lighthouserc.json` (see Task 7.5)

### Real User Monitoring (RUM)

**Options:**
- Vercel Analytics (built-in)
- Google Analytics Web Vitals
- Sentry Performance Monitoring

**Metrics to track:**
- Core Web Vitals (LCP, FID, CLS)
- Page load times
- Error rates
- User flow completion

---

## 13. Testing Checklist

### Performance Testing Tools

- [ ] **Lighthouse (Chrome DevTools)**
  - Mobile score ≥ 90
  - Desktop score ≥ 90
  - All Core Web Vitals green

- [ ] **WebPageTest** (https://www.webpagetest.org/)
  - Test from multiple locations
  - Test on slow 3G
  - Filmstrip view for visual progress

- [ ] **Chrome DevTools Performance Tab**
  - Record page load
  - Check for long tasks (> 50ms)
  - Verify 60fps animations

- [ ] **Chrome DevTools Network Tab**
  - Total page weight < 1MB
  - Critical resources load first
  - No failed requests

### Network Throttling Tests

- [ ] **Fast 3G (750ms RTT)**
  - Page usable within 5 seconds
  - Critical content visible

- [ ] **Slow 3G (2000ms RTT)**
  - Page loads within 10 seconds
  - Graceful degradation

### Device Testing

- [ ] **Low-end Android (4x CPU slowdown)**
  - Animations still smooth
  - Interactions responsive

- [ ] **Mid-range iPhone**
  - 60fps animations
  - Instant interaction

---

## 14. Optimization Recommendations

### Immediate Actions (Done)
- ✅ Configure bundle analyzer
- ✅ Add package import optimization
- ✅ Use named imports for tree-shaking
- ✅ Configure image optimization
- ✅ Add prefers-reduced-motion support

### High Priority (Do Now)
- [ ] Add resource hints for Google Maps
- [ ] Verify hero image < 200KB
- [ ] Add lazy loading to Maps iframe
- [ ] Run Lighthouse audit
- [ ] Fix any critical issues

### Medium Priority (Consider)
- [ ] Dynamic import for Confirmation component
- [ ] Intersection Observer for Maps
- [ ] Add loading skeletons
- [ ] Implement service worker (optional)

### Low Priority (Future)
- [ ] Consider using Bun instead of npm (faster installs)
- [ ] Analyze and reduce dependency count
- [ ] Implement advanced caching strategies
- [ ] Add performance monitoring

---

## 15. Performance Budget

### Budget Limits

| Resource | Budget | Actual | Status |
|----------|--------|--------|--------|
| JavaScript | 200KB gzipped | TBD | [ ] |
| CSS | 30KB gzipped | TBD | [ ] |
| Images | 300KB total | TBD | [ ] |
| Fonts | 0KB (system fonts) | 0KB | ✅ |
| Total Page | 500KB | TBD | [ ] |

### Time Budget

| Metric | Budget | Actual | Status |
|--------|--------|--------|--------|
| LCP | 2.5s | TBD | [ ] |
| FID | 100ms | TBD | [ ] |
| CLS | 0.1 | TBD | [ ] |
| FCP | 1.8s | TBD | [ ] |
| TTI | 3.8s | TBD | [ ] |

---

## 16. Build Output Analysis

### Check Build Output

```bash
npm run build
```

Look for:
- Route bundle sizes
- First Load JS totals
- Static generation success
- No warnings

**Example output to verify:**
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5 kB          85 kB
├ ○ /_not-found                          871 B         80 kB
├ ƒ /api/health                          0 B           0 B
├ ƒ /edit/[token]                        8 kB          90 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

First Load JS: Total size < 200KB is optimal
```

---

## Checklist Summary

### Critical Path
1. [ ] Add resource hints to layout
2. [ ] Verify image optimization
3. [ ] Add lazy loading to Maps
4. [ ] Run Lighthouse audit
5. [ ] Achieve 90+ performance score
6. [ ] Verify Core Web Vitals green

### Documentation
- [ ] Document Lighthouse scores
- [ ] Document Core Web Vitals
- [ ] Document bundle sizes
- [ ] Note any issues found
- [ ] Track improvements over time

### Sign-off
- [ ] Performance targets met
- [ ] No blocking issues
- [ ] Ready for production

**Tested by:** __________________
**Date:** __________________

---

## Resources

### Tools
- **Lighthouse:** Chrome DevTools
- **WebPageTest:** https://www.webpagetest.org/
- **Bundle Analyzer:** @next/bundle-analyzer
- **Image Optimizer:** https://squoosh.app/

### Documentation
- **Core Web Vitals:** https://web.dev/vitals/
- **Next.js Performance:** https://nextjs.org/docs/advanced-features/measuring-performance
- **Vercel Analytics:** https://vercel.com/analytics

**Last Updated:** 2025-12-03
