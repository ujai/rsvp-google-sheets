# Tasks List: UI Improvement - Baby Boy Aqiqah Theme

**Feature ID:** `ui-improvement-baby-boy-theme`
**Spec Document:** `/home/ujai/Projek/Rahmat/majlis-rsvp/spec/features/2025-11-28-ui-improvement-baby-boy-theme/spec.md`
**Estimated Duration:** 5 days
**Package Manager:** npm

---

## Implementation Overview

This tasks list breaks down the UI improvement feature into 8 sequential phases. Each task includes:
- Specific files to create or modify (with absolute paths)
- Acceptance criteria
- Testing requirements
- Dependencies on other tasks
- Rollback checkpoints

---

## Phase 1: Foundation & Dependencies

**Duration:** Day 1 (4-6 hours)
**Rollback Checkpoint:** After Phase 1

### Task 1.1: Install New Dependencies

**Description:** Install all required npm packages for the UI enhancement.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/package.json`

**Commands:**
```bash
npm install framer-motion@^11.15.0
npm install canvas-confetti@^1.9.3
npm install add-to-calendar-button-react@^2.6.24
npm install @radix-ui/react-radio-group@^1.2.3
npm install @radix-ui/react-progress@^1.1.3
npm install --save-dev @types/canvas-confetti@^1.6.4
```

**Acceptance Criteria:**
- [ ] All dependencies install without errors
- [ ] package.json updated with correct versions
- [ ] package-lock.json updated
- [ ] No peer dependency conflicts
- [ ] `npm run build` succeeds

**Testing:**
```bash
# Verify installation
npm list framer-motion canvas-confetti add-to-calendar-button-react
npm list @radix-ui/react-radio-group @radix-ui/react-progress
npm run build
```

**Dependencies:** None

---

### Task 1.2: Set Up Google Maps API Environment Variable

**Description:** Configure Google Maps Embed API key for location embedding.

**Files:**
- `/home/ujai/Projek/Rahmat/majlis-rsvp/.env.local` (modify)
- `/home/ujai/Projek/Rahmat/majlis-rsvp/.env.example` (modify)
- `/home/ujai/Projek/Rahmat/majlis-rsvp/lib/env.ts` (modify)

**Sub-tasks:**
1. Add environment variable to `.env.local`:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

2. Add to `.env.example` for documentation:
   ```env
   # Google Maps Embed API Key (public - restricted to domain)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
   ```

3. Update `/home/ujai/Projek/Rahmat/majlis-rsvp/lib/env.ts` to validate the new variable:
   ```typescript
   // Add to envSchema
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1, 'Google Maps API key is required'),

   // Add to env object
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
   ```

**Acceptance Criteria:**
- [ ] Environment variable added to `.env.local`
- [ ] Documented in `.env.example`
- [ ] Validation added to `lib/env.ts`
- [ ] Build succeeds with new env var
- [ ] No runtime errors accessing env variable

**Testing:**
```bash
npm run build
# Should fail if NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set
```

**Dependencies:** Task 1.1

---

### Task 1.3: Update Next.js Configuration for Google Maps

**Description:** Update Content Security Policy and security headers to allow Google Maps embeds.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/next.config.ts`

**Changes:**
1. Update CSP to allow Google Maps:
   ```typescript
   const cspHeader = `
     default-src 'self';
     script-src 'self' ${isDev ? "'unsafe-eval' 'unsafe-inline'" : "'strict-dynamic'"};
     style-src 'self' 'unsafe-inline';
     img-src 'self' blob: data: https://maps.googleapis.com https://maps.gstatic.com;
     font-src 'self';
     frame-src https://www.google.com;
     connect-src 'self' https://maps.googleapis.com;
     object-src 'none';
     base-uri 'self';
     form-action 'self';
     frame-ancestors 'none';
     upgrade-insecure-requests;
   `.replace(/\s{2,}/g, ' ').trim();
   ```

2. Change X-Frame-Options from DENY to SAMEORIGIN:
   ```typescript
   {
     key: 'X-Frame-Options',
     value: 'SAMEORIGIN'
   }
   ```

3. Add experimental optimizations:
   ```typescript
   experimental: {
     optimizePackageImports: [
       'framer-motion',
       'lucide-react',
       '@radix-ui/react-radio-group',
       '@radix-ui/react-progress',
     ],
   },
   ```

**Acceptance Criteria:**
- [ ] CSP allows Google Maps resources (img-src, frame-src, connect-src)
- [ ] X-Frame-Options set to SAMEORIGIN
- [ ] Package import optimization configured
- [ ] Build succeeds
- [ ] No CSP violations in browser console

**Testing:**
```bash
npm run build
npm run dev
# Check browser console for CSP violations
```

**Dependencies:** Task 1.2

---

### Task 1.4: Create Animation Utilities Library

**Description:** Create reusable animation variants for Framer Motion.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/lib/animations.ts` (new)

**Content:**
```typescript
import { Variants } from 'framer-motion';

/**
 * Fade in from bottom animation
 * Used for: Cards, sections, confirmation screen
 */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
};

/**
 * Scale in animation with spring
 * Used for: Success icons, important elements
 */
export const scaleIn: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 15 }
  },
};

/**
 * Stagger children animation
 * Used for: Lists, countdown timer units
 */
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Flip animation for countdown numbers
 * Used for: Countdown timer digit changes
 */
export const countdownFlip: Variants = {
  initial: { rotateX: 0 },
  animate: {
    rotateX: 360,
    transition: { duration: 0.6, ease: 'easeInOut' }
  },
};

/**
 * Slide in from left animation
 * Used for: Toast notifications, side elements
 */
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
};

/**
 * Slide in from right animation
 * Used for: Toast notifications, side elements
 */
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
};
```

**Acceptance Criteria:**
- [ ] File created at correct location
- [ ] All animation variants exported
- [ ] TypeScript compiles without errors
- [ ] Animations follow design tokens (durations, easing)

**Testing:**
```bash
npm run build
# Check for TypeScript errors
```

**Dependencies:** Task 1.1

---

### Task 1.5: Update Global CSS with Design Tokens

**Description:** Add new CSS custom properties for design system tokens.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/app/globals.css`

**Changes:**
Add at the top of the file (after Tailwind directives):

```css
@layer base {
  :root {
    /* === COLOR PALETTE === */
    /* Primary Colors */
    --baby-blue: #a4c8e1;
    --baby-blue-light: #c8dcea;
    --baby-blue-dark: #8fa8b8;

    /* Accent Colors */
    --gold: #d4af37;
    --cream: #faf9f6;

    /* Status Colors */
    --success: #10b981;
    --error: #ef4444;
    --warning: #f59e0b;

    /* Neutral Colors */
    --foreground: #1f2937;
    --muted: #6b7280;

    /* === TYPOGRAPHY === */
    --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
    --font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;

    /* Type Scale */
    --text-xs: 0.75rem;
    --text-sm: 0.875rem;
    --text-base: 1rem;
    --text-lg: 1.125rem;
    --text-xl: 1.25rem;
    --text-2xl: 1.5rem;
    --text-3xl: 1.875rem;
    --text-4xl: 2.25rem;

    /* Line Heights */
    --leading-tight: 1.25;
    --leading-normal: 1.5;
    --leading-relaxed: 1.75;

    /* Font Weights */
    --font-normal: 400;
    --font-medium: 500;
    --font-semibold: 600;
    --font-bold: 700;

    /* === SPACING === */
    --spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-3: 0.75rem;
    --spacing-4: 1rem;
    --spacing-5: 1.25rem;
    --spacing-6: 1.5rem;
    --spacing-8: 2rem;
    --spacing-10: 2.5rem;
    --spacing-12: 3rem;
    --spacing-16: 4rem;

    /* === BORDER RADIUS === */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-2xl: 1.5rem;
    --radius-full: 9999px;

    /* === SHADOWS === */
    --shadow-sm: 0 1px 2px 0 rgba(143, 168, 184, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(143, 168, 184, 0.1),
                 0 2px 4px -1px rgba(143, 168, 184, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(143, 168, 184, 0.1),
                 0 4px 6px -2px rgba(143, 168, 184, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(143, 168, 184, 0.1),
                 0 10px 10px -5px rgba(143, 168, 184, 0.04);

    /* === ANIMATION === */
    --duration-fast: 150ms;
    --duration-base: 250ms;
    --duration-slow: 350ms;
    --duration-slower: 500ms;

    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
}

/* === REDUCED MOTION SUPPORT === */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* === TOAST CUSTOMIZATION === */
.sonner-toast {
  font-family: var(--font-sans);
  box-shadow: var(--shadow-lg);
}

.sonner-success {
  border-color: var(--success) !important;
}

.sonner-error {
  border-color: var(--error) !important;
}

.sonner-warning {
  border-color: var(--warning) !important;
}
```

