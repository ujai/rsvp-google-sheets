# UI Improvement: Baby Boy Aqiqah Theme - Comprehensive Specification

**Feature ID:** `ui-improvement-baby-boy-theme`
**Created:** 2025-11-28
**Status:** Specification Complete
**Priority:** High
**Estimated Effort:** 3-5 days

---

## 1. Overview

### 1.1 Purpose

Transform the baby boy aqiqah RSVP application with a comprehensive UI overhaul that balances modern design, playful softness, and elegant refinement. The redesign will enhance user experience through rich interactions, improved visual hierarchy, and professional form controls while maintaining the existing baby blue color palette.

### 1.2 Goals

1. **Visual Excellence**: Create a premium, cohesive design that reflects the importance of the aqiqah celebration
2. **Enhanced Interactivity**: Implement smooth, delightful animations and micro-interactions
3. **Modern Form Controls**: Replace native HTML inputs with professional UI library components
4. **Improved Functionality**: Add countdown timer, Google Maps embed, and calendar export
5. **Performance Optimization**: Maintain fast load times despite added features
6. **Accessibility Compliance**: Ensure WCAG 2.1 AA standards throughout
7. **Mobile-First Excellence**: Prioritize mobile experience with responsive scaling

### 1.3 Success Criteria

- [ ] Lighthouse Performance score ≥ 90
- [ ] Lighthouse Accessibility score = 100
- [ ] All animations run at 60fps on mobile devices
- [ ] Bundle size increase ≤ 70KB gzipped
- [ ] Zero accessibility violations in axe DevTools
- [ ] Successful deployment to Vercel without errors
- [ ] Cross-browser testing passes (Chrome, Safari, Firefox, Edge)
- [ ] Touch targets meet 44x44px minimum on mobile
- [ ] Smooth animations respect `prefers-reduced-motion`

### 1.4 Out of Scope

- Backend functionality changes
- Data model modifications
- Admin dashboard redesign
- Multi-language support beyond existing Bahasa Malaysia
- Dark mode implementation (light theme only for baby celebration)

---

## 2. Design System

### 2.1 Color Palette (Preserved)

```css
/* Primary Colors */
--baby-blue: #a4c8e1;           /* Primary actions, accents */
--baby-blue-light: #c8dcea;     /* Borders, backgrounds */
--baby-blue-dark: #8fa8b8;      /* Text, hover states */

/* Accent Colors */
--gold: #d4af37;                /* Premium accents, borders */
--cream: #faf9f6;               /* Page background */

/* Status Colors */
--success: #10b981;             /* Success states */
--error: #ef4444;               /* Error messages */
--warning: #f59e0b;             /* Warnings */

/* Neutral Colors */
--foreground: #1f2937;          /* Primary text */
--muted: #6b7280;               /* Secondary text */
```

### 2.2 Typography

