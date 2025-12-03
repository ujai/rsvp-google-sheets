# Cross-Browser Testing Checklist

## Project Information
**Project:** Majlis Aqiqah RSVP Application
**Testing Phase:** Phase 7 - Polish & Optimization
**Date:** 2025-12-03

---

## Browser Support Matrix

### Desktop Browsers

| Browser | Version | OS | Priority | Status |
|---------|---------|-----|----------|--------|
| Chrome | Latest (120+) | Windows/macOS/Linux | High | [ ] |
| Firefox | Latest (120+) | Windows/macOS/Linux | High | [ ] |
| Safari | Latest (17+) | macOS | High | [ ] |
| Edge | Latest (120+) | Windows | Medium | [ ] |
| Opera | Latest | Windows/macOS | Low | [ ] |

### Mobile Browsers

| Browser | Version | OS | Device | Priority | Status |
|---------|---------|-----|--------|----------|--------|
| Safari | Latest | iOS 16+ | iPhone SE (375px) | High | [ ] |
| Safari | Latest | iOS 16+ | iPhone 14 Pro (393px) | High | [ ] |
| Safari | Latest | iPadOS | iPad Air (820px) | Medium | [ ] |
| Chrome | Latest | Android 12+ | Samsung Galaxy S21 (360px) | High | [ ] |
| Chrome | Latest | Android 12+ | Pixel 7 (412px) | Medium | [ ] |
| Samsung Internet | Latest | Android | Samsung Galaxy | Medium | [ ] |

### Legacy Browser Support
- **Internet Explorer 11:** ❌ NOT SUPPORTED
- **Older iOS/Android:** iOS 14+, Android 10+ recommended

---

## Test Environments

### Screen Sizes to Test

| Device Type | Resolution | Viewport | Priority | Status |
|-------------|-----------|----------|----------|--------|
| Mobile - Small | iPhone SE | 375 x 667 | High | [ ] |
| Mobile - Medium | iPhone 14 Pro | 393 x 852 | High | [ ] |
| Mobile - Large | Samsung Galaxy | 412 x 915 | High | [ ] |
| Tablet - Portrait | iPad Air | 820 x 1180 | Medium | [ ] |
| Tablet - Landscape | iPad Air | 1180 x 820 | Medium | [ ] |
| Laptop | Standard | 1366 x 768 | High | [ ] |
| Desktop | HD | 1920 x 1080 | High | [ ] |
| Desktop | 4K | 2560 x 1440 | Low | [ ] |

### Testing Tools
- **BrowserStack:** https://www.browserstack.com/
- **LambdaTest:** https://www.lambdatest.com/
- **Chrome DevTools:** Device emulation
- **Firefox Responsive Design Mode:** Built-in
- **Real Devices:** Preferred when available

---

## Test Cases

### 1. Visual Rendering

#### 1.1 Hero Section
- [ ] **Hero image loads correctly**
  - Image displays without distortion
  - Letterboxing maintained (baby blue borders)
  - Aspect ratio preserved
  - No layout shift on load

- [ ] **Gold border displays**
  - Gradient visible
  - Correct positioning below hero
  - No gaps or breaks

- [ ] **Responsive scaling**
  - Image scales on mobile
  - Proper margins on desktop
  - Centered correctly

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS

#### 1.2 Countdown Timer
- [ ] **Layout correct**
  - 4 columns on desktop (days, hours, minutes, seconds)
  - 2x2 grid on mobile
  - Cards evenly spaced
  - Text centered in cards

- [ ] **Styling renders**
  - Baby blue gradient backgrounds
  - Rounded corners (border-radius)
  - Shadows visible
  - Text readable

- [ ] **Numbers update**
  - Updates every second
  - No flickering
  - Smooth transitions
  - Countdown accurate

- [ ] **Responsive behavior**
  - Layout switches at correct breakpoint
  - Mobile view usable
  - Touch-friendly

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Edge Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet

#### 1.3 Event Details
- [ ] **Information layout**
  - Icon alignment correct
  - Text readable
  - Spacing adequate
  - Icons display correctly