**Acceptance Criteria:**
- [ ] All design tokens added
- [ ] Reduced motion support implemented
- [ ] Toast customization styles added
- [ ] CSS compiles without errors
- [ ] Variables accessible in components

**Testing:**
```bash
npm run dev
# Check browser DevTools for CSS custom properties
```

**Dependencies:** None

---

### Task 1.6: Verify Build and Baseline Bundle Size

**Description:** Test build process and establish baseline metrics for comparison.

**Files:** None (testing only)

**Commands:**
```bash
npm run build
npm run build > build-phase1.log 2>&1
```

**Acceptance Criteria:**
- [ ] Build succeeds without errors
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Bundle size baseline recorded
- [ ] Build log saved for comparison

**Testing:**
```bash
npm run build
# Note the output bundle sizes in build-phase1.log
```

**Dependencies:** Tasks 1.1-1.5

---

## Phase 2: UI Components Library

**Duration:** Day 2 (6-8 hours)
**Rollback Checkpoint:** After Phase 2

### Task 2.1: Create Radio Group Component

**Description:** Create accessible Radix UI radio group component following project standards.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/ui/radio-group.tsx` (new)

**Content:**
```typescript
import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    className={cn('grid gap-3', className)}
    {...props}
    ref={ref}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'aspect-square h-5 w-5 rounded-full border-2 border-baby-blue',
      'ring-offset-background focus:outline-none focus-visible:ring-2',
      'focus-visible:ring-baby-blue focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-all duration-200',
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <div className="h-2.5 w-2.5 rounded-full bg-baby-blue" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
```

**Acceptance Criteria:**
- [ ] Component follows single responsibility principle
- [ ] Uses Tailwind CSS utilities (no custom CSS)
- [ ] Accessible (keyboard navigation, ARIA attributes)
- [ ] 44x44px touch targets (when with label padding)
- [ ] TypeScript strict mode passing
- [ ] Exports both RadioGroup and RadioGroupItem

**Testing:**
```bash
npm run build
# Component should compile without errors
```

**Dependencies:** Task 1.1 (Radix UI installed)

---

### Task 2.2: Create Number Input Component

**Description:** Create custom number input with increment/decrement buttons.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/ui/number-input.tsx` (new)

**Content:**
```typescript
import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NumberInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  className,
}: NumberInputProps) {
  const handleIncrement = () => {
    const newValue = (value || 0) + 1;
    if (newValue <= max) onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = (value || 0) - 1;
    if (newValue >= min) onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
    if (val === undefined || (val >= min && val <= max)) {
      onChange(val);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={disabled || (value || 0) <= min}
        className="h-11 w-11 rounded-lg border-baby-blue-light hover:bg-baby-blue/10 transition-colors"
        aria-label="Kurangkan bilangan"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <Input
        type="number"
        value={value || ''}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        className="text-center h-11 w-20 border-baby-blue-light focus:border-baby-blue"
        aria-label="Bilangan orang"
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={disabled || (value || 0) >= max}
        className="h-11 w-11 rounded-lg border-baby-blue-light hover:bg-baby-blue/10 transition-colors"
        aria-label="Tambahkan bilangan"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] Buttons are 44x44px minimum (using h-11 w-11 = 44px)
- [ ] Keyboard accessible
- [ ] Proper ARIA labels
- [ ] Min/max validation works
- [ ] Disabled state respected
- [ ] Smooth hover transitions

**Testing:**
```bash
npm run build
```

**Dependencies:** Task 1.1

---

### Task 2.3: Create Progress Component

**Description:** Create Radix UI progress bar component for loading states.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/ui/progress.tsx` (new)

**Content:**
```typescript
import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-baby-blue-light',
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-baby-blue transition-all duration-300 ease-in-out"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
```

**Acceptance Criteria:**
- [ ] Smooth animation (300ms transition)
- [ ] Accessible with proper ARIA attributes
- [ ] Follows design tokens (colors, radius)
- [ ] TypeScript types correct

**Testing:**
```bash
npm run build
```

**Dependencies:** Task 1.1

---

### Task 2.4: Update Button Component with Loading State

**Description:** Enhance existing button component to show loading state with spinner.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/ui/button.tsx` (modify)

**Changes:**
Ensure button supports loading state (check if already exists, if not add):

```typescript
import { Loader2 } from 'lucide-react';

// In ButtonProps interface, add:
loading?: boolean;

// In Button component, update disabled logic:
disabled={disabled || loading}

// Show spinner when loading:
{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
```

**Acceptance Criteria:**
- [ ] Loading prop supported
- [ ] Spinner shows when loading
- [ ] Button disabled when loading
- [ ] Spinner positioned correctly (mr-2)
- [ ] Animation smooth (animate-spin)

**Testing:**
```bash
npm run build
```

**Dependencies:** None (modifying existing)

---

### Task 2.5: Update Sonner Toast Configuration

**Description:** Configure Sonner toast notifications with center positioning and custom styling.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/ui/sonner.tsx` (modify)

**Changes:**
```typescript
'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  const { theme = 'light' } = useTheme();

  return (
    <Sonner
      theme={theme as 'light' | 'dark'}
      position="top-center"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          background: '#faf9f6',
          border: '1px solid #c8dcea',
          borderRadius: '0.75rem',
          padding: '1rem',
        },
        className: 'sonner-toast',
        classNames: {
          success: 'sonner-success',
          error: 'sonner-error',
          warning: 'sonner-warning',
        },
      }}
    />
  );
}
```

**Acceptance Criteria:**
- [ ] Position changed to top-center
- [ ] Duration increased to 4000ms
- [ ] Custom colors applied
- [ ] Close button enabled
- [ ] Matches design tokens

**Testing:**
```bash
npm run dev
# Test by triggering a toast notification
```

**Dependencies:** None (sonner already installed)

---

### Task 2.6: Write Unit Tests for UI Components

**Description:** Create comprehensive unit tests for new UI components.

**Files:**
- `/home/ujai/Projek/Rahmat/majlis-rsvp/components/ui/__tests__/radio-group.test.tsx` (new)
- `/home/ujai/Projek/Rahmat/majlis-rsvp/components/ui/__tests__/number-input.test.tsx` (new)
- `/home/ujai/Projek/Rahmat/majlis-rsvp/components/ui/__tests__/progress.test.tsx` (new)

**Content for radio-group.test.tsx:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioGroupItem } from '../radio-group';

describe('RadioGroup', () => {
  it('renders all radio options', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="hadir" id="hadir" aria-label="Hadir" />
        <RadioGroupItem value="tidak_hadir" id="tidak_hadir" aria-label="Tidak Hadir" />
      </RadioGroup>
    );

    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('allows single selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <RadioGroup onValueChange={onChange}>
        <div>
          <RadioGroupItem value="hadir" id="hadir" />
          <label htmlFor="hadir">Hadir</label>
        </div>
        <div>
          <RadioGroupItem value="tidak_hadir" id="tidak_hadir" />
          <label htmlFor="tidak_hadir">Tidak Hadir</label>
        </div>
      </RadioGroup>
    );

    await user.click(screen.getByLabelText('Hadir'));
    expect(onChange).toHaveBeenCalledWith('hadir');
  });

  it('is keyboard navigable', async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup>
        <RadioGroupItem value="hadir" id="hadir" aria-label="Hadir" />
        <RadioGroupItem value="tidak_hadir" id="tidak_hadir" aria-label="Tidak Hadir" />
      </RadioGroup>
    );

    const firstRadio = screen.getAllByRole('radio')[0];
    firstRadio.focus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('radio')[1]).toHaveFocus();
  });
});
```

**Content for number-input.test.tsx:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberInput } from '../number-input';

describe('NumberInput', () => {
  it('increments value when plus button clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<NumberInput value={1} onChange={onChange} />);

    await user.click(screen.getByLabelText('Tambahkan bilangan'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('decrements value when minus button clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<NumberInput value={2} onChange={onChange} min={1} />);

    await user.click(screen.getByLabelText('Kurangkan bilangan'));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('respects min/max bounds', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = render(<NumberInput value={1} onChange={onChange} min={1} max={5} />);

    // Try to go below min
    await user.click(screen.getByLabelText('Kurangkan bilangan'));
    expect(onChange).not.toHaveBeenCalled();

    // Set to max
    onChange.mockClear();
    rerender(<NumberInput value={5} onChange={onChange} min={1} max={5} />);

    // Try to go above max
    await user.click(screen.getByLabelText('Tambahkan bilangan'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('handles direct input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<NumberInput value={1} onChange={onChange} min={1} max={10} />);

    const input = screen.getByLabelText('Bilangan orang');
    await user.clear(input);
    await user.type(input, '5');

    expect(onChange).toHaveBeenCalledWith(5);
  });
});
```

