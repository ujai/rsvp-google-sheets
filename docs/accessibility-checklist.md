# Accessibility Audit Checklist - WCAG 2.1 AA

## Project Information
**Project:** Majlis Aqiqah RSVP Application
**Audit Date:** 2025-12-03
**Phase:** Phase 7 - Polish & Optimization
**Standard:** WCAG 2.1 Level AA

---

## Executive Summary

This document provides a comprehensive accessibility checklist for the Baby Boy Aqiqah RSVP application. All items should be verified during manual testing with axe DevTools, keyboard navigation, and screen readers.

**Target Score:** Lighthouse Accessibility = 100
**Browser Testing:** Chrome DevTools + axe DevTools extension
**Screen Readers:** NVDA (Windows), VoiceOver (macOS/iOS)

---

## 1. Perceivable

Information and user interface components must be presentable to users in ways they can perceive.

### 1.1 Text Alternatives (Level A)

#### Images
- [ ] **Hero Image** - Has descriptive alt text
  - Location: `components/server/hero-section.tsx`
  - Current: `alt="Majlis Aqiqah Rahmat"`
  - Verify: Alt text describes the image content meaningfully

- [ ] **Baby Image** (if present) - Has appropriate alt text
  - Should describe the image or be decorative (alt="")

- [ ] **Decorative Images** - Use empty alt attribute (alt="")
  - Any purely decorative graphics should have alt=""

#### Icons
- [ ] **Calendar Icon** - Has accessible label
  - Location: Event details section
  - Should have `aria-label` or visually hidden text

- [ ] **Map Icons** - Have accessible labels
  - Google Maps, Waze links should have descriptive text

- [ ] **Plus/Minus Icons** (Number Input) - Have accessible labels
  - Buttons should have `aria-label="Increase"` and `aria-label="Decrease"`

- [ ] **Copy Icon** - Has accessible label
  - Copy link button should indicate its purpose

- [ ] **Checkmark Icon** - Has accessible label
  - Success confirmation icon should be announced

### 1.2 Time-based Media (Level A)
*Not applicable - no video/audio content*

### 1.3 Adaptable (Level A)

#### Semantic Structure
- [ ] **Page Language** declared
  - Verify: `<html lang="ms">` is present in layout
  - Location: `app/layout.tsx`

- [ ] **Heading Hierarchy** is logical
  - [ ] h1: Main page title (e.g., "Majlis Aqiqah Rahmat")
  - [ ] h2: Section titles (e.g., "Butiran Majlis", "Borang RSVP")
  - [ ] h3: Subsections (if any)
  - [ ] No skipped heading levels

- [ ] **Lists** use proper markup
  - Event details should use `<ul>` or `<dl>`
  - Form fields in logical groups

- [ ] **Tables** (if any) have proper markup
  - Not applicable unless data tables added

#### Form Labels
- [ ] **All form inputs** have associated labels
  - [ ] Name field: `<label for="nama">` linked to `<input id="nama">`
  - [ ] Status selection: Radio group has proper label
  - [ ] Number of people: Number input has proper label
  - [ ] Phone field (if present): Has label

- [ ] **Required fields** are marked
  - [ ] Asterisk (*) present
  - [ ] `aria-required="true"` or `required` attribute
  - [ ] Screen reader announces "required"

- [ ] **Form groups** use fieldset/legend
  - Radio group should use `<fieldset>` and `<legend>`

#### Reading Order
- [ ] **Visual order matches DOM order**
  - Tab through page to verify logical flow
  - Content makes sense when read top-to-bottom

- [ ] **No layout tables**
  - All layouts use CSS, not tables

### 1.4 Distinguishable (Level AA)

#### Color Contrast
Test all text against backgrounds using WebAIM Contrast Checker or axe DevTools:

- [ ] **Body Text** (16px+)
  - Ratio required: 4.5:1
  - [ ] Normal text on cream background
  - [ ] Text on baby blue backgrounds
  - [ ] Text in buttons

- [ ] **Large Text** (18px+ or 14px+ bold)
  - Ratio required: 3:1
  - [ ] Headings
  - [ ] Button text

- [ ] **Interactive Elements**
  - [ ] Button text contrast
  - [ ] Link text contrast
  - [ ] Form input text contrast
  - [ ] Placeholder text contrast (3:1 minimum)

- [ ] **Status Colors**
  - [ ] Error messages (red) - 4.5:1
  - [ ] Success messages (green) - 4.5:1
  - [ ] Warning messages (yellow) - 4.5:1