```css
/* Font Families */
--font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;

/* Type Scale (rem-based) */
--text-xs: 0.75rem;      /* 12px - helper text */
--text-sm: 0.875rem;     /* 14px - labels */
--text-base: 1rem;       /* 16px - body */
--text-lg: 1.125rem;     /* 18px - subheadings */
--text-xl: 1.25rem;      /* 20px - headings */
--text-2xl: 1.5rem;      /* 24px - section titles */
--text-3xl: 1.875rem;    /* 30px - hero text */
--text-4xl: 2.25rem;     /* 36px - page titles */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 2.3 Spacing System

```css
/* Consistent 4px base unit */
--spacing-1: 0.25rem;    /* 4px */
--spacing-2: 0.5rem;     /* 8px */
--spacing-3: 0.75rem;    /* 12px */
--spacing-4: 1rem;       /* 16px */
--spacing-5: 1.25rem;    /* 20px */
--spacing-6: 1.5rem;     /* 24px */
--spacing-8: 2rem;       /* 32px */
--spacing-10: 2.5rem;    /* 40px */
--spacing-12: 3rem;      /* 48px */
--spacing-16: 4rem;      /* 64px */
```

### 2.4 Border Radius (Playful Soft)

```css
--radius-sm: 0.375rem;   /* 6px - subtle rounding */
--radius-md: 0.5rem;     /* 8px - cards, inputs */
--radius-lg: 0.75rem;    /* 12px - buttons, cards */
--radius-xl: 1rem;       /* 16px - hero elements */
--radius-2xl: 1.5rem;    /* 24px - feature cards */
--radius-full: 9999px;   /* circular elements */
```

### 2.5 Shadows (Elegant Refined)

```css
/* Subtle, layered shadows for depth */
--shadow-sm: 0 1px 2px 0 rgba(143, 168, 184, 0.05);
--shadow-md: 0 4px 6px -1px rgba(143, 168, 184, 0.1),
             0 2px 4px -1px rgba(143, 168, 184, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(143, 168, 184, 0.1),
             0 4px 6px -2px rgba(143, 168, 184, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(143, 168, 184, 0.1),
             0 10px 10px -5px rgba(143, 168, 184, 0.04);
```

### 2.6 Animation Tokens

```css
/* Durations */
--duration-fast: 150ms;      /* Quick feedback */
--duration-base: 250ms;      /* Standard transitions */
--duration-slow: 350ms;      /* Prominent animations */
--duration-slower: 500ms;    /* Page transitions */

/* Easing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 3. Component Specifications

### 3.1 Hero Section with Countdown Timer

**Location:** `/components/server/hero-section.tsx`
**Type:** Server Component (countdown will be client component)

#### Current State
- Baby blue letterboxed image
- Gold decorative border
- Static display only

#### Enhanced Design

```tsx
<section className="relative w-full">
  {/* Hero Image Container */}
  <div className="relative w-full bg-baby-blue-light">
    <Image
      src="/images/hero.jpeg"
      alt="Majlis Aqiqah Rahmat"
      width={860}
      height={886}
      priority
      className="w-full h-auto max-w-[860px] mx-auto"
    />
  </div>

  {/* Gold Border */}
  <div className="w-full h-2 bg-gradient-to-r from-transparent via-gold to-transparent" />

  {/* Countdown Timer - Positioned below hero */}
  <div className="container mx-auto px-4 py-8">
    <CountdownTimer targetDate="2026-01-17T10:30:00+08:00" />
  </div>
</section>
```

#### Countdown Timer Component

**Location:** `/components/client/countdown-timer.tsx`
**Type:** Client Component

**Visual Design:**
- Centered layout with 4 time units (days, hours, minutes, seconds)
- Each unit in a soft rounded card with baby blue gradient background
- Large bold numbers with small unit labels
- Responsive: 4-column grid on desktop, 2x2 grid on mobile

**Props Interface:**
```typescript
interface CountdownTimerProps {
  targetDate: string; // ISO 8601 format
  className?: string;
}
```

**Behavior:**
- Updates every second using `setInterval`
- Cleans up on unmount
- Shows "Event Started!" when time reaches zero
- Smooth number transitions (avoid jarring updates)

**Accessibility:**
- `aria-live="polite"` for screen reader updates
- `role="timer"` on container
- Clear semantic labels for each time unit

**Code Structure:**
```tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
      role="timer"
      aria-live="polite"
      aria-label="Countdown to event"
    >
      {/* Time unit cards */}
    </div>
  );
}
```

---

### 3.2 Event Details Card with Google Maps Embed

**Location:** `/components/server/event-details.tsx`
**Type:** Server Component

#### Current State
- Icon-based detail cards
- Google Maps and Waze links as buttons
- No visual preview of location

#### Enhanced Design

**Added Features:**
1. Google Maps embed above map links
2. "Add to Calendar" button with multi-platform support
3. Enhanced visual hierarchy with better spacing
4. Hover effects on interactive elements

**Google Maps Embed:**
```tsx
<div className="w-full h-64 rounded-lg overflow-hidden border border-baby-blue-light mb-4">
  <iframe
    width="100%"
    height="100%"
    frameBorder="0"
    style={{ border: 0 }}
    referrerPolicy="no-referrer-when-downgrade"
    src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=place_id:ChIJR73efQBPzDERJUvQSAYq9us&zoom=15`}
    allowFullScreen
    loading="lazy"
    title="Map showing event location"
  />
</div>
```

**Add to Calendar Button:**
```tsx
import { AddToCalendarButton } from 'add-to-calendar-button-react';

<AddToCalendarButton
  name="Majlis Aqiqah Rahmat Don Zulkarnain"
  description="Jemputan ke Majlis Aqiqah & Kesyukuran"
  startDate="2026-01-17"
  startTime="10:30"
  endTime="14:30"
  timeZone="Asia/Kuala_Lumpur"
  location="Ruang Acara Nadi Rafanda, Shah Alam"
  options={['Google', 'Apple', 'iCal', 'Outlook.com']}
  buttonStyle="flat"
  lightMode="bodyScheme"
  styleLight="--btn-background: #a4c8e1; --btn-text: white;"
/>
```

**Accessibility:**
- Proper `title` on iframe for screen readers
- Loading state while map loads
- Fallback to static link if iframe fails
- Keyboard accessible calendar button

---

### 3.3 RSVP Form with Radix UI Controls

**Location:** `/components/client/rsvp-form.tsx`
**Type:** Client Component

#### Current State
- Native HTML radio inputs
- Native HTML number input
- Basic styling with Tailwind

#### Enhanced Design with Radix UI

**New Components to Create:**

1. **Radio Group Component** (`/components/ui/radio-group.tsx`)

```tsx
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

export { RadioGroup, RadioGroupItem };
```

2. **Enhanced Number Input** (`/components/ui/number-input.tsx`)

```tsx
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

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={disabled || (value || 0) <= min}
        className="h-10 w-10 rounded-lg border-baby-blue-light hover:bg-baby-blue/10"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <Input
        type="number"
        value={value || ''}
        onChange={(e) => {
          const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
          if (val === undefined || (val >= min && val <= max)) {
            onChange(val);
          }
        }}
        min={min}
        max={max}
        disabled={disabled}
        className="text-center h-10 w-20 border-baby-blue-light"
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={disabled || (value || 0) >= max}
        className="h-10 w-10 rounded-lg border-baby-blue-light hover:bg-baby-blue/10"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

**Updated Form Layout:**

```tsx
<FormField
  control={form.control}
  name="statusKehadiran"
  render={({ field }) => (
    <FormItem className="space-y-3">
      <FormLabel className="text-base font-medium text-baby-blue-dark">
        Status Kehadiran *
      </FormLabel>
      <FormControl>
        <RadioGroup
          value={field.value}
          onValueChange={field.onChange}
          disabled={isPending}
        >
          <div className="flex items-center space-x-3 p-4 border border-baby-blue-light rounded-lg hover:bg-baby-blue/5 transition-colors">
            <RadioGroupItem value="hadir" id="hadir" />
            <label
              htmlFor="hadir"
              className="text-sm font-medium cursor-pointer flex-1"
            >
              Hadir
            </label>
          </div>

          <div className="flex items-center space-x-3 p-4 border border-baby-blue-light rounded-lg hover:bg-baby-blue/5 transition-colors">
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
      <FormMessage />
    </FormItem>
  )}