**Content for progress.test.tsx:**
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress } from '../progress';

describe('Progress', () => {
  it('renders with correct value', () => {
    render(<Progress value={50} aria-label="Loading progress" />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '50');
  });

  it('handles 0% value', () => {
    render(<Progress value={0} aria-label="Loading progress" />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '0');
  });

  it('handles 100% value', () => {
    render(<Progress value={100} aria-label="Loading progress" />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '100');
  });
});
```

**Acceptance Criteria:**
- [ ] All tests pass
- [ ] Coverage for happy path and edge cases
- [ ] Keyboard navigation tested
- [ ] ARIA attributes verified
- [ ] User interactions tested

**Testing:**
```bash
npm run test
```

**Dependencies:** Tasks 2.1, 2.2, 2.3

---

## Phase 3: Countdown Timer & Hero Section

**Duration:** Day 2-3 (4-6 hours)
**Rollback Checkpoint:** After Phase 3

### Task 3.1: Create Countdown Timer Component

**Description:** Build client-side countdown timer with accessibility support.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/client/countdown-timer.tsx` (new)

**Content:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface CountdownTimerProps {
  targetDate: string; // ISO 8601 format
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = +new Date(targetDate) - +new Date();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-baby-blue-light to-baby-blue/20 rounded-xl shadow-md">
            <div className="text-4xl font-bold text-baby-blue-dark">--</div>
            <div className="text-sm text-baby-blue-dark mt-1">Loading</div>
          </div>
        ))}
      </div>
    );
  }

  const isEventStarted = Object.values(timeLeft).every(val => val === 0);

  if (isEventStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center py-8 ${className}`}
      >
        <h2 className="text-3xl font-bold text-baby-blue-dark">
          Majlis Telah Bermula!
        </h2>
      </motion.div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'Hari', singular: 'Hari' },
    { value: timeLeft.hours, label: 'Jam', singular: 'Jam' },
    { value: timeLeft.minutes, label: 'Minit', singular: 'Minit' },
    { value: timeLeft.seconds, label: 'Saat', singular: 'Saat' },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto ${className}`}
      role="timer"
      aria-live="polite"
      aria-label="Countdown to event"
    >
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          variants={fadeInUp}
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-baby-blue-light to-baby-blue/20 rounded-xl shadow-md border border-baby-blue-light/50"
        >
          <div className="text-4xl md:text-5xl font-bold text-baby-blue-dark tabular-nums">
            {String(unit.value).padStart(2, '0')}
          </div>
          <div className="text-sm md:text-base text-baby-blue-dark mt-2 font-medium">
            {unit.value === 1 ? unit.singular : unit.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
```

**Acceptance Criteria:**
- [ ] Updates every second
- [ ] Handles timezone correctly
- [ ] Shows "Event Started" when time reaches zero
- [ ] No hydration mismatch errors
- [ ] Cleans up interval on unmount
- [ ] Accessible with aria-live and role
- [ ] Responsive grid (2 cols mobile, 4 cols desktop)
- [ ] Uses design tokens for styling
- [ ] Smooth animations with Framer Motion

**Testing:**
```bash
npm run dev
# Verify countdown updates every second
# Check browser console for hydration errors
```

**Dependencies:** Tasks 1.1, 1.4

---

### Task 3.2: Update Hero Section to Include Countdown

**Description:** Modify hero section to display countdown timer below the image.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/server/hero-section.tsx` (modify)

**Changes:**
Import and add countdown timer:

```typescript
import { CountdownTimer } from '@/components/client/countdown-timer';

// Inside the component, after the gold border:
{/* Gold Border */}
<div className="w-full h-2 bg-gradient-to-r from-transparent via-gold to-transparent" />

{/* Countdown Timer */}
<div className="container mx-auto px-4 py-8">
  <div className="text-center mb-6">
    <h2 className="text-2xl md:text-3xl font-semibold text-baby-blue-dark mb-2">
      Hitung Hari Menuju Majlis
    </h2>
    <p className="text-sm md:text-base text-muted">
      17 Januari 2026 | 10:30 AM
    </p>
  </div>
  <CountdownTimer targetDate="2026-01-17T10:30:00+08:00" />
</div>
```

**Acceptance Criteria:**
- [ ] Countdown displays below hero image
- [ ] Centered with proper padding
- [ ] Heading above countdown
- [ ] Target date in Malaysia timezone (+08:00)
- [ ] Responsive layout
- [ ] No layout shift

**Testing:**
```bash
npm run dev
# Verify countdown appears correctly on homepage
```

**Dependencies:** Task 3.1

---

### Task 3.3: Write Unit Tests for Countdown Timer

**Description:** Create comprehensive tests for countdown timer logic.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/client/__tests__/countdown-timer.test.tsx` (new)

**Content:**
```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CountdownTimer } from '../countdown-timer';

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders countdown with correct time units', () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString(); // +1 day
    render(<CountdownTimer targetDate={futureDate} />);

    expect(screen.getByText(/hari/i)).toBeInTheDocument();
    expect(screen.getByText(/jam/i)).toBeInTheDocument();
    expect(screen.getByText(/minit/i)).toBeInTheDocument();
    expect(screen.getByText(/saat/i)).toBeInTheDocument();
  });

  it('updates every second', () => {
    const futureDate = new Date(Date.now() + 10000).toISOString(); // +10 seconds

    render(<CountdownTimer targetDate={futureDate} />);

    // Force mount
    act(() => {
      vi.runOnlyPendingTimers();
    });

    const initialContent = screen.getByRole('timer').textContent;

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const updatedContent = screen.getByRole('timer').textContent;
    expect(updatedContent).not.toBe(initialContent);
  });

  it('shows event started message when time reaches zero', () => {
    const pastDate = new Date(Date.now() - 1000).toISOString();

    render(<CountdownTimer targetDate={pastDate} />);

    // Force mount
    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(screen.getByText(/majlis telah bermula/i)).toBeInTheDocument();
  });

  it('cleans up interval on unmount', () => {
    const futureDate = new Date(Date.now() + 10000).toISOString();
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    const { unmount } = render(<CountdownTimer targetDate={futureDate} />);

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('has accessible attributes', () => {
    const futureDate = new Date(Date.now() + 10000).toISOString();

    render(<CountdownTimer targetDate={futureDate} />);

    // Force mount
    act(() => {
      vi.runOnlyPendingTimers();
    });

    const timer = screen.getByRole('timer');
    expect(timer).toHaveAttribute('aria-live', 'polite');
    expect(timer).toHaveAttribute('aria-label', 'Countdown to event');
  });
});
```

**Acceptance Criteria:**
- [ ] All tests pass
- [ ] Timer update logic tested
- [ ] Cleanup tested
- [ ] Accessibility tested
- [ ] Edge cases covered (past date)

**Testing:**
```bash
npm run test
```

**Dependencies:** Task 3.1

---

## Phase 4: Enhanced RSVP Form

**Duration:** Day 3 (6-8 hours)
**Rollback Checkpoint:** After Phase 4

### Task 4.1: Update RSVP Form with Radix UI Radio Group

**Description:** Replace native HTML radio inputs with Radix UI Radio Group.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/client/rsvp-form.tsx` (modify)

**Changes:**
1. Import RadioGroup components:
```typescript
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
```