- [ ] **Baby Blue Theme Colors**
  - [ ] `#a4c8e1` (baby-blue) text on white: Check ratio
  - [ ] `#8fa8b8` (baby-blue-dark) text: Check ratio
  - [ ] Gold `#d4af37` accents: Check ratio

#### Color Independence
- [ ] **Information not conveyed by color alone**
  - [ ] Error states use icon + color + text
  - [ ] Required fields use asterisk + text, not just color
  - [ ] Success/error messages use icons
  - [ ] Radio selection shows visual indicator beyond color

#### Visual Presentation
- [ ] **Text is resizable to 200%**
  - Zoom page to 200% and verify readability
  - No horizontal scrolling (unless wide table)
  - Text doesn't overlap

- [ ] **Line height** is adequate
  - Minimum 1.5x for body text
  - Verify in CSS: `line-height: 1.5` or more

- [ ] **Paragraph spacing** is adequate
  - Space between paragraphs should be clear

- [ ] **Text can be selected**
  - Text is not unselectable via CSS

---

## 2. Operable

User interface components and navigation must be operable.

### 2.1 Keyboard Accessible (Level A)

#### Keyboard Navigation
- [ ] **All interactive elements** reachable by Tab
  - [ ] Form inputs
  - [ ] Radio buttons
  - [ ] Number input buttons (+ and -)
  - [ ] Submit button
  - [ ] Google Maps link
  - [ ] Waze link
  - [ ] Add to Calendar button
  - [ ] Copy link button
  - [ ] New RSVP button

- [ ] **Tab order** is logical
  - Follows visual layout
  - No unexpected jumps

- [ ] **No keyboard traps**
  - Can Tab in and out of all sections
  - Google Maps embed doesn't trap focus
  - Modal/dialog (if any) has proper focus management

#### Radio Group Navigation
- [ ] **Arrow keys** navigate between options
  - Up/Down or Left/Right should move selection
  - Tab should exit the group

- [ ] **Space key** selects option
  - Space on focused radio should select it

#### Number Input
- [ ] **Plus button** activatable by keyboard
  - Tab to button, Enter/Space to activate

- [ ] **Minus button** activatable by keyboard
  - Tab to button, Enter/Space to activate

- [ ] **Input field** accepts keyboard input
  - Can type numbers directly

### 2.2 Enough Time (Level A)

- [ ] **No time limits** on form completion
  - Users can take as long as needed

- [ ] **Countdown timer** is informational only
  - Does not force any action
  - Does not time out user session

### 2.3 Seizures and Physical Reactions (Level A)

- [ ] **No flashing content** at 3+ times per second
  - Confetti animation is safe
  - No strobe effects

### 2.4 Navigable (Level AA)

#### Focus Indicators
- [ ] **Focus visible** on all interactive elements
  - [ ] Form inputs show focus ring
  - [ ] Buttons show focus state
  - [ ] Radio buttons show focus ring
  - [ ] Links show focus indicator
  - [ ] Number input buttons show focus

- [ ] **Focus style** meets contrast requirements
  - Focus ring has 3:1 contrast against background
  - Clearly visible

#### Skip Navigation
- [ ] **Skip to main content** link present
  - Should be first focusable element
  - Jumps to main content area
  - Can be visually hidden but available to keyboard/screen readers

#### Page Titles
- [ ] **Each page** has unique, descriptive title
  - [ ] Home: "Majlis Aqiqah Rahmat Don Zulkarnain - RSVP"
  - [ ] Edit page: "Edit RSVP - Majlis Aqiqah"
  - [ ] Success page: "RSVP Submitted - Majlis Aqiqah"

#### Link Purpose
- [ ] **Link text** is descriptive
  - [ ] "View in Google Maps" (not "Click here")
  - [ ] "Open in Waze" (not "Link")
  - [ ] "Add to Calendar" is clear

#### Multiple Ways to Access
*Single-page app - not fully applicable*
- [ ] Form is prominent on homepage
- [ ] Edit link provided after submission

#### Headings and Labels
- [ ] **Headings** describe topic/purpose
  - [ ] "Butiran Majlis" describes event details section
  - [ ] "Borang RSVP" describes form section

- [ ] **Form labels** are descriptive
  - [ ] "Nama Penuh" not just "Name"
  - [ ] "Status Kehadiran" is clear
  - [ ] "Bilangan Orang" describes count field

---

## 3. Understandable

Information and the operation of user interface must be understandable.

### 3.1 Readable (Level A)

#### Language
- [ ] **Primary language** declared
  - `<html lang="ms">` for Bahasa Malaysia
  - Verify in page source

- [ ] **Language changes** marked (if any)
  - If any English text in mostly Malay page, use `lang="en"`
  - Example: `<span lang="en">RSVP</span>`

