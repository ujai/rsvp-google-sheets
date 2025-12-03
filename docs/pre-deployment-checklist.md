# Pre-Deployment Checklist

**Feature:** UI Improvement - Baby Boy Aqiqah Theme
**Version:** 2.0.0
**Date:** 2025-12-03

This comprehensive checklist ensures all aspects of the UI improvement feature are verified before deployment to production.

---

## Build & Tests

- [ ] **Build succeeds:** Run `npm run build` without errors
- [ ] **Unit tests pass:** Run `npm run test` - all tests green
- [ ] **E2E tests pass:** Run `npx playwright test` - all scenarios pass
- [ ] **TypeScript compilation:** No TypeScript errors (`tsc --noEmit`)
- [ ] **ESLint validation:** No warnings or errors (`npm run lint`)
- [ ] **Build log clean:** No warnings about deprecated packages or vulnerabilities

### Verification Commands
```bash
npm run build
npm run test
npx playwright test
npm run lint
npm audit --production
```

---

## Environment Variables

- [ ] **`.env.example` updated** with all required variables
- [ ] **Google Maps API key documented** in `.env.example`
- [ ] **Local `.env.local` complete** with all environment variables:
  - `GOOGLE_SHEET_ID`
  - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - `GOOGLE_PRIVATE_KEY`
  - `NEXT_PUBLIC_APP_URL`
  - `RSVP_DEADLINE`
  - `EDIT_TOKEN_SECRET`
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- [ ] **Vercel environment variables prepared** (separate sheet for production)
- [ ] **API keys restricted** to authorized domains only

### Environment Variable Checklist
```bash
# Verify all required environment variables are set
npm run build  # Should fail if any required vars are missing
```

---

## Performance

- [ ] **Lighthouse Performance ≥ 90**
  - Run on `http://localhost:3000` after production build
  - Test on both desktop and mobile
- [ ] **Lighthouse Accessibility = 100**
  - Zero violations
  - All WCAG 2.1 AA criteria met
- [ ] **Lighthouse Best Practices ≥ 90**
- [ ] **Lighthouse SEO ≥ 90**
- [ ] **Bundle size under budget** (≤ 200KB gzipped for main bundle)
- [ ] **No console errors** in production build
- [ ] **No console warnings** that indicate issues
- [ ] **Images optimized** (WebP/AVIF formats where supported)

### Performance Testing Commands
```bash
# Build for production
npm run build

# Start production server
npm start

# Run Lighthouse (in Chrome DevTools or CLI)
npx lighthouse http://localhost:3000 --view

# Check bundle size
npm run build | grep "Route (app)"
```

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint):** ≤ 2.5s
- **FID (First Input Delay):** ≤ 100ms
- **CLS (Cumulative Layout Shift):** ≤ 0.1
- **FCP (First Contentful Paint):** ≤ 1.8s
- **TBT (Total Blocking Time):** ≤ 300ms

---

## Functionality

### Form & Interactions
- [ ] **Form submission works**
  - Fill out RSVP form and submit
  - Verify data reaches Google Sheets
  - Check edit link is generated
- [ ] **Radio selection works**
  - Click "Hadir" radio button
  - Click "Tidak Hadir" radio button
  - Verify mutual exclusivity
  - Check keyboard navigation (arrow keys)
- [ ] **Number input works**
  - Click plus button to increment
  - Click minus button to decrement
  - Type number directly
  - Verify min/max constraints
- [ ] **Form validation displays**
  - Submit empty form
  - Verify error messages appear
  - Check field-level validation

### Visual Features
- [ ] **Countdown timer updates**
  - Timer displays correct time remaining
  - Updates every second
  - Shows days, hours, minutes, seconds
  - Handles event date correctly
- [ ] **Google Maps loads**
  - Map embed appears in Event Details
  - Map is interactive (zoom, pan)
  - Correct location displayed
- [ ] **Calendar export works**
  - Click "Add to Calendar" button
  - Dropdown shows all options (Google, Apple, iCal, Outlook.com)
  - Test Google Calendar export
  - Verify event details are correct
- [ ] **Confetti animation works**
  - Submit successful RSVP
  - Confetti fires from both sides
  - Uses theme colors (baby blue, gold)
  - Animation lasts ~3 seconds
- [ ] **Toast notifications appear**
  - Success toast after submission
  - Error toast for validation failures
  - Toast positioned at top-center
  - Toast auto-dismisses after 4 seconds

### Edit Functionality
- [ ] **Edit RSVP works**
  - Click edit link from confirmation
  - Form pre-populated with existing data
  - Can update name and number of people
  - Cannot change attendance status
  - Update saves successfully

---

## Accessibility

- [ ] **Zero axe DevTools violations**
  - Install axe DevTools extension
  - Run scan on homepage
  - Run scan on form with errors
  - Run scan on confirmation screen
- [ ] **Keyboard navigation works**
  - Tab through all interactive elements
  - Radio buttons navigable with arrow keys
  - Number input +/- buttons focusable
  - Skip to content link present (if applicable)
  - Focus order is logical (top to bottom)