2. Replace the radio section (lines 119-184):
```typescript
<FormField
  control={form.control}
  name="statusKehadiran"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-base font-medium text-baby-blue-dark">
        Status Kehadiran *
      </FormLabel>
      <FormControl>
        <RadioGroup
          value={field.value}
          onValueChange={(value) => {
            field.onChange(value);
            if (value === 'tidak_hadir') {
              form.setValue('bilanganOrang', undefined);
            }
          }}
          disabled={isPending}
          className="space-y-3 mt-2"
        >
          <div className="flex items-center space-x-3 p-4 border border-baby-blue-light rounded-lg hover:bg-baby-blue/5 transition-colors cursor-pointer">
            <RadioGroupItem value="hadir" id="hadir" />
            <label
              htmlFor="hadir"
              className="text-sm font-medium cursor-pointer flex-1"
            >
              Hadir
            </label>
          </div>

          <div className="flex items-center space-x-3 p-4 border border-baby-blue-light rounded-lg hover:bg-baby-blue/5 transition-colors cursor-pointer">
            <RadioGroupItem value="tidak_hadir" id="tidak_hadir" />
            <label
              htmlFor="tidak_hadir"
              className="text-sm font-medium cursor-pointer flex-1"
            >
              Tidak Hadir
            </label>
          </div>
        </RadioGroup>
      </FormControl>
      <FormMessage className="text-error" />
    </FormItem>
  )}
/>
```

3. Remove old radio handling functions (handleStatusChange, etc.)

**Acceptance Criteria:**
- [ ] Radio group uses Radix UI components
- [ ] Each option in bordered, hoverable card
- [ ] Min height 44px for touch targets
- [ ] Smooth hover transitions
- [ ] Auto-clears bilanganOrang when "tidak_hadir" selected
- [ ] Keyboard navigation works (arrow keys)
- [ ] No console errors
- [ ] Form submission still works

**Testing:**
```bash
npm run dev
# Test radio selection with mouse
# Test with keyboard (Tab + Arrow keys)
# Verify form submission works
```

**Dependencies:** Task 2.1

---

### Task 4.2: Update RSVP Form with Number Input Component

**Description:** Replace native number input with custom NumberInput component.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/client/rsvp-form.tsx` (modify)

**Changes:**
1. Import NumberInput:
```typescript
import { NumberInput } from '@/components/ui/number-input';
```

2. Replace bilanganOrang field (lines 186-218):
```typescript
{watchedStatus === "hadir" && (
  <FormField
    control={form.control}
    name="bilanganOrang"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-base font-medium text-baby-blue-dark">
          Bilangan Orang (termasuk anda) *
        </FormLabel>
        <FormControl>
          <NumberInput
            value={field.value}
            onChange={field.onChange}
            min={1}
            max={20}
            disabled={isPending}
            className="justify-center"
          />
        </FormControl>
        <p className="text-xs text-baby-blue-dark mt-1">
          Sila nyatakan jumlah keseluruhan orang yang akan hadir (termasuk diri anda)
        </p>
        <FormMessage className="text-error" />
      </FormItem>
    )}
  />
)}
```

**Acceptance Criteria:**
- [ ] NumberInput component used
- [ ] +/- buttons work correctly
- [ ] Min/max validation (1-20)
- [ ] Centered layout
- [ ] Touch-friendly buttons
- [ ] Disabled state works
- [ ] Form validation still works

**Testing:**
```bash
npm run dev
# Test increment/decrement buttons
# Test direct input
# Verify validation errors
```

**Dependencies:** Task 2.2

---

### Task 4.3: Add Loading State to Submit Button

**Description:** Enhance submit button with loading spinner and disabled state.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/client/rsvp-form.tsx` (modify)

**Changes:**
Update submit button (around line 221):
```typescript
import { Loader2 } from 'lucide-react';

<Button
  type="submit"
  disabled={isPending}
  className="w-full bg-baby-blue hover:bg-baby-blue-dark text-white font-medium py-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isPending ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Menghantar...
    </>
  ) : (
    'Hantar RSVP'
  )}
</Button>
```

**Acceptance Criteria:**
- [ ] Spinner shows during submission
- [ ] Button disabled during submission
- [ ] Smooth spin animation
- [ ] Text changes to "Menghantar..."
- [ ] Proper spacing (mr-2 on icon)

**Testing:**
```bash
npm run dev
# Submit form and verify loading state
```

**Dependencies:** Task 2.4

---

### Task 4.4: Write E2E Tests for Enhanced RSVP Form

**Description:** Create comprehensive E2E tests for form interactions.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/e2e/rsvp-enhanced-form.spec.ts` (new)

**Note:** First check if `/home/ujai/Projek/Rahmat/majlis-rsvp/e2e/` directory exists. If not, create it.

**Content:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Enhanced RSVP Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete RSVP submission with Radix UI components', async ({ page }) => {
    // Fill name
    await page.getByLabel(/nama penuh/i).fill('Ahmad bin Abdullah');

    // Select radio option using Radix UI
    await page.getByRole('radio', { name: /hadir/i }).click();

    // Verify radio is checked
    await expect(page.getByRole('radio', { name: /hadir/i })).toBeChecked();

    // Wait for number input to appear
    await expect(page.getByLabel(/bilangan orang/i)).toBeVisible();

    // Use number input controls
    const plusButton = page.getByLabel(/tambahkan bilangan/i);
    await plusButton.click();
    await plusButton.click(); // Total: 3 people

    // Verify input value
    const numberInput = page.getByLabel(/bilangan orang/i);
    await expect(numberInput).toHaveValue('3');

    // Submit form
    await page.getByRole('button', { name: /hantar rsvp/i }).click();

    // Verify loading state
    await expect(page.getByText(/menghantar/i)).toBeVisible();

    // Verify success message appears
    await expect(page.getByText(/terima kasih/i)).toBeVisible({ timeout: 10000 });
  });

  test('radio group clears number input when tidak hadir selected', async ({ page }) => {
    // Fill name
    await page.getByLabel(/nama penuh/i).fill('Test User');

    // Select hadir
    await page.getByRole('radio', { name: /hadir/i }).click();

    // Enter number of people
    await page.getByLabel(/tambahkan bilangan/i).click();

    // Verify input has value
    await expect(page.getByLabel(/bilangan orang/i)).toHaveValue('2');

    // Switch to tidak hadir
    await page.getByRole('radio', { name: /tidak hadir/i }).click();

    // Number input should disappear
    await expect(page.getByLabel(/bilangan orang/i)).not.toBeVisible();
  });

  test('keyboard navigation works in radio group', async ({ page }) => {
    // Fill name and focus radio
    await page.getByLabel(/nama penuh/i).fill('Keyboard User');
    await page.keyboard.press('Tab');

    // Should focus first radio
    await expect(page.getByRole('radio', { name: /hadir/i })).toBeFocused();

    // Arrow down to second radio
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('radio', { name: /tidak hadir/i })).toBeFocused();

    // Space to select
    await page.keyboard.press('Space');
    await expect(page.getByRole('radio', { name: /tidak hadir/i })).toBeChecked();
  });

  test('number input respects min/max bounds', async ({ page }) => {
    await page.getByLabel(/nama penuh/i).fill('Boundary Test');
    await page.getByRole('radio', { name: /hadir/i }).click();

    const minusButton = page.getByLabel(/kurangkan bilangan/i);
    const numberInput = page.getByLabel(/bilangan orang/i);

    // Should start at 1 (or undefined)
    await expect(minusButton).toBeDisabled();

    // Click plus to max
    const plusButton = page.getByLabel(/tambahkan bilangan/i);
    for (let i = 0; i < 20; i++) {
      if (await plusButton.isEnabled()) {
        await plusButton.click();
      }
    }

    // Should be at max (20)
    await expect(numberInput).toHaveValue('20');
    await expect(plusButton).toBeDisabled();
  });

  test('form validation shows errors', async ({ page }) => {
    // Submit empty form
    await page.getByRole('button', { name: /hantar rsvp/i }).click();

    // Should show validation errors
    await expect(page.getByText(/nama diperlukan/i)).toBeVisible();
    await expect(page.getByText(/sila pilih status kehadiran/i)).toBeVisible();
  });
});
```

**Acceptance Criteria:**
- [ ] All E2E tests pass
- [ ] Tests cover happy path
- [ ] Tests cover validation errors
- [ ] Tests cover keyboard navigation
- [ ] Tests cover min/max bounds

**Testing:**
```bash
# Install Playwright if not installed
npm install -D @playwright/test

# Run tests
npx playwright test e2e/rsvp-enhanced-form.spec.ts
```

**Dependencies:** Tasks 4.1, 4.2, 4.3

---