/>
```

**Visual Enhancements:**
- Each radio option in a bordered, hoverable card
- Smooth transitions on hover and selection
- Clear visual feedback for selected state
- Focus rings for keyboard navigation
- Touch-friendly 44px minimum height

---

### 3.4 Confirmation Screen with Confetti

**Location:** `/components/client/confirmation.tsx`
**Type:** Client Component

#### Current State
- Static success message
- Copy link functionality
- New RSVP button

#### Enhanced Design

**Added Features:**
1. Confetti animation on mount
2. Success icon animation
3. Smooth fade-in transition
4. Improved visual hierarchy

**Implementation:**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export function Confirmation({ editLink, onNewRSVP }: ConfirmationProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#a4c8e1', '#d4af37', '#c8dcea'],
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#a4c8e1', '#d4af37', '#c8dcea'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Card className="border-baby-blue-light shadow-xl">
        <CardContent className="p-6 space-y-6">
          {/* Animated Success Icon */}
          <motion.div
            className="text-center space-y-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
          >
            <div className="flex justify-center">
              <CheckCircle2 className="w-20 h-20 text-success" />
            </div>
            <h2 className="text-3xl font-semibold text-baby-blue-dark">
              Terima Kasih!
            </h2>
            <p className="text-lg text-baby-blue-dark">
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

**Confetti Configuration:**
- Baby blue and gold colors matching theme
- Gentle, celebratory animation (not overwhelming)
- 3-second duration
- Fires from both sides of screen
- Respects `prefers-reduced-motion`

---

### 3.5 Toast Notification System

**Location:** Already using Sonner, enhance positioning and styling

#### Current State
- Sonner toasts with default styling
- Default positioning (top-right)

#### Enhanced Configuration

**Update:** `/components/ui/sonner.tsx`

```tsx
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

**Custom Styles in globals.css:**

```css
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

**Features:**
- Center-top positioning (more prominent)
- Theme-matching colors
- Longer duration (4s for better readability)
- Close button for user control
- Smooth slide-in animation

---

### 3.6 Progress Indicators

**Location:** `/components/ui/progress.tsx` (new component)

**Use Cases:**
1. Form submission loading state
2. Google Sheets API health check
3. Image loading states

**Implementation:**

```tsx
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

**Loading Button State:**

```tsx
<Button
  type="submit"
  disabled={isPending}
  className="relative w-full bg-baby-blue hover:bg-baby-blue-dark"
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

---

## 4. Technical Implementation

### 4.1 File Structure

```
majlis-rsvp/
├── components/
│   ├── client/
│   │   ├── countdown-timer.tsx          [NEW]
│   │   ├── rsvp-form.tsx                [MODIFIED]
│   │   ├── confirmation.tsx             [MODIFIED]
│   │   └── ...
│   ├── server/
│   │   ├── hero-section.tsx             [MODIFIED]
│   │   ├── event-details.tsx            [MODIFIED]
│   │   └── ...
│   └── ui/
│       ├── radio-group.tsx              [NEW]
│       ├── number-input.tsx             [NEW]
│       ├── progress.tsx                 [NEW]
│       ├── button.tsx                   [MODIFIED]
│       ├── input.tsx                    [MODIFIED]
│       ├── sonner.tsx                   [MODIFIED]
│       └── ...
├── lib/
│   ├── constants.ts                     [MODIFIED - add Google Maps API key]
│   ├── animations.ts                    [NEW - reusable animation variants]
│   └── ...
├── app/
│   └── globals.css                      [MODIFIED - new design tokens]
└── public/
    └── images/
        └── hero.jpeg                    [EXISTING]
```

### 4.2 New Dependencies

**Package.json additions:**

```json
{
  "dependencies": {
    "framer-motion": "^11.15.0",
    "canvas-confetti": "^1.9.3",
    "add-to-calendar-button-react": "^2.6.24",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-progress": "^1.1.3"
  },
  "devDependencies": {
    "@types/canvas-confetti": "^1.6.4"
  }
}
```

**Bundle Size Analysis:**
- Framer Motion: ~30KB gzipped (tree-shakeable)
- canvas-confetti: ~3KB gzipped
- add-to-calendar-button-react: ~15KB gzipped
- Radix UI Radio Group: ~5KB gzipped
- Radix UI Progress: ~3KB gzipped
- **Total Addition:** ~56KB gzipped

### 4.3 Environment Variables

**Add to `.env.local`:**

```env
# Google Maps Embed API Key (public - restricted to domain)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Update `/lib/env.ts`:**

```typescript
import { z } from 'zod';

const envSchema = z.object({
  // ... existing fields
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1, 'Google Maps API key is required'),
});

export const env = envSchema.parse({
  // ... existing fields
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
});
```

### 4.4 Animation Library Setup

**Create:** `/lib/animations.ts`

```typescript
import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
};

export const scaleIn: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 15 }
  },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const countdownFlip: Variants = {
  initial: { rotateX: 0 },
  animate: {
    rotateX: 360,
    transition: { duration: 0.6, ease: 'easeInOut' }
  },
};
```

### 4.5 Reduced Motion Support