### 3.2 Predictable (Level A & AA)

#### Consistent Navigation
- [ ] **Navigation** consistent across pages
  - Edit page has consistent layout
  - Success page has consistent layout

#### Consistent Identification
- [ ] **Icons and labels** consistent
  - Same icon/text for same function
  - "Edit" always means edit
  - "Submit" always submits

#### On Focus
- [ ] **No automatic context changes** on focus
  - Focusing an input doesn't submit form
  - Focusing radio doesn't navigate away

#### On Input
- [ ] **No automatic context changes** on input
  - Typing in field doesn't auto-submit
  - Selecting radio doesn't navigate away
  - Number input change doesn't submit form

### 3.3 Input Assistance (Level AA)

#### Error Identification
- [ ] **Errors identified** in text
  - [ ] "This field is required" message
  - [ ] "Please enter a valid name" (if validation)
  - [ ] Not just red border

- [ ] **Error messages** are descriptive
  - [ ] Explains what's wrong
  - [ ] Explains how to fix it

#### Labels or Instructions
- [ ] **Clear instructions** provided
  - [ ] Form intro explains purpose
  - [ ] Required fields marked with asterisk
  - [ ] Phone number format explained (if required)

- [ ] **Field labels** always visible
  - Not just placeholder text
  - Labels outside of input fields

#### Error Prevention
- [ ] **Confirmation** for important actions
  - Form submission shows loading state
  - Success confirmation displayed

- [ ] **Review opportunity** available
  - Edit link allows correcting submission
  - Form data can be reviewed before submit

---

## 4. Robust

Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.

### 4.1 Compatible (Level A & AA)

#### Parsing
- [ ] **Valid HTML**
  - No duplicate IDs
  - Properly nested elements
  - All tags closed
  - Run W3C Validator: https://validator.w3.org/

#### Name, Role, Value
- [ ] **Radio Group** properly marked up
  - Uses Radix UI (ARIA compliant)
  - `role="radiogroup"`
  - Each option has `role="radio"`
  - Checked state announced

- [ ] **Number Input** accessible
  - Buttons have proper ARIA labels
  - Current value announced
  - Min/max constraints announced

- [ ] **Progress/Loading States** announced
  - Loading spinner has `aria-live="polite"`
  - Status updates announced to screen reader

- [ ] **Toast Notifications** announced
  - Sonner toasts have `role="status"` or `role="alert"`
  - `aria-live` region

- [ ] **Countdown Timer** accessible
  - Has `role="timer"`
  - Has `aria-live="polite"`
  - Time values announced

- [ ] **Form Validation** announced
  - Errors have `aria-invalid="true"`
  - Error messages linked with `aria-describedby`

---

## 5. Touch Accessibility (Mobile)

### Touch Target Size
All interactive elements should be minimum 44x44px:

- [ ] **Form inputs** - adequate size
  - Name field: Height ≥ 44px
  - Radio buttons: Touch area ≥ 44px
  - Number input buttons: ≥ 44px x 44px

- [ ] **Buttons** - adequate size
  - Submit button: Height ≥ 44px
  - Plus/Minus buttons: ≥ 44px x 44px
  - Calendar button: ≥ 44px
  - Copy link button: ≥ 44px

- [ ] **Links** - adequate size
  - Google Maps link: Height ≥ 44px
  - Waze link: Height ≥ 44px
  - Edit link: Height ≥ 44px

### Touch Spacing
- [ ] **Adequate spacing** between touch targets
  - Minimum 8px gap between interactive elements
  - Radio options have space between them
  - Buttons not too close together

---

## 6. Screen Reader Testing

### NVDA (Windows) / VoiceOver (macOS)

#### Homepage
- [ ] **Page title** announced correctly
- [ ] **Heading structure** makes sense
- [ ] **Hero image** alt text read
- [ ] **Countdown timer** values announced
- [ ] **Event details** read in logical order
- [ ] **Form labels** associated with inputs
- [ ] **Required fields** announced as required

#### Form Interaction
- [ ] **Radio group** announced as group
  - Number of options announced
  - Current selection announced
  - Can navigate with arrow keys

- [ ] **Number input** is usable
  - Current value announced
  - Plus/Minus buttons identified
  - Value updates announced

- [ ] **Validation errors** announced
  - Error messages read automatically
  - Or linked to field via `aria-describedby`

#### Confirmation Screen
- [ ] **Success message** announced
  - "RSVP submitted successfully" or similar

- [ ] **Edit link** is accessible
  - Link purpose clear
  - URL can be accessed