## Phase 5: Event Details Enhancement

**Duration:** Day 3-4 (4-6 hours)
**Rollback Checkpoint:** After Phase 5

### Task 5.1: Add Google Maps Embed to Event Details

**Description:** Integrate Google Maps iframe for location visualization.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/server/event-details.tsx` (modify)

**Changes:**
1. Import env for API key:
```typescript
import { env } from '@/lib/env';
```

2. Add Google Maps embed before the map links section:
```typescript
{/* Google Maps Embed */}
<div className="mb-6">
  <h3 className="text-lg font-semibold text-baby-blue-dark mb-3">
    Lokasi di Peta
  </h3>
  <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border-2 border-baby-blue-light shadow-md">
    <iframe
      width="100%"
      height="100%"
      frameBorder="0"
      style={{ border: 0 }}
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/place?key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=place_id:ChIJR73efQBPzDERJUvQSAYq9us&zoom=15`}
      allowFullScreen
      loading="lazy"
      title="Peta menunjukkan lokasi majlis di Ruang Acara Nadi Rafanda"
    />
  </div>
</div>
```

**Acceptance Criteria:**
- [ ] Map loads correctly
- [ ] Correct location shown (Ruang Acara Nadi Rafanda)
- [ ] Responsive height (h-64 mobile, h-80 desktop)
- [ ] Rounded corners and border
- [ ] Loading lazy for performance
- [ ] Descriptive title for accessibility
- [ ] No CSP violations

**Testing:**
```bash
npm run dev
# Verify map loads and is interactive
# Check browser console for CSP errors
```

**Dependencies:** Tasks 1.2, 1.3

---

### Task 5.2: Add Calendar Export Button

**Description:** Integrate add-to-calendar-button for multi-platform calendar support.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/server/event-details.tsx` (modify)

**Note:** Since add-to-calendar-button-react requires client-side rendering, create a client wrapper.

**New File:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/client/add-to-calendar.tsx`

**Content:**
```typescript
'use client';

import { AddToCalendarButton } from 'add-to-calendar-button-react';

export function AddToCalendar() {
  return (
    <AddToCalendarButton
      name="Majlis Aqiqah Rahmat Don Zulkarnain"
      description="Jemputan ke Majlis Aqiqah & Kesyukuran anak lelaki kami, Rahmat Don Zulkarnain"
      startDate="2026-01-17"
      startTime="10:30"
      endTime="14:30"
      timeZone="Asia/Kuala_Lumpur"
      location="Ruang Acara Nadi Rafanda, No. 1 Jalan Meteor P U16/P, Elmina East, 40160 Shah Alam, Selangor"
      options={['Google', 'Apple', 'iCal', 'Outlook.com', 'Yahoo']}
      buttonStyle="flat"
      lightMode="bodyScheme"
      styleLight="--btn-background: #a4c8e1; --btn-text: white; --btn-background-hover: #8fa8b8; --font: var(--font-sans);"
      label="Tambah ke Kalendar"
      size="3"
    />
  );
}
```

**Update event-details.tsx:**
```typescript
import { AddToCalendar } from '@/components/client/add-to-calendar';

// Add after date/time section:
<div className="mt-4">
  <AddToCalendar />
</div>
```

**Acceptance Criteria:**
- [ ] Button displays correctly
- [ ] Matches baby blue theme
- [ ] Opens calendar options menu
- [ ] Supports Google, Apple, iCal, Outlook, Yahoo
- [ ] Correct event details (date, time, location)
- [ ] Malaysia timezone (Asia/Kuala_Lumpur)
- [ ] Accessible button

**Testing:**
```bash
npm run dev
# Click calendar button
# Verify dropdown appears
# Test exporting to Google Calendar
```

**Dependencies:** Task 1.1

---

### Task 5.3: Enhance Event Details Layout

**Description:** Improve visual hierarchy and spacing in event details section.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/server/event-details.tsx` (modify)

**Changes:**
Update section structure with better spacing and visual hierarchy:

```typescript
<section className="py-12 px-4 bg-cream">
  <div className="container mx-auto max-w-4xl">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-baby-blue-dark mb-8">
      Butiran Majlis
    </h2>

    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-baby-blue-light">
      {/* Event details with icons */}
      <div className="space-y-6 mb-8">
        {/* ... existing event detail items with improved spacing ... */}
      </div>

      {/* Calendar Button */}
      <div className="mb-8 flex justify-center">
        <AddToCalendar />
      </div>

      {/* Google Maps Embed */}
      {/* ... map from Task 5.1 ... */}

      {/* Map Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* ... existing map links with enhanced styling ... */}
      </div>
    </div>
  </div>
</section>
```

**Acceptance Criteria:**
- [ ] Improved visual hierarchy
- [ ] Consistent spacing using design tokens
- [ ] Rounded corners (rounded-2xl)
- [ ] Shadow for depth (shadow-xl)
- [ ] Responsive padding
- [ ] Centered calendar button
- [ ] Grid layout for map links

**Testing:**
```bash
npm run dev
# Verify improved layout
# Test on mobile and desktop
```

**Dependencies:** Tasks 5.1, 5.2

---

### Task 5.4: Write E2E Tests for Event Details

**Description:** Test Google Maps embed and calendar export functionality.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/e2e/event-details.spec.ts` (new)

**Content:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Event Details Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Google Maps embed loads correctly', async ({ page }) => {
    // Scroll to event details
    await page.getByRole('heading', { name: /butiran majlis/i }).scrollIntoViewIfNeeded();

    // Verify map heading exists
    await expect(page.getByRole('heading', { name: /lokasi di peta/i })).toBeVisible();

    // Wait for iframe to load
    const mapFrame = page.frameLocator('iframe[title*="Peta"]');

    // Verify frame loads (wait up to 10 seconds)
    await expect(mapFrame.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('Add to Calendar button works', async ({ page }) => {
    // Scroll to event details
    await page.getByRole('heading', { name: /butiran majlis/i }).scrollIntoViewIfNeeded();

    // Find and click calendar button
    const calendarButton = page.getByRole('button', { name: /tambah ke kalendar/i });
    await expect(calendarButton).toBeVisible();
    await calendarButton.click();

    // Verify calendar options appear
    await expect(page.getByText(/google/i)).toBeVisible();
    await expect(page.getByText(/apple/i)).toBeVisible();
  });

  test('map links are present and accessible', async ({ page }) => {
    await page.getByRole('heading', { name: /butiran majlis/i }).scrollIntoViewIfNeeded();

    // Verify Google Maps link
    const googleMapsLink = page.getByRole('link', { name: /google maps/i });
    await expect(googleMapsLink).toBeVisible();
    await expect(googleMapsLink).toHaveAttribute('href', /google\.com\/maps/);

    // Verify Waze link
    const wazeLink = page.getByRole('link', { name: /waze/i });
    await expect(wazeLink).toBeVisible();
    await expect(wazeLink).toHaveAttribute('href', /waze\.com/);
  });

  test('event details section is accessible', async ({ page }) => {
    await page.getByRole('heading', { name: /butiran majlis/i }).scrollIntoViewIfNeeded();

    // Check heading hierarchy
    const mainHeading = page.getByRole('heading', { name: /butiran majlis/i, level: 2 });
    await expect(mainHeading).toBeVisible();

    // Verify iframe has title
    const iframe = page.locator('iframe[title*="Peta"]');
    await expect(iframe).toHaveAttribute('title');
  });
});
```

**Acceptance Criteria:**
- [ ] All tests pass
- [ ] Map loading tested
- [ ] Calendar button tested
- [ ] Links verified
- [ ] Accessibility checked

**Testing:**
```bash
npx playwright test e2e/event-details.spec.ts
```

**Dependencies:** Tasks 5.1, 5.2, 5.3

---

## Phase 6: Confirmation & Confetti Animation

**Duration:** Day 4 (4-6 hours)
**Rollback Checkpoint:** After Phase 6

### Task 6.1: Update Confirmation Component with Framer Motion

**Description:** Add smooth animations to confirmation screen.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/client/confirmation.tsx` (modify)

**Changes:**
1. Import Framer Motion and animations:
```typescript
import { motion } from 'framer-motion';
import { fadeInUp, scaleIn } from '@/lib/animations';
```