- [ ] **Google Maps embed**
  - Iframe loads
  - Map interactive
  - Correct location shown
  - No CSP errors in console

- [ ] **Map controls**
  - Zoom works
  - Pan works
  - Full screen available (on supported browsers)

- [ ] **Map links**
  - Google Maps link works
  - Waze link works
  - Buttons styled correctly

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS

#### 1.4 Radio Buttons (Radix UI)
- [ ] **Visual styling**
  - Circular buttons display
  - Border visible
  - Hover state shows
  - Selected state clear

- [ ] **Selection indicator**
  - Inner circle appears when selected
  - Color correct (baby blue)
  - Smooth transition

- [ ] **Card backgrounds**
  - Hover effect works
  - Border visible
  - Rounded corners render
  - Touch-friendly size

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop (known Radix issues?)
- [ ] Edge Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS

#### 1.5 Number Input
- [ ] **Layout correct**
  - Plus button, input, minus button in row
  - Buttons aligned
  - Input centered
  - Spacing correct

- [ ] **Button rendering**
  - Icons display (Plus/Minus)
  - Borders visible
  - Hover states work
  - Disabled state clear

- [ ] **Input field**
  - Text centered
  - Border visible
  - Focus state shows

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS

#### 1.6 Form Layout
- [ ] **Overall form appearance**
  - Card styling renders
  - Shadows visible
  - Borders correct
  - Spacing adequate

- [ ] **Input fields**
  - Correct height
  - Border radius renders
  - Focus rings visible
  - Placeholder text readable

- [ ] **Submit button**
  - Styling correct
  - Hover state works
  - Loading state displays
  - Spinner animation smooth

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Edge Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS

#### 1.7 Confirmation Screen
- [ ] **Success card displays**
  - Card styling renders
  - Border and shadow visible
  - Layout correct

- [ ] **Success icon**
  - Checkmark displays
  - Color correct (green)
  - Size appropriate
  - Animation smooth (if applicable)

- [ ] **Confetti animation**
  - Fires on load
  - Colors correct (baby blue, gold)
  - Performance smooth
  - No lag or stutter
  - Ends appropriately

- [ ] **Edit link display**
  - Input field renders
  - Copy button visible
  - Link is readable

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS

#### 1.8 Toast Notifications
- [ ] **Position correct**
  - Top-center position
  - Not overlapping content
  - Visible on all screen sizes

- [ ] **Styling renders**
  - Background color correct
  - Border visible
  - Rounded corners
  - Shadow displays

- [ ] **Animation smooth**
  - Slides in smoothly
  - Stays for 4 seconds
  - Slides out smoothly

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS

---

### 2. Functionality

#### 2.1 Form Submission
- [ ] **Fill out form**
  - Name input accepts text
  - Radio selection works
  - Number input works
  - All fields functional

- [ ] **Validation**
  - Required field errors show
  - Error messages display correctly
  - Can correct errors and resubmit

- [ ] **Submit**
  - Button clickable
  - Loading state shows
  - Form submits successfully
  - Success screen appears

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Edge Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet

#### 2.2 Radio Selection
- [ ] **Click to select**
  - Click works on mobile
  - Click works on desktop
  - Only one selectable at a time

- [ ] **Keyboard navigation**
  - Tab focuses group
  - Arrow keys navigate
  - Space selects

- [ ] **Conditional field**
  - "Hadir" shows number input
  - "Tidak Hadir" hides number input
  - Transition smooth

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS

#### 2.3 Number Input
- [ ] **Plus button**
  - Increments value
  - Respects max (99)
  - Disables at max
  - Touch works on mobile

- [ ] **Minus button**
  - Decrements value
  - Respects min (1)
  - Disables at min
  - Touch works on mobile

- [ ] **Direct input**
  - Can type number
  - Validates min/max
  - Rejects invalid input

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS

#### 2.4 Google Maps
- [ ] **Embed loads**
  - Map appears
  - No errors in console
  - CSP allows iframe