- [ ] **Confetti** doesn't interfere
  - Purely decorative (no announcement needed)
  - Doesn't block screen reader navigation

---

## 7. Automated Testing Results

### axe DevTools

#### Critical Violations (Must Fix)
- [ ] **No critical violations** found
  - Run axe scan on all pages
  - Fix any "Serious" or "Critical" issues
  - Document minor issues for future improvement

#### Common Issues to Check
- [ ] Color contrast
- [ ] Missing alt text
- [ ] Form label associations
- [ ] Heading order
- [ ] ARIA usage
- [ ] Keyboard accessibility

### Lighthouse Accessibility Score

Run Lighthouse in Chrome DevTools:
```bash
npm run build
npm run start
# Open Chrome DevTools > Lighthouse > Accessibility
```

#### Target Scores
- [ ] **Accessibility Score:** 100/100
- [ ] **Best Practices:** ≥ 90
- [ ] **SEO:** ≥ 90

#### Common Deductions
- [ ] Background/foreground contrast
- [ ] Form elements have labels
- [ ] Images have alt text
- [ ] Valid HTML
- [ ] ARIA attributes valid
- [ ] Touch targets sized appropriately

---

## 8. Manual Testing Checklist

### Keyboard-Only Testing
Disconnect mouse and test entire flow:

1. [ ] Tab through homepage
2. [ ] Reach all interactive elements
3. [ ] Fill out form using only keyboard
4. [ ] Select radio option with Space/Arrow keys
5. [ ] Use number input with Tab + Enter/Space
6. [ ] Submit form with Enter/Space
7. [ ] Access success screen elements
8. [ ] Copy link using keyboard

### Screen Reader Testing
Test with NVDA or VoiceOver:

1. [ ] Navigate homepage with screen reader
2. [ ] Hear all content in logical order
3. [ ] Form labels announced correctly
4. [ ] Fill out and submit form
5. [ ] Hear confirmation message
6. [ ] Access edit link

### Zoom Testing
Test at different zoom levels:

1. [ ] Zoom to 200%
   - [ ] All text readable
   - [ ] No horizontal scroll
   - [ ] Layout still usable

2. [ ] Zoom to 400%
   - [ ] Content still accessible
   - [ ] Can complete form

### Color Blind Testing
Use color blind simulator:

1. [ ] Deuteranopia (red-green)
2. [ ] Protanopia (red-green)
3. [ ] Tritanopia (blue-yellow)
4. [ ] Verify information not lost

---

## 9. Findings and Fixes

### Issues Found
*Document any violations found during testing*

| Issue | Severity | Page | Element | Fix | Status |
|-------|----------|------|---------|-----|--------|
| Example: Missing alt text | Critical | Home | Hero image | Add descriptive alt | [ ] |

### Prioritization
- **Critical:** Blocks users, must fix before deploy
- **Serious:** Major usability issue, fix ASAP
- **Moderate:** Minor issue, fix when possible
- **Minor:** Enhancement, low priority

---

## 10. Verification Sign-off

### Testing Completed By
- [ ] **Manual Keyboard Testing:** ________________ Date: ________
- [ ] **Screen Reader Testing:** ________________ Date: ________
- [ ] **axe DevTools Scan:** ________________ Date: ________
- [ ] **Lighthouse Audit:** ________________ Date: ________
- [ ] **Color Contrast Check:** ________________ Date: ________
- [ ] **Touch Target Verification:** ________________ Date: ________

### Final Approval
- [ ] All critical issues resolved
- [ ] Lighthouse Accessibility = 100
- [ ] Zero critical axe violations
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Ready for production

**Approved By:** ________________
**Date:** ________________

---

## Resources

### Testing Tools
- **axe DevTools:** https://www.deque.com/axe/devtools/
- **Lighthouse:** Built into Chrome DevTools
- **WAVE:** https://wave.webaim.org/
- **Color Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **W3C Validator:** https://validator.w3.org/

### Screen Readers
- **NVDA (Windows):** https://www.nvaccess.org/
- **VoiceOver (macOS):** Built into macOS
- **TalkBack (Android):** Built into Android
- **VoiceOver (iOS):** Built into iOS

### Guidelines
- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM:** https://webaim.org/articles/
- **A11Y Project:** https://www.a11yproject.com/

---

## Notes

- This checklist is based on WCAG 2.1 Level AA requirements
- Some items may not be applicable to this single-page application
- Focus is on form accessibility as that's the primary user interaction
- Confetti animation is decorative and doesn't convey information
- Countdown timer is informational only, doesn't force actions
- Testing should be done on real devices when possible

**Last Updated:** 2025-12-03