2. Wrap entire component in motion.div:
```typescript
export function Confirmation({ editLink, onNewRSVP }: ConfirmationProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editLink);
      setCopied(true);
      toast.success('Pautan telah disalin!');
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast.error('Gagal menyalin pautan');
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="w-full"
    >
      <Card className="border-baby-blue-light shadow-xl">
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Animated Success Icon */}
          <motion.div
            variants={scaleIn}
            initial="initial"
            animate="animate"
            className="text-center space-y-4"
          >
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 md:w-20 md:h-20 text-success" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-baby-blue-dark">
              Terima Kasih!
            </h2>
            <p className="text-base md:text-lg text-baby-blue-dark">
              RSVP anda telah berjaya dihantar.
            </p>
          </motion.div>

          {/* Rest of component... */}
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

**Acceptance Criteria:**
- [ ] Smooth fade-in animation
- [ ] Success icon scales in with spring
- [ ] Animations respect prefers-reduced-motion
- [ ] No layout shift during animation
- [ ] Animations complete before user interaction

**Testing:**
```bash
npm run dev
# Submit RSVP and verify animations
# Test with DevTools reduced motion
```

**Dependencies:** Tasks 1.1, 1.4

---

### Task 6.2: Add Confetti Animation to Confirmation

**Description:** Implement celebratory confetti effect on successful RSVP submission.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/client/confirmation.tsx` (modify)

**Changes:**
1. Import confetti:
```typescript
import confetti from 'canvas-confetti';
```

2. Add useEffect for confetti:
```typescript
export function Confirmation({ editLink, onNewRSVP }: ConfirmationProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Skip confetti for reduced motion users
      return;
    }

    // Confetti animation
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#a4c8e1', '#d4af37', '#c8dcea'];

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Start confetti after a short delay to allow mount animation
    const timeout = setTimeout(() => {
      frame();
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  // ... rest of component
}
```

**Acceptance Criteria:**
- [ ] Confetti fires from both sides
- [ ] Uses theme colors (baby blue, gold)
- [ ] 3-second duration
- [ ] Respects prefers-reduced-motion
- [ ] Doesn't block user interaction
- [ ] Cleans up properly on unmount

**Testing:**
```bash
npm run dev
# Submit RSVP and verify confetti
# Test with reduced motion in DevTools
```

**Dependencies:** Tasks 1.1, 6.1

---

### Task 6.3: Optimize Confirmation Component Loading

**Description:** Implement dynamic import for confirmation to reduce initial bundle.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/client/rsvp-section.tsx` (or wherever Confirmation is used)

**Changes:**
```typescript
import dynamic from 'next/dynamic';

const Confirmation = dynamic(
  () => import('@/components/client/confirmation').then(mod => ({ default: mod.Confirmation })),
  {
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-20 bg-baby-blue-light rounded-full w-20 mx-auto"></div>
          <div className="h-8 bg-baby-blue-light rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-baby-blue-light rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    ),
    ssr: false, // Confetti doesn't need SSR
  }
);
```

**Acceptance Criteria:**
- [ ] Confirmation dynamically imported
- [ ] Loading skeleton shows during load
- [ ] SSR disabled for component
- [ ] Bundle size reduced
- [ ] No runtime errors

**Testing:**
```bash
npm run build
# Check bundle analyzer for size reduction
# Test loading state appears briefly
```

**Dependencies:** Task 6.2

---

### Task 6.4: Write Tests for Confirmation Component

**Description:** Test animations and confetti functionality.

**Files:** `/home/ujai/Projek/Rahmat/majlis-rsvp/components/client/__tests__/confirmation.test.tsx` (new)

**Content:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Confirmation } from '../confirmation';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Confirmation', () => {
  const mockEditLink = 'https://example.com/edit/abc123';
  const mockOnNewRSVP = vi.fn();

  it('renders success message', () => {
    render(<Confirmation editLink={mockEditLink} onNewRSVP={mockOnNewRSVP} />);

    expect(screen.getByText(/terima kasih/i)).toBeInTheDocument();
    expect(screen.getByText(/rsvp anda telah berjaya dihantar/i)).toBeInTheDocument();
  });

  it('displays edit link', () => {
    render(<Confirmation editLink={mockEditLink} onNewRSVP={mockOnNewRSVP} />);

    expect(screen.getByText(mockEditLink)).toBeInTheDocument();
  });

  it('copies link to clipboard', async () => {
    const user = userEvent.setup();

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    render(<Confirmation editLink={mockEditLink} onNewRSVP={mockOnNewRSVP} />);

    const copyButton = screen.getByRole('button', { name: /salin/i });
    await user.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockEditLink);
    });
  });

  it('calls onNewRSVP when new RSVP button clicked', async () => {
    const user = userEvent.setup();

    render(<Confirmation editLink={mockEditLink} onNewRSVP={mockOnNewRSVP} />);

    const newRSVPButton = screen.getByRole('button', { name: /hantar rsvp baru/i });
    await user.click(newRSVPButton);

    expect(mockOnNewRSVP).toHaveBeenCalled();
  });
});
```

**Acceptance Criteria:**
- [ ] All tests pass
- [ ] Success message tested
- [ ] Copy functionality tested
- [ ] New RSVP callback tested
- [ ] Mocks configured correctly

**Testing:**
```bash
npm run test
```

**Dependencies:** Task 6.2

---

## Phase 7: Polish & Optimization

**Duration:** Day 4-5 (6-8 hours)
**Rollback Checkpoint:** After Phase 7

### Task 7.1: Bundle Size Analysis and Optimization

**Description:** Analyze bundle size and optimize imports.

**Files:** Various (optimization changes)

**Commands:**
```bash
npm run build
npm run build -- --profile > build-phase7.log 2>&1
```

**Sub-tasks:**

1. **Install bundle analyzer** (if not already):
```bash
npm install -D @next/bundle-analyzer
```

2. **Configure bundle analyzer** in `next.config.ts`:
```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Wrap nextConfig
module.exports = withBundleAnalyzer(nextConfig);
```

3. **Run analysis**:
```bash
ANALYZE=true npm run build
```

4. **Optimize Framer Motion imports** - ensure using named imports:
```typescript
// Good
import { motion } from 'framer-motion';

// Bad (don't do this)
import * as motion from 'framer-motion';
```

5. **Verify tree-shaking** - check that unused Radix UI components aren't bundled

**Acceptance Criteria:**
- [ ] Bundle size increase ≤ 70KB gzipped (from baseline)
- [ ] Main bundle ≤ 150KB gzipped
- [ ] No duplicate dependencies
- [ ] Tree-shaking working correctly
- [ ] Dynamic imports implemented for heavy components

**Testing:**
```bash
ANALYZE=true npm run build
# Review generated HTML report
# Compare to Phase 1 baseline
```

**Dependencies:** All previous phases

---

### Task 7.2: Accessibility Audit with axe DevTools

**Description:** Comprehensive accessibility testing and fixes.

**Files:** Various (accessibility fixes)

**Sub-tasks:**

1. **Install axe DevTools** browser extension

2. **Audit homepage**:
   - Run axe scan on `/`
   - Fix any violations
   - Document findings

3. **Audit form page**:
   - Run axe scan during form interaction
   - Test with keyboard only
   - Test with screen reader (NVDA/VoiceOver)

4. **Common issues to check**:
   - Color contrast (minimum 4.5:1)
   - Missing alt text
   - Improper heading hierarchy
   - Missing ARIA labels
   - Insufficient focus indicators
   - Touch target size (minimum 44x44px)

5. **Create accessibility checklist**:

```markdown
## Accessibility Checklist

### Perceivable
- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Text is resizable to 200%
- [ ] Content doesn't rely on color alone

### Operable
- [ ] All functionality available via keyboard
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] Touch targets minimum 44x44px
- [ ] Skip to main content link

### Understandable
- [ ] Language declared (lang="ms")
- [ ] Form labels clear and associated
- [ ] Error messages specific
- [ ] Navigation consistent

### Robust
- [ ] Valid HTML
- [ ] ARIA used correctly
- [ ] Works with screen readers
- [ ] No console errors
```

**Acceptance Criteria:**
- [ ] Zero critical violations in axe DevTools
- [ ] Lighthouse Accessibility score = 100
- [ ] Keyboard navigation works throughout
- [ ] Screen reader tested (NVDA or VoiceOver)
- [ ] All interactive elements have focus indicators
- [ ] Color contrast meets WCAG AA

**Testing:**
```bash
npm run dev
# Use axe DevTools extension
# Test with keyboard only (no mouse)
# Test with screen reader
```