- [ ] **Interaction**
  - Can zoom in/out
  - Can pan map
  - Markers visible
  - Location correct

- [ ] **Links work**
  - "View in Google Maps" opens in new tab
  - Correct location URL
  - "Open in Waze" works (mobile)

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS

#### 2.5 Add to Calendar
- [ ] **Button visible**
  - Displays correctly
  - Styled appropriately
  - Touch-friendly on mobile

- [ ] **Click functionality**
  - Opens calendar options
  - Google Calendar option works
  - Apple Calendar option works
  - Outlook option works
  - iCal download works

- [ ] **Event details correct**
  - Event name correct
  - Date/time correct
  - Timezone correct (Asia/Kuala_Lumpur)
  - Location included

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS

#### 2.6 Copy Link
- [ ] **Copy button works**
  - Click copies to clipboard
  - Toast notification shows
  - "Copied!" message displays

- [ ] **Clipboard API**
  - Works in HTTPS
  - Works on mobile
  - Fallback if not supported

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS

#### 2.7 Confetti Animation
- [ ] **Fires automatically**
  - Triggers on confirmation screen load
  - Colors correct (baby blue, gold, light blue)
  - Particle count appropriate

- [ ] **Performance**
  - Smooth on desktop
  - Smooth on mobile
  - Doesn't block UI
  - Ends cleanly

- [ ] **Reduced motion**
  - Respects `prefers-reduced-motion`
  - Disables or simplifies if user preference set

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS

---

### 3. Performance

#### 3.1 Page Load Speed
- [ ] **Initial page load < 3 seconds**
  - Measure with Chrome DevTools Network tab
  - Test on 3G throttling
  - Test on WiFi

- [ ] **Time to Interactive < 5 seconds**
  - Page usable quickly
  - Form can be filled without delay

- [ ] **First Contentful Paint < 2 seconds**
  - Something visible quickly

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile
- [ ] Safari iOS

#### 3.2 Animation Performance
- [ ] **Countdown updates smoothly**
  - No lag every second
  - Numbers don't flicker
  - CPU usage reasonable

- [ ] **Confetti runs at 60fps**
  - Use Chrome DevTools Performance tab
  - No dropped frames
  - Smooth from start to finish

- [ ] **Hover effects smooth**
  - Buttons transition smoothly
  - Radio cards transition smoothly
  - No janky animations

**Test on:**
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile (30fps acceptable)
- [ ] Safari iOS (30fps acceptable)

#### 3.3 Layout Stability
- [ ] **No Cumulative Layout Shift (CLS)**
  - Hero image doesn't shift on load
  - Countdown doesn't cause shifts
  - Form doesn't jump around
  - Measure with Lighthouse

- [ ] **Content loads in place**
  - Skeletons/placeholders if needed
  - No unexpected content jumps

**Test on:**
- [ ] Chrome Desktop
- [ ] Chrome Mobile

#### 3.4 Memory Usage
- [ ] **No memory leaks**
  - Countdown timer cleans up on unmount
  - Confetti cleans up after animation
  - Event listeners removed

- [ ] **Reasonable memory footprint**
  - Monitor in Chrome DevTools Memory tab
  - Heap doesn't grow indefinitely

**Test on:**
- [ ] Chrome Desktop
- [ ] Chrome Mobile

---

### 4. Responsive Design

#### 4.1 Mobile (375px - 767px)
- [ ] **Layout adapts**
  - Single column
  - Countdown in 2x2 grid
  - Form fields full width
  - Buttons full width

- [ ] **Text readable**
  - Font sizes appropriate
  - No overflow
  - Line height comfortable

- [ ] **Touch targets**
  - Buttons ≥ 44px height
  - Inputs ≥ 44px height
  - Adequate spacing

**Test devices:**
- [ ] iPhone SE (375px)
- [ ] iPhone 14 Pro (393px)
- [ ] Samsung Galaxy S21 (360px)

#### 4.2 Tablet (768px - 1023px)
- [ ] **Layout adapts**
  - Countdown in single row
  - Form comfortable width
  - Map appropriate size

