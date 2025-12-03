# UI Improvement: Baby Boy Aqiqah Theme - Summary

**Quick Reference Guide**

---

## What's Being Built

A comprehensive UI overhaul for the baby boy aqiqah RSVP application with:
- Modern, playful, and elegant design system
- Rich animations and micro-interactions
- Professional form controls using Radix UI
- Countdown timer, Google Maps embed, and calendar export
- Performance-optimized with Vercel deployment

---

## Key Components

### 1. Countdown Timer
- 4-unit display (days, hours, minutes, seconds)
- Positioned below hero image
- Updates every second
- Responsive 2x2 grid on mobile

### 2. Enhanced RSVP Form
- Radix UI Radio Group (replacing native radios)
- Custom Number Input with +/- buttons
- Improved visual feedback
- Touch-friendly (44x44px targets)

### 3. Event Details with Map
- Google Maps embed (iframe)
- Add to Calendar button (multi-platform)
- Enhanced layout and spacing

### 4. Confirmation with Confetti
- Canvas confetti animation on success
- Framer Motion transitions
- Smooth fade-in effects
- Respects reduced motion

### 5. Toast Notifications
- Center-top positioning
- 4-second duration
- Theme-matching colors

---

## Technology Stack

### New Dependencies
```bash
npm install framer-motion canvas-confetti add-to-calendar-button-react
npm install @radix-ui/react-radio-group @radix-ui/react-progress
npm install -D @types/canvas-confetti
```

**Bundle Impact:** ~56KB gzipped

### Environment Variables
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

---

## Design System

### Colors (Preserved)
- Primary: `#a4c8e1` (baby blue)
- Light: `#c8dcea` (baby blue light)
- Dark: `#8fa8b8` (baby blue dark)
- Accent: `#d4af37` (gold)
- Background: `#faf9f6` (cream)

### Spacing
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px

### Border Radius
- Small: 6px
- Medium: 8px
- Large: 12px
- Extra Large: 16px, 24px

### Animations
- Fast: 150ms
- Base: 250ms
- Slow: 350ms
- Easing: ease-in-out, spring

---

## File Changes

### New Files
```
components/client/countdown-timer.tsx
components/ui/radio-group.tsx
components/ui/number-input.tsx
components/ui/progress.tsx
lib/animations.ts
```

### Modified Files
```
components/client/rsvp-form.tsx
components/client/confirmation.tsx
components/server/hero-section.tsx
components/server/event-details.tsx
components/ui/sonner.tsx
app/globals.css
next.config.ts
lib/constants.ts
lib/env.ts
```

---

## Performance Targets

- Lighthouse Performance: ≥ 90
- Lighthouse Accessibility: 100
- Bundle Size: ≤ 200KB gzipped
- LCP: ≤ 2.5s
- FID: ≤ 100ms
- CLS: ≤ 0.1
- Animation FPS: 60

---

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation throughout
- Screen reader support
- 4.5:1 color contrast
- 44x44px touch targets
- Reduced motion support
- Semantic HTML
- ARIA labels where needed

---

## Implementation Timeline

**5-Day Plan:**

**Day 1:** Foundation & Dependencies
- Install packages
- Configure environment
- Update design tokens

**Day 2:** UI Components
- Radio Group
- Number Input
- Progress bars

**Day 3:** Core Features
- Countdown Timer
- Enhanced Form
- Event Details

**Day 4:** Polish
- Confetti animation
- Performance optimization
- Accessibility fixes

**Day 5:** Deployment
- Vercel deployment
- Production testing
- Monitoring setup

---

## Testing Strategy

### Unit Tests
- Vitest + React Testing Library
- All new components covered
- Interaction testing

### E2E Tests
- Playwright
- Complete RSVP flow
- Cross-device testing

### Visual Regression
- Playwright screenshots
- Baseline snapshots
- Detect unintended changes

### Performance
- Lighthouse CI
- Bundle analysis
- 60fps animation verification

---

## Rollback Plan

**Triggers for Rollback:**
- Performance score < 80
- Accessibility violations
- Form submission errors
- Build failures

**Rollback Procedures:**
1. Vercel instant rollback (5 min)
2. Git revert commit (10 min)
3. Feature flag disable (15 min)
4. Full branch revert (30 min)

---

## Success Criteria

- All Lighthouse scores meet targets
- Zero accessibility violations
- Smooth animations on mobile
- Successful Vercel deployment
- Cross-browser compatibility
- All tests passing

---

## Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env.local
   # Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   ```

3. **Run Development:**
   ```bash
   npm run dev
   ```

4. **Run Tests:**
   ```bash
   npm test
   npx playwright test
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

6. **Deploy:**
   ```bash
   vercel
   ```

---

## Resources

- **Full Spec:** `spec.md` (this folder)
- **Framer Motion:** https://www.framer.com/motion/
- **Radix UI:** https://www.radix-ui.com/
- **Canvas Confetti:** https://github.com/catdad/canvas-confetti
- **Add to Calendar:** https://github.com/add2cal/add-to-calendar-button
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

## Contact & Support

For questions or clarifications:
- Refer to full specification in `spec.md`
- Check project README
- Review component documentation
- Consult design system tokens in `globals.css`

---

**Last Updated:** 2025-11-28
**Version:** 1.0