**Dependencies:** All component phases

---

### Task 7.3: Cross-Browser Testing

**Description:** Test application across different browsers and devices.

**Testing Matrix:**

| Browser | Version | OS | Status |
|---------|---------|-----|--------|
| Chrome | Latest | Desktop | [ ] |
| Firefox | Latest | Desktop | [ ] |
| Safari | Latest | macOS | [ ] |
| Edge | Latest | Windows | [ ] |
| Safari | Latest | iOS | [ ] |
| Chrome | Latest | Android | [ ] |

**Test Cases for Each Browser:**

1. **Visual Rendering**:
   - [ ] Hero image displays correctly
   - [ ] Countdown timer layout correct
   - [ ] Radio buttons styled properly
   - [ ] Number input buttons aligned
   - [ ] Google Maps embed loads
   - [ ] Confetti animation works
   - [ ] Toast notifications positioned correctly

2. **Functionality**:
   - [ ] Form submission works
   - [ ] Radio selection works
   - [ ] Number input +/- works
   - [ ] Calendar export works
   - [ ] Copy link works
   - [ ] All animations smooth

3. **Performance**:
   - [ ] Page loads < 3s
   - [ ] Animations at 60fps
   - [ ] No layout shifts

**Device Testing:**

Mobile devices (minimum):
- [ ] iPhone SE (375px)
- [ ] iPhone 14 Pro (393px)
- [ ] Samsung Galaxy S21 (360px)
- [ ] iPad Air (820px)

Desktop:
- [ ] 1366x768 (laptop)
- [ ] 1920x1080 (desktop)

**Acceptance Criteria:**
- [ ] Works on Chrome, Firefox, Safari, Edge
- [ ] Works on iOS Safari and Android Chrome
- [ ] No critical rendering issues
- [ ] Functionality works across all browsers
- [ ] Performance acceptable on all devices

**Testing:**
Use BrowserStack or manual testing on actual devices.

**Dependencies:** All previous phases

---

### Task 7.4: Performance Optimization

**Description:** Optimize Core Web Vitals and overall performance.

**Sub-tasks:**

1. **Image Optimization**:
```bash
# Verify hero image is optimized
# Should be WebP/AVIF format, < 200KB
```

2. **Add loading states for async operations**:
   - Google Maps lazy loading
   - Dynamic imports for heavy components
   - Skeleton loaders

3. **Optimize CSS**:
   - Ensure critical CSS inlined
   - Remove unused Tailwind classes (automatic with Tailwind)

4. **Add resource hints**:
Update head in layout:
```typescript
<link rel="dns-prefetch" href="https://maps.googleapis.com" />
<link rel="preconnect" href="https://maps.googleapis.com" />
```

5. **Run Lighthouse audits**:
```bash
# In Chrome DevTools
# Generate Lighthouse report for mobile and desktop
```

**Target Metrics:**
- LCP (Largest Contentful Paint): ≤ 2.5s
- FID (First Input Delay): ≤ 100ms
- CLS (Cumulative Layout Shift): ≤ 0.1
- FCP (First Contentful Paint): ≤ 1.8s
- TBT (Total Blocking Time): ≤ 300ms

**Acceptance Criteria:**
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility = 100
- [ ] Lighthouse Best Practices ≥ 90
- [ ] Lighthouse SEO ≥ 90
- [ ] Core Web Vitals all green
- [ ] No console errors or warnings

**Testing:**
```bash
npm run build
npm run start
# Run Lighthouse in incognito mode
```

**Dependencies:** Tasks 7.1, 7.2, 7.3

---

### Task 7.5: Create Performance Budget Configuration

**Description:** Set up Lighthouse CI for automated performance monitoring.

**Files:**
- `/home/ujai/Projek/Rahmat/majlis-rsvp/.lighthouserc.json` (new)
- `/home/ujai/Projek/Rahmat/majlis-rsvp/.github/workflows/lighthouse.yml` (new, if using GitHub Actions)

**Content for .lighthouserc.json:**
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": ["http://localhost:3000"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1.0 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**Acceptance Criteria:**
- [ ] Performance budget configured
- [ ] Can run local Lighthouse CI
- [ ] All budgets passing

**Testing:**
```bash
npm install -D @lhci/cli
npx lhci autorun
```

**Dependencies:** Task 7.4

---

## Phase 8: Deployment & Monitoring

**Duration:** Day 5 (4-6 hours)
**Final Rollback Checkpoint**

### Task 8.1: Pre-Deployment Verification

**Description:** Final checks before deploying to Vercel.

**Checklist:**

```markdown
## Pre-Deployment Checklist

### Build & Tests
- [ ] `npm run build` succeeds without errors
- [ ] All unit tests pass: `npm run test`
- [ ] All E2E tests pass: `npx playwright test`
- [ ] No TypeScript errors
- [ ] No ESLint warnings

### Environment Variables
- [ ] `.env.example` updated with all required variables
- [ ] Google Maps API key documented
- [ ] Local `.env.local` has all variables
- [ ] Vercel environment variables ready

### Performance
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility = 100
- [ ] Bundle size under budget (≤ 200KB gzipped)
- [ ] No console errors in production build

### Functionality
- [ ] Form submission works
- [ ] Radio selection works
- [ ] Number input works
- [ ] Countdown timer updates
- [ ] Google Maps loads
- [ ] Calendar export works
- [ ] Confetti animation works
- [ ] Toast notifications appear

### Accessibility
- [ ] Zero axe DevTools violations
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Focus indicators visible
- [ ] Touch targets ≥ 44px

### Cross-Browser
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested in Edge
- [ ] Tested on mobile (iOS/Android)

### Security
- [ ] CSP headers configured
- [ ] No security vulnerabilities: `npm audit`
- [ ] Google Maps API key restricted to domain
- [ ] No sensitive data in client code
```

**Acceptance Criteria:**
- [ ] All items in checklist completed
- [ ] No critical issues found
- [ ] Ready for deployment

**Dependencies:** All previous phases

---

### Task 8.2: Deploy to Vercel Preview Environment

**Description:** Deploy to Vercel preview for final testing before production.

**Commands:**
```bash
# Ensure Vercel CLI is installed
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel
```

**Sub-tasks:**

1. **Configure environment variables in Vercel**:
   - Go to Vercel dashboard → Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Add all other environment variables from `.env.local`

2. **Deploy preview**:
   ```bash
   vercel
   ```

3. **Test preview deployment**:
   - Visit preview URL
   - Test all functionality
   - Run Lighthouse on preview URL
   - Check browser console for errors

4. **Verify Google Maps**:
   - Update API key restrictions to allow preview domain
   - Test map embed loads

**Acceptance Criteria:**
- [ ] Preview deployment succeeds
- [ ] All environment variables set in Vercel
- [ ] Google Maps loads on preview URL
- [ ] All functionality works on preview
- [ ] No console errors
- [ ] Performance metrics acceptable

**Testing:**
```bash
# After deployment
# Visit preview URL and test thoroughly
```

**Dependencies:** Task 8.1

---

### Task 8.3: Production Deployment

**Description:** Deploy to production after preview testing.

**Commands:**
```bash
# Deploy to production
vercel --prod
```

**Sub-tasks:**

1. **Final verification on preview**:
   - Run full test suite on preview
   - Get stakeholder approval

2. **Deploy to production**:
   ```bash
   vercel --prod
   ```

3. **Update Google Maps API key restrictions**:
   - Add production domain to allowed referrers
   - Remove preview domain if temporary

4. **Post-deployment smoke tests**:
   - Visit production URL
   - Test critical path: form submission
   - Verify countdown timer
   - Check Google Maps
   - Test calendar export
   - Verify confetti animation

5. **Monitor for errors**:
   - Check Vercel logs
   - Monitor for runtime errors
   - Watch for CSP violations

**Acceptance Criteria:**
- [ ] Production deployment succeeds
- [ ] Production URL accessible
- [ ] All functionality works
- [ ] No console errors
- [ ] Google Maps loads
- [ ] Performance metrics meet targets
- [ ] SSL certificate active

**Dependencies:** Task 8.2

---

### Task 8.4: Set Up Monitoring and Alerts

**Description:** Configure monitoring for production application.

**Sub-tasks:**

1. **Enable Vercel Analytics**:
   - Go to Vercel dashboard → Project → Analytics
   - Enable Web Analytics
   - Review setup instructions

