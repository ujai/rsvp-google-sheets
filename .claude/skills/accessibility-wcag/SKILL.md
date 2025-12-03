---
name: accessibility-wcag
description: Build accessible web applications following WCAG 2.1/2.2 guidelines with proper semantic HTML, ARIA attributes, keyboard navigation, screen reader support, and inclusive design. Use when implementing ARIA labels and roles, ensuring keyboard navigation support, supporting screen readers (NVDA, JAWS, VoiceOver), providing text alternatives for images and media, managing focus and focus indicators, creating accessible forms with proper labels and error messages, building inclusive UI components, testing with axe DevTools or Lighthouse, meeting WCAG AA or AAA compliance levels, designing for color blindness and low vision users, implementing skip links and landmarks, ensuring sufficient color contrast ratios (4.5:1 for text), making touch targets accessible (44x44px minimum), handling reduced motion preferences, creating accessible modals and dialogs, implementing accessible data tables, building accessible carousels and sliders, ensuring accessible file uploads, or designing for users with cognitive disabilities.
---

# Accessibility (WCAG) - Building Inclusive Web Applications

## When to use this skill

- Implementing ARIA labels, roles, and properties (aria-label, aria-describedby, role="dialog")
- Ensuring full keyboard navigation support (Tab, Enter, Escape, Arrow keys)
- Supporting screen readers (NVDA, JAWS, VoiceOver, TalkBack)
- Providing text alternatives for images, videos, and non-text content
- Managing focus and visible focus indicators throughout application
- Creating accessible forms with proper labels, error messages, and validation feedback
- Building inclusive, usable UI components (buttons, modals, dropdowns, tabs)
- Testing with axe DevTools, Lighthouse, or WAVE accessibility checkers
- Meeting WCAG 2.1/2.2 Level AA or AAA compliance requirements
- Designing for color blindness, low vision, and visual impairments
- Implementing skip links, landmarks, and semantic HTML structure
- Ensuring sufficient color contrast ratios (4.5:1 minimum for normal text)
- Making touch targets accessible (44x44px minimum for mobile)
- Handling reduced motion preferences (prefers-reduced-motion media query)
- Creating accessible modals, dialogs, and overlay components
- Implementing accessible data tables with proper headers and scope
- Building accessible carousels, sliders, and interactive widgets
- Ensuring accessible file uploads and drag-and-drop interfaces
- Designing for users with cognitive disabilities and neurodivergent users
- Writing HTML files (.html, .jsx, .tsx, .vue, .svelte)
- Editing React components that render UI elements
- Creating forms, buttons, navigation menus, or interactive components
- Working on public-facing websites or web applications
- Developing components for component libraries or design systems

## Core Principles (POUR)

1. **Perceivable** - Information available to all senses
2. **Operable** - Interface elements functional for all users
3. **Understandable** - Content and interface are clear
4. **Robust** - Works across technologies including assistive devices

## Essential Patterns

### Semantic HTML
```html
<!-- ✅ Proper semantic structure -->
<header><nav><ul><li><a></a></li></ul></nav></header>
<main><article><h1></h1><p></p></article></main>
<footer></footer>

<!-- ❌ Div soup -->
<div class="header"><div class="nav"></div></div>
```

### ARIA Labels & Roles
```html
<button aria-label="Close dialog">×</button>
<nav aria-label="Main navigation"></nav>
<input aria-describedby="email-error" />
<div role="alert" aria-live="polite">Success</div>
```

### Keyboard Navigation
```typescript
function Modal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  return <div role="dialog" aria-modal="true" tabIndex={-1}>...</div>;
}
```

### Focus Management
```typescript
const firstFocusableElement = dialogRef.current?.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
)[0];
firstFocusableElement?.focus();
```

## Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [axe DevTools](https://www.deque.com/axe/devtools/)
