---
name: artifacts-builder
description: Create interactive, self-contained HTML artifacts like mini-apps, visualizations, calculators, and tools that can be embedded or used standalone in Claude.ai conversations. Use when building interactive calculators and unit converters, creating data visualizations and charts (Chart.js, D3.js), making mini web applications with Tailwind CSS, building embeddable widgets for websites, creating interactive demos and prototypes, making tools for specific tasks (UUID generators, JSON validators, regex testers), generating standalone single-file HTML/JavaScript applications, building interactive forms and quizzes, creating educational interactive content and tutorials, making API testing or debugging tools, building configuration generators (webpack, nginx), creating shareable interactive examples for documentation, making color palette generators or design tools, building markdown or code formatters, creating interactive timelines or progress trackers, making games or animations with Canvas API, building data entry forms with validation, creating comparison tables or pricing calculators, or making any self-contained interactive tool that runs entirely in the browser without backend requirements.
---

# Artifacts Builder - Claude.ai HTML Artifacts

## When to use this skill

- Building interactive calculators (mortgage, tip, BMI) and unit converters (temperature, currency)
- Creating data visualizations, charts, and graphs using Chart.js, D3.js, or Canvas
- Making mini web applications that run entirely in the browser
- Building embeddable widgets that can be added to websites via iframe
- Creating interactive demos, prototypes, and proof-of-concepts
- Making developer tools (UUID generators, JSON formatters, regex testers, base64 encoders)
- Generating standalone single-file HTML/JavaScript applications with no build step
- Building interactive forms, surveys, and quizzes with client-side validation
- Creating educational interactive content, tutorials, and learning tools
- Making API testing tools, HTTP request builders, or debugging utilities
- Building configuration generators for tools like webpack, nginx, or Docker
- Creating shareable interactive code examples for documentation
- Making color palette generators, gradient tools, or design utilities
- Building markdown previews, code formatters, or syntax highlighters
- Creating interactive timelines, progress trackers, or countdown timers
- Making simple games, animations, or visualizations using Canvas API
- Building data entry forms with real-time validation and formatting
- Creating comparison tables, pricing calculators, or decision trees
- Making any tool that needs to be self-contained, portable, and run without a server
- User asks for "interactive" content, "tool", "calculator", "generator", or "widget"
- User requests something that should work in Claude.ai conversation
- Building something that should be shareable as a single HTML file

## Pattern
\`\`\`html
<!DOCTYPE html>
<html>
<body>
  <script src="https://cdn.tailwindcss.com"></script>
  <div class="p-8">Content here</div>
</body>
</html>
\`\`\`