2. **Set up error tracking** (optional, if using Sentry):
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

3. **Configure alerts in Vercel**:
   - Set up deployment notifications
   - Configure error alerts
   - Set up performance degradation alerts

4. **Create monitoring dashboard**:
   - Track Core Web Vitals
   - Monitor error rates
   - Watch bounce rates
   - Track conversion (RSVP submissions)

**Acceptance Criteria:**
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured (if applicable)
- [ ] Alerts set up
- [ ] Monitoring dashboard accessible

**Dependencies:** Task 8.3

---

### Task 8.5: Documentation and Handoff

**Description:** Create final documentation and changelog.

**Files:**
- `/home/ujai/Projek/Rahmat/majlis-rsvp/CHANGELOG.md` (update or create)
- `/home/ujai/Projek/Rahmat/majlis-rsvp/README.md` (update)
- `/home/ujai/Projek/Rahmat/majlis-rsvp/spec/features/2025-11-28-ui-improvement-baby-boy-theme/IMPLEMENTATION.md` (new)

**Content for IMPLEMENTATION.md:**
```markdown
# UI Improvement Feature - Implementation Summary

**Feature ID:** `ui-improvement-baby-boy-theme`
**Implementation Date:** [Date]
**Status:** ✅ Completed

## What Was Implemented

### 1. Countdown Timer
- **Component:** `/components/client/countdown-timer.tsx`
- Real-time countdown to event date
- Responsive grid layout (2x2 mobile, 1x4 desktop)
- Accessible with ARIA attributes

### 2. Enhanced RSVP Form
- **Radio Group:** Radix UI Radio Group replacing native inputs
- **Number Input:** Custom component with +/- buttons
- **Loading States:** Spinner during submission
- Touch-friendly controls (44x44px minimum)

### 3. Google Maps Integration
- Embedded map in Event Details section
- API key configured in environment
- CSP updated to allow Google Maps resources

### 4. Calendar Export
- Add to Calendar button with multi-platform support
- Supports Google, Apple, iCal, Outlook, Yahoo
- Pre-filled event details

### 5. Confetti Animation
- Celebratory animation on successful RSVP
- Uses theme colors (baby blue, gold)
- Respects prefers-reduced-motion

### 6. Design System
- CSS custom properties for all design tokens
- Consistent spacing, colors, typography
- Smooth animations with Framer Motion

## Dependencies Added

```json
{
  "framer-motion": "^11.15.0",
  "canvas-confetti": "^1.9.3",
  "add-to-calendar-button-react": "^2.6.24",
  "@radix-ui/react-radio-group": "^1.2.3",
  "@radix-ui/react-progress": "^1.1.3"
}
```

**Total Bundle Size Increase:** ~56KB gzipped

## Environment Variables

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Performance Metrics

- **Lighthouse Performance:** [Score]
- **Lighthouse Accessibility:** 100
- **Bundle Size:** [Size] KB gzipped
- **LCP:** [Time]s
- **FID:** [Time]ms
- **CLS:** [Score]

## Accessibility

- WCAG 2.1 AA compliant
- Zero axe DevTools violations
- Keyboard navigation throughout
- Screen reader tested

## Browser Support

- ✅ Chrome (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)
- ✅ iOS Safari
- ✅ Android Chrome

## Rollback Procedure

If issues arise, rollback using:

```bash
vercel rollback
```

Or revert to commit: [commit-hash]

## Known Issues

None at deployment time.

## Future Enhancements

- WhatsApp sharing
- QR code generation
- Photo upload
- Multilingual support

## Sign-off

- [x] Development Complete
- [x] Testing Complete
- [x] Deployment Complete
- [x] Documentation Complete
```

**Update CHANGELOG.md:**
```markdown
# Changelog

## [2.0.0] - 2025-11-29

### Added
- Countdown timer to event date
- Google Maps embed in Event Details
- Add to Calendar button with multi-platform support
- Confetti animation on successful RSVP
- Enhanced form controls with Radix UI Radio Group
- Custom Number Input component with +/- buttons
- Framer Motion animations throughout
- Comprehensive design system with CSS custom properties
- Loading states for async operations
- Progress indicator component

### Changed
- Replaced native radio inputs with Radix UI Radio Group
- Enhanced Event Details section layout
- Updated Sonner toast configuration (center position, longer duration)
- Improved visual hierarchy and spacing
- Updated CSP headers to allow Google Maps

### Performance
- Bundle size increase: ~56KB gzipped
- Lighthouse Performance: ≥90
- Lighthouse Accessibility: 100
- All Core Web Vitals green

### Accessibility
- WCAG 2.1 AA compliant
- All touch targets ≥44px
- Keyboard navigation throughout
- Screen reader support
- Reduced motion support
```

**Update README.md:**
Add section about new features and environment variables.

**Acceptance Criteria:**
- [ ] IMPLEMENTATION.md created
- [ ] CHANGELOG.md updated
- [ ] README.md updated
- [ ] All documentation accurate
- [ ] Environment setup documented

**Dependencies:** Task 8.4

---

## Rollback Plan

### Immediate Rollback (5 minutes)

If critical issues detected:

```bash
vercel rollback
```

This instantly reverts to previous deployment.

### Git Rollback (15 minutes)

If Vercel rollback insufficient:

```bash
# Find last stable commit
git log --oneline

# Revert to stable commit
git revert <commit-hash>

# Push and redeploy
git push origin main
```

### Rollback Triggers

Rollback immediately if:
- [ ] Lighthouse Performance < 80
- [ ] Critical JavaScript errors in console
- [ ] Form submission broken
- [ ] Google Sheets integration fails
- [ ] Accessibility violations detected
- [ ] Site inaccessible or extremely slow

---

## Definition of Done

### Code Quality
- [ ] All tasks completed
- [ ] All tests passing (unit + E2E)
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code reviewed (if applicable)

### Functionality
- [ ] All features working as specified
- [ ] Form submission successful
- [ ] Countdown timer accurate
- [ ] Google Maps loading
- [ ] Calendar export functional
- [ ] Confetti animation smooth

### Performance
- [ ] Lighthouse Performance ≥ 90
- [ ] Bundle size ≤ 200KB gzipped
- [ ] LCP ≤ 2.5s
- [ ] FID ≤ 100ms
- [ ] CLS ≤ 0.1

### Accessibility
- [ ] Lighthouse Accessibility = 100
- [ ] Zero axe violations
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Touch targets ≥ 44px

### Deployment
- [ ] Deployed to production
- [ ] Environment variables set
- [ ] Google Maps API configured
- [ ] Monitoring enabled
- [ ] No console errors

### Documentation
- [ ] CHANGELOG.md updated
- [ ] README.md updated
- [ ] IMPLEMENTATION.md created
- [ ] Environment variables documented

---

## Timeline Summary

| Phase | Duration | Tasks | Checkpoint |
|-------|----------|-------|------------|
| Phase 1: Foundation | 4-6 hours | 1.1-1.6 | ✓ Rollback Point |
| Phase 2: UI Components | 6-8 hours | 2.1-2.6 | ✓ Rollback Point |
| Phase 3: Countdown | 4-6 hours | 3.1-3.3 | ✓ Rollback Point |
| Phase 4: Enhanced Form | 6-8 hours | 4.1-4.4 | ✓ Rollback Point |
| Phase 5: Event Details | 4-6 hours | 5.1-5.4 | ✓ Rollback Point |
| Phase 6: Confetti | 4-6 hours | 6.1-6.4 | ✓ Rollback Point |
| Phase 7: Optimization | 6-8 hours | 7.1-7.5 | ✓ Rollback Point |
| Phase 8: Deployment | 4-6 hours | 8.1-8.5 | ✓ Final Rollback |
| **Total** | **38-54 hours** | **5-7 days** | |

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Tests
npm run test                    # Unit tests
npx playwright test            # E2E tests

# Bundle analysis
ANALYZE=true npm run build

# Deployment
vercel                         # Preview
vercel --prod                  # Production
vercel rollback               # Rollback

# Lighthouse
npx lhci autorun
```

---

## Notes

- All file paths are absolute as required
- Commands use `npm` (not npx/yarn/pnpm/bun) as specified
- Each phase has rollback checkpoint
- Testing included in every phase
- Accessibility prioritized throughout
- Mobile-first approach maintained
- Project standards followed (Tailwind CSS, single responsibility, etc.)

---

**End of Tasks List**