**Add to globals.css:**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Framer Motion Configuration:**

```tsx
import { MotionConfig } from 'framer-motion';

// In layout.tsx
<MotionConfig reducedMotion="user">
  {children}
</MotionConfig>
```

---

## 5. Vercel Optimization

### 5.1 Next.js Configuration Updates

**Update:** `/next.config.ts`

```typescript
import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

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

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspHeader,
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN', // Changed from DENY to allow Google Maps
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=(), camera=()',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable SWC minification
  swcMinify: true,

  // Optimize CSS
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  // Production optimizations
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-progress',
    ],
  },
};

export default nextConfig;
```

**Key Changes:**
1. Allow Google Maps in CSP (`img-src`, `frame-src`, `connect-src`)
2. Change X-Frame-Options from DENY to SAMEORIGIN
3. Enable package import optimization
4. Remove console logs in production
5. Configure image optimization

### 5.2 Bundle Size Optimization

**Implement dynamic imports for heavy components:**

```tsx
// In pages where confetti is used
import dynamic from 'next/dynamic';

const Confirmation = dynamic(
  () => import('@/components/client/confirmation').then(mod => ({ default: mod.Confirmation })),
  {
    loading: () => <div className="animate-pulse">Loading...</div>,
    ssr: false // Confetti doesn't need SSR
  }
);
```

**Tree-shaking Framer Motion:**

```tsx
// Only import what you need
import { motion } from 'framer-motion';

// Instead of
import * as motion from 'framer-motion';
```

### 5.3 Performance Budget

**Create:** `/.lighthouserc.json`

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
    }
  }
}
```

### 5.4 Deployment Checklist

**Pre-deployment:**
- [ ] Run `npm run build` locally to verify no build errors
- [ ] Check bundle size: `npm run build -- --profile`
- [ ] Test all animations on mobile device
- [ ] Verify Google Maps API key is set in Vercel environment variables
- [ ] Run Lighthouse audit locally
- [ ] Test with slow 3G network throttling
- [ ] Verify all images are optimized

**Vercel Configuration:**
- [ ] Set environment variable: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- [ ] Enable Edge Config for better caching (if available)
- [ ] Configure custom domain with SSL
- [ ] Set up monitoring and alerts

---

## 6. Accessibility Checklist (WCAG 2.1 AA)

### 6.1 Perceivable

- [ ] **Color Contrast:**
  - Text on baby-blue-light background: 4.5:1 minimum
  - Gold accents have sufficient contrast
  - Error messages use red with icon + text (not color alone)

- [ ] **Alternative Text:**
  - Hero image has descriptive alt text
  - Google Maps iframe has title attribute
  - All icons have aria-labels or sr-only text

- [ ] **Adaptable:**
  - Logical heading hierarchy (h1 → h2 → h3)
  - Semantic HTML throughout
  - No content relies solely on shape/size/color

### 6.2 Operable

- [ ] **Keyboard Accessible:**
  - All interactive elements reachable via Tab
  - Radio groups navigable with arrow keys
  - Number input +/- buttons keyboard accessible
  - Skip to main content link
  - Visible focus indicators on all interactive elements

- [ ] **Enough Time:**
  - No time limits on form completion
  - Countdown timer is informational only, not interactive

- [ ] **Navigation:**
  - Clear focus order (top to bottom)
  - Breadcrumb for edit page
  - Multiple ways to access location (map + links)

### 6.3 Understandable

- [ ] **Readable:**
  - Language declared in HTML (`lang="ms"`)
  - Form labels clearly associated with inputs
  - Error messages specific and actionable

- [ ] **Predictable:**
  - Consistent navigation structure
  - Buttons describe their action ("Hantar RSVP", not "Submit")
  - No unexpected context changes

- [ ] **Input Assistance:**
  - Required fields marked with asterisk + text
  - Real-time validation feedback
  - Clear error messages in Bahasa Malaysia
  - Form maintains data on validation error

### 6.4 Robust

- [ ] **Compatible:**
  - Valid HTML5 markup
  - ARIA roles/states/properties used correctly
  - Tested with screen readers (NVDA, VoiceOver)
  - Works without JavaScript (progressive enhancement)

### 6.5 Touch Accessibility

- [ ] All touch targets minimum 44x44px
- [ ] Adequate spacing between interactive elements (8px minimum)
- [ ] No hover-only interactions
- [ ] Swipe gestures have alternatives

---

## 7. Performance Benchmarks

### 7.1 Target Metrics

**Core Web Vitals:**
- **LCP (Largest Contentful Paint):** ≤ 2.5s
- **FID (First Input Delay):** ≤ 100ms
- **CLS (Cumulative Layout Shift):** ≤ 0.1

**Additional Metrics:**
- **FCP (First Contentful Paint):** ≤ 1.8s
- **TBT (Total Blocking Time):** ≤ 300ms
- **TTI (Time to Interactive):** ≤ 3.8s

### 7.2 Bundle Size Limits

**JavaScript Bundles:**
- Main bundle: ≤ 150KB gzipped
- Route bundles: ≤ 50KB gzipped each
- Total initial load: ≤ 200KB gzipped

**CSS:**
- Critical CSS: Inlined in `<head>`
- Total CSS: ≤ 30KB gzipped

**Images:**
- Hero image: ≤ 200KB (optimized WebP/AVIF)
- Icons: SVG or icon font

### 7.3 Animation Performance

**Target: 60fps (16.67ms per frame)**

**Monitoring:**
```tsx
// Development-only performance monitoring
if (process.env.NODE_ENV === 'development') {
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log(`FPS: ${fps}`);
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    measureFPS();
  }, []);
}
```

**Optimization Strategies:**
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Debounce scroll/resize listeners
- Use `requestAnimationFrame` for JavaScript animations

### 7.4 Loading Strategy

**Image Loading:**
```tsx
<Image
  src="/images/hero.jpeg"
  alt="..."
  priority // Above the fold
  loading="eager"
