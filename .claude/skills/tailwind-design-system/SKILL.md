---
name: tailwind-design-system
description: Create consistent, scalable design systems using Tailwind CSS utility-first classes with custom themes, design tokens, and responsive design patterns. Use when styling any React, Next.js, Vue, or HTML components with Tailwind classes, building design systems with consistent spacing and typography, implementing custom themes and color palettes in tailwind.config, creating reusable utility class patterns and component variants, configuring Tailwind theme extensions for custom design tokens, implementing light and dark mode with class or data-theme strategy, building responsive layouts with Tailwind's mobile-first breakpoints (sm, md, lg, xl, 2xl), using Tailwind grid and flexbox utilities for complex layouts, creating consistent spacing scales (p-4, m-8, gap-6), establishing typography hierarchies (text-sm, text-lg, font-bold), using arbitrary values with square brackets [14px] for one-off styles, implementing custom color palettes with semantic naming, building component variants with conditional classes, creating animation and transition systems (transition-all, duration-300, ease-in-out), using Tailwind plugins for forms, typography, or aspect-ratio, applying hover, focus, and active state modifiers, implementing group and peer modifiers for parent-child interactions, using container queries with @container, or writing className strings in .tsx, .jsx, .vue, .html files.
---

# Tailwind CSS - Utility-First Styling

## When to use this skill

- Styling any React, Next.js, Vue, Svelte, or HTML components with Tailwind utility classes
- Building design systems with consistent spacing, colors, and typography tokens
- Implementing custom themes and color palettes in tailwind.config.ts or tailwind.config.js
- Creating reusable utility class patterns and component style variants
- Configuring Tailwind theme extensions to add custom design tokens (colors, fonts, spacing)
- Implementing light and dark mode theming with class="dark" or data-theme strategies
- Building responsive layouts using Tailwind's mobile-first breakpoints (sm:, md:, lg:, xl:, 2xl:)
- Using Tailwind Flexbox utilities (flex, items-center, justify-between) for layouts
- Using Tailwind Grid utilities (grid, grid-cols-3, gap-4) for complex layouts
- Creating consistent spacing with Tailwind scale (p-4, m-8, space-y-6, gap-4)
- Establishing typography hierarchies (text-sm, text-lg, text-2xl, font-bold, leading-tight)
- Using arbitrary values with square brackets for one-off styles (w-[137px], top-[13px])
- Implementing semantic color palettes (primary, secondary, accent, muted)
- Building component variants with conditional className logic based on props
- Creating animation systems (transition-all, duration-300, ease-in-out, animate-pulse)
- Using Tailwind plugins (@tailwindcss/forms, @tailwindcss/typography, @tailwindcss/aspect-ratio)
- Applying state modifiers (hover:, focus:, active:, disabled:, aria-checked:)
- Implementing group and peer modifiers for parent-child or sibling interactions
- Using @apply directive in CSS files to create reusable component classes
- Writing className or class attributes in .tsx, .jsx, .vue, .svelte, .html files
- Configuring content paths in tailwind.config for proper purging/tree-shaking

## Core Pattern
\`\`\`jsx
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h2 className="text-xl font-bold">Title</h2>
</div>
\`\`\`

## Resources
- [Tailwind CSS](https://tailwindcss.com/)