- [ ] **Touch and mouse work**
  - Hover states (if mouse)
  - Touch targets adequate

**Test devices:**
- [ ] iPad Air (820px portrait)
- [ ] iPad Air (1180px landscape)

#### 4.3 Desktop (1024px+)
- [ ] **Layout optimal**
  - Content centered
  - Max width maintained
  - Generous whitespace

- [ ] **Hover states work**
  - Buttons show hover
  - Radio cards show hover
  - Links show hover

**Test resolutions:**
- [ ] 1366 x 768 (laptop)
- [ ] 1920 x 1080 (desktop)

---

### 5. Browser-Specific Issues

#### Chrome-Specific
- [ ] No Chromium-specific rendering bugs
- [ ] Flexbox/Grid layouts correct
- [ ] Animations perform well
- [ ] Console has no errors

#### Firefox-Specific
- [ ] Radio button custom styling works
- [ ] Number input styling correct
- [ ] Flexbox gaps render correctly
- [ ] Focus outlines visible

#### Safari-Specific
- [ ] iOS Safari viewport issues resolved
- [ ] Date input works (if any)
- [ ] Flexbox behaves correctly
- [ ] Backdrop filters work (if used)
- [ ] Sticky positioning works (if used)

#### Edge-Specific
- [ ] Chromium Edge compatibility
- [ ] Legacy Edge not supported (inform if accessed)

---

## Known Compatibility Issues

### Documented Issues
| Browser | Version | Issue | Workaround | Status |
|---------|---------|-------|------------|--------|
| Example: Safari | < 15 | Flexbox gap not supported | Use margin | N/A (iOS 16+ required) |

---

## Testing Workflow

### For Each Browser:

1. **Initial Load**
   - Open homepage
   - Check console for errors
   - Verify page renders correctly

2. **Visual Inspection**
   - Hero section
   - Countdown timer
   - Event details
   - Form layout
   - Buttons and inputs

3. **Interaction Testing**
   - Fill out form
   - Test radio selection
   - Test number input
   - Submit form
   - Verify confirmation

4. **Performance Check**
   - Check Network tab
   - Check Performance tab
   - Verify smooth animations

5. **Responsive Testing**
   - Resize browser
   - Use device toolbar
   - Check breakpoints

6. **Edge Cases**
   - Very long name input
   - Network errors
   - Validation errors
   - Browser back button

---

## Reporting Template

### Issue Report Format

**Browser:** Chrome 120
**OS:** Windows 11
**Device:** Desktop (1920x1080)
**Severity:** High / Medium / Low

**Issue Description:**
[Describe the problem]

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshot/Video:**
[Attach if available]

**Console Errors:**
[Copy any errors]

---

## Testing Sign-off

### Desktop Browsers
- [ ] **Chrome** - Tested by: __________ Date: __________
- [ ] **Firefox** - Tested by: __________ Date: __________
- [ ] **Safari** - Tested by: __________ Date: __________
- [ ] **Edge** - Tested by: __________ Date: __________

### Mobile Browsers
- [ ] **Safari iOS** - Tested by: __________ Date: __________
- [ ] **Chrome Android** - Tested by: __________ Date: __________
- [ ] **Samsung Internet** - Tested by: __________ Date: __________

### Responsive Testing
- [ ] **Mobile (375px)** - Tested by: __________ Date: __________
- [ ] **Tablet (820px)** - Tested by: __________ Date: __________
- [ ] **Desktop (1920px)** - Tested by: __________ Date: __________

### Final Approval
- [ ] All critical issues resolved
- [ ] All browsers pass tests
- [ ] Performance acceptable
- [ ] Ready for production

**QA Lead:** __________________
**Date:** __________________

---

## Notes

- Focus testing on Chrome, Firefox, Safari (Desktop & Mobile) as these cover 95%+ of users
- Real device testing preferred over emulation when possible
- Take screenshots of any rendering issues for bug reports
- Test on slow network (3G throttle) to catch performance issues
- Use incognito/private mode to avoid extension interference

**Last Updated:** 2025-12-03