/>

<Image
  src="/images/details.jpeg"
  alt="..."
  loading="lazy" // Below the fold
/>
```

**Component Loading:**
- Hero: Eager (above fold)
- Event Details: Eager (critical)
- RSVP Form: Eager (primary action)
- Countdown: Eager (small bundle)
- Confirmation: Dynamic import (shown after submission)
- Google Maps: Lazy with intersection observer

---

## 8. Testing Strategy

### 8.1 Unit Tests

**Framework:** Vitest + React Testing Library

**Test Files:**

1. **`/components/client/__tests__/countdown-timer.test.tsx`**

```typescript
import { render, screen, act } from '@testing-library/react';
import { CountdownTimer } from '../countdown-timer';
import { vi } from 'vitest';

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

    const initialSeconds = screen.getByLabelText(/saat/i).textContent;

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const updatedSeconds = screen.getByLabelText(/saat/i).textContent;
    expect(updatedSeconds).not.toBe(initialSeconds);
  });

  it('shows "Event Started" when time reaches zero', () => {
    const pastDate = new Date(Date.now() - 1000).toISOString();
    render(<CountdownTimer targetDate={pastDate} />);

    expect(screen.getByText(/event started/i)).toBeInTheDocument();
  });
});
```

2. **`/components/ui/__tests__/radio-group.test.tsx`**

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioGroupItem } from '../radio-group';

describe('RadioGroup', () => {
  it('renders all radio options', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="hadir" id="hadir" />
        <RadioGroupItem value="tidak_hadir" id="tidak_hadir" />
      </RadioGroup>
    );

    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('allows single selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <RadioGroup onValueChange={onChange}>
        <RadioGroupItem value="hadir" id="hadir" />
        <RadioGroupItem value="tidak_hadir" id="tidak_hadir" />
      </RadioGroup>
    );

    await user.click(screen.getByRole('radio', { name: /hadir/i }));
    expect(onChange).toHaveBeenCalledWith('hadir');
  });

  it('is keyboard navigable', async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup>
        <RadioGroupItem value="hadir" id="hadir" />
        <RadioGroupItem value="tidak_hadir" id="tidak_hadir" />
      </RadioGroup>
    );

    const firstRadio = screen.getAllByRole('radio')[0];
    firstRadio.focus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('radio')[1]).toHaveFocus();
  });
});
```

3. **`/components/ui/__tests__/number-input.test.tsx`**

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberInput } from '../number-input';