- [ ] **Screen reader tested**
  - Test with NVDA (Windows) or VoiceOver (Mac)
  - Form labels announced correctly
  - Error messages announced
  - Countdown timer status announced
  - Button purposes clear
- [ ] **Focus indicators visible**
  - All interactive elements have visible focus
  - Focus ring color has sufficient contrast
  - Focus states work on all form controls
- [ ] **Touch targets ≥ 44px**
  - Radio buttons meet minimum size
  - Number input buttons are large enough
  - Submit button is touch-friendly
  - All clickable elements accessible on mobile

### Accessibility Testing Tools
```bash
# Run axe-core via Playwright tests (if configured)
npx playwright test --grep accessibility

# Manual testing checklist:
# 1. Navigate with Tab key only
# 2. Navigate with screen reader
# 3. Test with high contrast mode
# 4. Test with zoom at 200%
```

---

## Cross-Browser Testing

### Desktop Browsers
- [ ] **Chrome (latest)**
  - Form submission
  - All animations
  - Google Maps embed
  - Calendar export
- [ ] **Firefox (latest)**
  - Form validation
  - Radio group behavior
  - Confetti animation
  - Toast notifications
- [ ] **Safari (latest)**
  - Countdown timer
  - Form controls
  - Framer Motion animations
  - Calendar button
- [ ] **Edge (latest)**
  - Complete user flow
  - No console errors
  - Performance acceptable

### Mobile Browsers
- [ ] **iOS Safari**
  - Touch interactions
  - Form controls (radio, number input)
  - Map embed
  - Calendar export to Apple Calendar
- [ ] **Android Chrome**
  - Form submission
  - Touch targets
  - Confetti performance
  - Calendar export to Google Calendar

### Testing Matrix
| Feature | Chrome | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|---------|--------|---------|--------|------|------------|----------------|
| Form Submission | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Radio Selection | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Number Input | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Countdown Timer | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Google Maps | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Calendar Export | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Confetti | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Toasts | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

---

## Security

- [ ] **CSP headers configured**
  - Verify in `next.config.ts`
  - Allows Google Maps resources
  - Blocks inline scripts (production)
  - No CSP violations in console
- [ ] **No security vulnerabilities**
  - Run `npm audit --production`
  - Address any high/critical vulnerabilities
  - Update vulnerable dependencies
- [ ] **Google Maps API key restricted**
  - Go to Google Cloud Console
  - API Key → Restrictions
  - Application restrictions: HTTP referrers
  - Add authorized domains only
  - Test that unauthorized domains are blocked
- [ ] **No sensitive data in client code**
  - Review all `NEXT_PUBLIC_*` variables
  - Check that private keys not exposed
  - Verify service account email not in client bundle
  - Review source maps (disabled in production)

### Security Verification
```bash
# Check for vulnerabilities
npm audit --production

# Verify no secrets in client bundle
npm run build
# Check .next/static/* files for sensitive data

# Test CSP headers
curl -I http://localhost:3000 | grep -i "content-security-policy"
```

---

## Known Issues & Limitations

### Build Issue
**Status:** Partial build failure occurs
**Impact:** Some features may need manual verification
**Details:** Build completes but with warnings about certain dependencies
**Workaround:** Manual testing required for affected features
**Tracking:** To be resolved post-deployment

### Confetti Animation
- Uses canvas, not accessible to screen readers
- Purely decorative (not conveying information)
- Can be disabled via `prefers-reduced-motion`

### Google Maps Embed
- Requires active internet connection
- Subject to Google's quota limits (25,000 loads/day free)
- Privacy consideration: loads from Google servers

### Countdown Timer
- Relies on client's system time
- May be inaccurate if client clock is wrong
- Timezone handling depends on browser

---

## Final Verification Steps

1. **Clean Install Test**
   ```bash
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Production Build Test**
   ```bash
   npm run build
   npm start
   # Test on http://localhost:3000
   ```

3. **Environment Variable Test**
   ```bash
   # Temporarily remove one required var
   # Build should fail with clear error message
   ```

4. **Network Throttling Test**
   - Open Chrome DevTools → Network
   - Set to "Slow 3G"
   - Test page load and form submission
   - Verify acceptable performance

5. **Reduced Motion Test**
   - Enable "Prefer reduced motion" in OS settings
   - Verify animations are instant (0.01ms)
   - Confetti still works but instantly

---

## Sign-Off

**Development Team:**
- [ ] All functionality implemented and tested
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] No known critical issues

**QA Team:**
- [ ] All test cases passed
- [ ] Cross-browser testing complete
- [ ] Accessibility verified
- [ ] Performance targets met

**Product Owner:**
- [ ] Features meet requirements
- [ ] User experience approved
- [ ] Ready for production deployment

**Deployment Lead:**
- [ ] Environment variables prepared
- [ ] Monitoring configured
- [ ] Rollback plan in place
- [ ] Stakeholders notified

---

## Ready for Deployment?

**All items checked?** → Proceed to [Vercel Deployment Guide](vercel-deployment-guide.md)

**Items not complete?** → Address outstanding issues before deployment

**Critical issues found?** → Consider rollback or hotfix strategy