describe('NumberInput', () => {
  it('increments value when plus button clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<NumberInput value={1} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /plus/i }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('decrements value when minus button clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<NumberInput value={2} onChange={onChange} min={1} />);

    await user.click(screen.getByRole('button', { name: /minus/i }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('respects min/max bounds', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<NumberInput value={1} onChange={onChange} min={1} max={5} />);

    // Try to go below min
    await user.click(screen.getByRole('button', { name: /minus/i }));
    expect(onChange).not.toHaveBeenCalled();

    // Set to max
    onChange.mockClear();
    render(<NumberInput value={5} onChange={onChange} min={1} max={5} />);

    // Try to go above max
    await user.click(screen.getByRole('button', { name: /plus/i }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
```

**Run tests:**
```bash
npm run test
```

### 8.2 E2E Tests

**Framework:** Playwright

**Test Files:**

**Create:** `/e2e/rsvp-flow.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('RSVP Form with Enhanced UI', () => {
  test('complete RSVP submission with confetti', async ({ page }) => {
    await page.goto('/');

    // Verify countdown timer is visible
    await expect(page.getByRole('timer')).toBeVisible();

    // Fill out form with Radix UI components
    await page.getByLabel(/nama penuh/i).fill('Ahmad bin Abdullah');

    // Select radio option (enhanced UI)
    await page.getByRole('radio', { name: /hadir/i }).click();

    // Wait for number input to appear
    await expect(page.getByLabel(/bilangan orang/i)).toBeVisible();

    // Use number input controls
    const plusButton = page.getByRole('button', { name: /plus/i });
    await plusButton.click();
    await plusButton.click(); // Total: 3 people

    // Submit form
    await page.getByRole('button', { name: /hantar rsvp/i }).click();

    // Verify success message appears
    await expect(page.getByText(/terima kasih/i)).toBeVisible({ timeout: 5000 });

    // Verify confetti canvas exists (canvas-confetti creates canvas element)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Verify edit link is shown
    await expect(page.getByText(/pautan edit/i)).toBeVisible();

    // Test copy functionality
    await page.getByRole('button', { name: /salin/i }).click();
    await expect(page.getByText(/disalin/i)).toBeVisible();
  });

  test('Google Maps embed loads correctly', async ({ page }) => {
    await page.goto('/');

    // Scroll to event details
    await page.getByText(/butiran majlis/i).scrollIntoViewIfNeeded();

    // Verify Google Maps iframe loads
    const mapFrame = page.frameLocator('iframe[title*="Map"]');
    await expect(mapFrame.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('Add to Calendar button works', async ({ page }) => {
    await page.goto('/');

    // Find and click add to calendar button
    const calendarButton = page.getByRole('button', { name: /add to calendar/i });
    await calendarButton.click();

    // Verify calendar options appear
    await expect(page.getByText(/google/i)).toBeVisible();
    await expect(page.getByText(/apple/i)).toBeVisible();
  });

  test('respects reduced motion preferences', async ({ page }) => {
    // Enable reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/');

    // Submit form
    await page.getByLabel(/nama penuh/i).fill('Test User');
    await page.getByRole('radio', { name: /tidak hadir/i }).click();
    await page.getByRole('button', { name: /hantar rsvp/i }).click();

    // Confetti should still work but animations should be instant
    // Check that page doesn't have long-running animations
    const animationDuration = await page.evaluate(() => {
      const styles = window.getComputedStyle(document.body);
      return styles.animationDuration;
    });

    expect(animationDuration).toBe('0.01ms');
  });

  test('keyboard navigation works throughout form', async ({ page }) => {
    await page.goto('/');

    // Tab through form
    await page.keyboard.press('Tab'); // Name input
    await page.keyboard.type('Keyboard User');

    await page.keyboard.press('Tab'); // First radio option
    await page.keyboard.press('Space'); // Select it

    await page.keyboard.press('ArrowDown'); // Move to second radio
    await page.keyboard.press('Space'); // Select it

    // Verify selection worked
    const selectedRadio = page.getByRole('radio', { name: /tidak hadir/i });
    await expect(selectedRadio).toBeChecked();
  });
});
```

**Run E2E tests:**
```bash
npx playwright test
npx playwright test --headed # With browser UI
npx playwright test --debug # Debug mode
```

### 8.3 Visual Regression Testing

**Tool:** Playwright Screenshots

**Create:** `/e2e/visual.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for countdown to stabilize
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('form with validation errors matches snapshot', async ({ page }) => {
    await page.goto('/');

    // Submit empty form to trigger errors
    await page.getByRole('button', { name: /hantar rsvp/i }).click();

    await expect(page).toHaveScreenshot('form-errors.png', {
      animations: 'disabled',
    });
  });

  test('confirmation screen matches snapshot', async ({ page }) => {
    await page.goto('/');

    // Fill and submit form
    await page.getByLabel(/nama penuh/i).fill('Visual Test');
    await page.getByRole('radio', { name: /tidak hadir/i }).click();
    await page.getByRole('button', { name: /hantar rsvp/i }).click();

    // Wait for confetti to complete
    await page.waitForTimeout(3500);

    await expect(page).toHaveScreenshot('confirmation.png');
  });
});
```

### 8.4 Cross-Device Testing Matrix

**Devices to Test:**

| Device Type | Screen Size | Browser | Touch | Notes |
|-------------|-------------|---------|-------|-------|
| iPhone SE | 375x667 | Safari | Yes | Smallest mobile |
| iPhone 14 Pro | 393x852 | Safari | Yes | Modern mobile |
| iPad Air | 820x1180 | Safari | Yes | Tablet portrait |
| Samsung Galaxy | 412x915 | Chrome | Yes | Android |
| Desktop | 1920x1080 | Chrome | No | Large desktop |
| Desktop | 1366x768 | Firefox | No | Laptop |
| Desktop | 1920x1080 | Edge | No | Windows |

**Testing Checklist per Device:**
- [ ] Countdown timer displays correctly
- [ ] Radio buttons are touch-friendly (44x44px)
- [ ] Number input +/- buttons work
- [ ] Google Maps embed loads and is interactive
- [ ] Form submission shows loading state
- [ ] Confetti animation performs well
- [ ] Toast notifications appear correctly
- [ ] No horizontal scrolling
- [ ] Text is readable (not too small)
- [ ] All interactive elements reachable

### 8.5 Performance Testing

**Tools:**
- Lighthouse CI (automated)
- WebPageTest (detailed analysis)
- Chrome DevTools Performance panel

**Test Scenarios:**

1. **Slow 3G Network:**
```bash
# Using Lighthouse CLI
lighthouse https://your-app.vercel.app \
  --throttling.cpuSlowdownMultiplier=4 \
  --throttling.rttMs=150 \
  --throttling.throughputKbps=1600 \
  --view
```

2. **Low-End Mobile Device:**
```bash
lighthouse https://your-app.vercel.app \
  --emulated-form-factor=mobile \
  --throttling.cpuSlowdownMultiplier=6 \
  --view
```

3. **Bundle Size Analysis:**
```bash
npm run build
npx @next/bundle-analyzer
```

---

## 9. Implementation Phases

### Phase 1: Foundation & Dependencies (Day 1)

**Tasks:**
1. Install new dependencies
2. Set up environment variables (Google Maps API key)
3. Update `next.config.ts` with CSP changes
4. Create animation utilities (`lib/animations.ts`)
5. Update `globals.css` with new design tokens
6. Test build process

**Deliverables:**
- [ ] All dependencies installed
- [ ] Build succeeds locally
- [ ] Environment variables configured
- [ ] Design tokens documented

**Testing:**
- Run `npm run build` successfully
- Verify no console errors
- Check bundle size baseline

---

### Phase 2: UI Components (Day 2)

**Tasks:**
1. Create Radio Group component
2. Create Number Input component
3. Create Progress component
4. Update Button component with loading state
5. Configure Sonner toast positioning
6. Write unit tests for new components

**Deliverables:**
- [ ] `/components/ui/radio-group.tsx`
- [ ] `/components/ui/number-input.tsx`
- [ ] `/components/ui/progress.tsx`
- [ ] Unit tests passing
- [ ] Storybook stories (optional)

**Testing:**
- Unit tests for each component
- Accessibility checks with axe DevTools
- Keyboard navigation verification
- Visual checks in isolation

---

### Phase 3: Countdown Timer & Hero Section (Day 2-3)

**Tasks:**
1. Create Countdown Timer component
2. Update Hero Section to include countdown
3. Implement countdown logic with proper cleanup
4. Add accessibility attributes
5. Handle edge cases (past dates, timezone issues)
6. Write tests

**Deliverables:**
- [ ] `/components/client/countdown-timer.tsx`
- [ ] Updated `/components/server/hero-section.tsx`
- [ ] Tests passing
- [ ] Reduced motion support

**Testing:**
- Timer updates correctly
- Handles past dates
- Cleans up on unmount
- Accessible to screen readers
- Works across timezones

---

### Phase 4: Enhanced RSVP Form (Day 3)

**Tasks:**
1. Replace native radio with Radix UI Radio Group
2. Replace number input with custom Number Input
3. Add loading state to submit button
4. Update form validation messages
5. Test form submission flow
6. Write E2E tests

**Deliverables:**
- [ ] Updated `/components/client/rsvp-form.tsx`
- [ ] Improved form UX
- [ ] E2E tests covering happy path

**Testing:**
- Form validation works
- Radio selection updates properly
- Number input increments/decrements
- Submission shows loading state
- Error messages display correctly

---

### Phase 5: Event Details Enhancement (Day 3-4)

**Tasks:**
1. Add Google Maps embed
2. Integrate Add to Calendar button
3. Update layout and spacing
4. Handle iframe loading states
5. Test map interactions

**Deliverables:**
- [ ] Updated `/components/server/event-details.tsx`
- [ ] Google Maps embed working
- [ ] Calendar export functional

**Testing:**
- Map loads correctly
- Map is interactive
- Calendar button generates events
- Multiple calendar platforms work
- Fallback for failed map load

---

### Phase 6: Confirmation & Confetti (Day 4)

**Tasks:**
1. Update Confirmation component with Framer Motion
2. Implement confetti animation
3. Add reduced motion support
4. Improve copy link UX
5. Test animation performance

**Deliverables:**
- [ ] Updated `/components/client/confirmation.tsx`
- [ ] Confetti animation working
- [ ] 60fps performance verified

**Testing:**
- Confetti fires on mount
- Animation respects reduced motion
- Performance is smooth on mobile
- Copy link functionality works
- Animations don't block interaction

---

### Phase 7: Polish & Optimization (Day 4-5)

**Tasks:**
1. Optimize bundle size
2. Implement dynamic imports where needed
3. Add loading states for async operations
4. Review and fix accessibility issues
5. Cross-browser testing
6. Mobile device testing

**Deliverables:**
- [ ] Bundle size under target
- [ ] All accessibility checks pass
- [ ] Cross-browser compatibility verified

**Testing:**
- Lighthouse audit (all pages)
- axe DevTools scan (zero violations)
- Manual testing on real devices
- Performance profiling

---

### Phase 8: Deployment & Monitoring (Day 5)

**Tasks:**
1. Deploy to Vercel preview environment
2. Run production Lighthouse audits
3. Test on Vercel deployment
4. Monitor for errors
5. Fix any deployment-specific issues

**Deliverables:**
- [ ] Successful Vercel deployment
- [ ] Production Lighthouse scores meet targets
- [ ] No console errors in production
- [ ] Monitoring configured

**Testing:**
- Production smoke tests
- Real User Monitoring (if available)
- Error tracking verification
- Performance monitoring

---

## 10. Rollback Strategy

### 10.1 Git Strategy

**Branch Structure:**
```
main (production)
  └── feature/ui-improvement-baby-boy-theme (development)
       ├── feat/countdown-timer
       ├── feat/radix-ui-forms
       ├── feat/google-maps
       ├── feat/confetti-animation
       └── feat/performance-optimization
```

**Commit Strategy:**
- Feature branches for each major component
- Atomic commits that can be reverted independently
- Descriptive commit messages
- Squash merge to main after testing

### 10.2 Rollback Triggers

**Immediate Rollback If:**
- Lighthouse Performance score < 80
- Accessibility violations detected in production
- Critical JavaScript error affecting form submission
- Vercel build fails
- Bundle size exceeds 250KB gzipped
- Mobile experience is degraded
- Google Sheets integration breaks

### 10.3 Rollback Procedures

**Level 1: Quick Revert (5 minutes)**
```bash
# Revert to previous deployment on Vercel
vercel rollback
```

**Level 2: Git Revert (10 minutes)**
```bash
# Identify problematic commit
git log --oneline

# Revert specific commit
git revert <commit-hash>

# Push and redeploy
git push origin main
```

**Level 3: Feature Flag Disable (15 minutes)**

If feature flags were implemented:
```typescript
// In environment or config
export const FEATURE_FLAGS = {
  enhancedUI: false, // Disable new UI
  confetti: false,
  googleMaps: false,
  radixForms: false,
};

// In components
{FEATURE_FLAGS.enhancedUI ? <NewComponent /> : <LegacyComponent />}
```

**Level 4: Full Branch Revert (30 minutes)**
```bash
# Switch back to previous stable commit
git reset --hard <stable-commit-hash>

# Force push (use with caution)
git push --force origin main

# Redeploy on Vercel
```

### 10.4 Post-Rollback Actions

1. **Document the Issue:**
   - What went wrong?
   - When was it detected?
   - What metrics were affected?

2. **Fix in Development:**
   - Create hotfix branch
   - Reproduce issue locally
   - Implement fix
   - Test thoroughly

3. **Re-deploy:**
   - Smaller incremental changes
   - More extensive testing
   - Gradual rollout (if possible)

4. **Post-Mortem:**
   - Team review
   - Update testing procedures
   - Improve monitoring

### 10.5 Monitoring & Alerts

**Set up alerts for:**
- Error rate > 1%
- Performance degradation > 20%
- Failed API calls
- Unusual bounce rate
- Console errors in production

**Tools:**
- Vercel Analytics
- Sentry (error tracking)
- LogRocket (session replay)
- Google Analytics (user behavior)

---

## 11. Definition of Done

### 11.1 Code Complete Checklist

- [ ] All components implemented per spec
- [ ] Unit tests written and passing (>80% coverage)
- [ ] E2E tests written and passing
- [ ] Visual regression tests baseline created
- [ ] Code reviewed and approved
- [ ] No console errors or warnings
- [ ] TypeScript strict mode passing
- [ ] ESLint passing with no warnings
- [ ] Accessibility audit passing (axe DevTools)

### 11.2 Design Complete Checklist

- [ ] Matches design system tokens
- [ ] Responsive on all breakpoints
- [ ] Touch targets meet 44x44px minimum
- [ ] Animations run at 60fps
- [ ] Reduced motion support implemented
- [ ] Loading states designed and implemented
- [ ] Error states designed and implemented
- [ ] Empty states designed and implemented

### 11.3 Performance Complete Checklist

- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility = 100
- [ ] Lighthouse Best Practices ≥ 90
- [ ] Lighthouse SEO ≥ 90
- [ ] Bundle size ≤ 200KB gzipped
- [ ] LCP ≤ 2.5s
- [ ] FID ≤ 100ms
- [ ] CLS ≤ 0.1

### 11.4 Deployment Complete Checklist

- [ ] Deployed to Vercel successfully
- [ ] Environment variables configured
- [ ] Google Maps API key working
- [ ] Production build successful
- [ ] No deployment errors
- [ ] DNS configured correctly
- [ ] SSL certificate active
- [ ] Monitoring and alerts configured

### 11.5 Documentation Complete Checklist

- [ ] Component props documented
- [ ] API changes documented
- [ ] Environment variables documented
- [ ] Deployment instructions updated
- [ ] Rollback procedures documented
- [ ] README updated
- [ ] Changelog updated

---

## 12. Appendix

### 12.1 Design Decisions

**Why Framer Motion over CSS animations?**
- Declarative API easier to maintain
- Built-in reduced motion support
- Better performance with JavaScript-driven animations
- Rich ecosystem and community

**Why Radix UI over headless alternatives?**
- Excellent accessibility out of the box
- Unstyled primitives (full design control)
- Small bundle size
- Active maintenance and documentation

**Why canvas-confetti over CSS confetti?**
- Lightweight (3KB)
- Performance optimized
- Easy to control and customize
- No layout shift

### 12.2 Browser Support Matrix

| Browser | Version | Support Level | Notes |
|---------|---------|---------------|-------|
| Chrome | Last 2 versions | Full | Primary browser |
| Safari | Last 2 versions | Full | iOS primary |
| Firefox | Last 2 versions | Full | Standards compliant |
| Edge | Last 2 versions | Full | Chromium-based |
| Opera | Last 2 versions | Full | Chromium-based |
| Samsung Internet | Last 2 versions | Full | Android default |
| IE 11 | N/A | None | Not supported |

### 12.3 API Keys & Services

**Google Maps Embed API:**
- Free up to 25,000 loads/day
- Restrict to domain in Google Cloud Console
- Enable "Maps Embed API"
- Set referrer restrictions

**Add to Calendar Button:**
- No API key required
- Client-side generation
- Works offline

### 12.4 Known Limitations

1. **Confetti Animation:**
   - Uses canvas, not accessible to screen readers
   - Purely decorative (not conveying information)
   - Can be disabled by users via reduced motion

2. **Google Maps Embed:**
   - Requires active internet connection
   - Subject to Google's quota limits
   - Privacy considerations (loads from Google servers)

3. **Countdown Timer:**
   - Relies on client's system time
   - May be inaccurate if client clock is wrong
   - Timezone handling depends on browser

### 12.5 Future Enhancements (Out of Scope)

- [ ] WhatsApp sharing integration
- [ ] QR code generation for easy sharing
- [ ] Photo upload for attendees
- [ ] Live guest count display
- [ ] Dietary restrictions field
- [ ] Gift registry integration
- [ ] Transportation/parking information
- [ ] Multilingual support (English, Arabic)

---

## 13. Sign-off

**Specification Approved By:**
- [ ] Product Owner: _________________
- [ ] Tech Lead: _________________
- [ ] Designer: _________________
- [ ] QA Lead: _________________

**Implementation Timeline:**
- Start Date: TBD
- Target Completion: TBD
- Deployment Date: TBD

**Version History:**
- v1.0 - 2025-11-28 - Initial specification

---

**End of Specification Document**
