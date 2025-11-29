---
name: vercel-deployment
description: Deploy and optimize Next.js and static applications on Vercel platform with automatic preview deployments, edge functions, environment variables, and performance monitoring. Use when deploying Next.js applications to Vercel with git integration, setting up automatic preview deployments for every pull request, configuring environment variables for production, preview, and development environments, using Vercel Edge Functions and Edge Middleware for low-latency compute, optimizing build performance with caching and incremental builds, implementing redirects, rewrites, and security headers in vercel.json or next.config, configuring custom domains with automatic SSL certificates, monitoring application performance with Vercel Analytics and Web Vitals, implementing incremental static regeneration (ISR) for Next.js pages, setting up monorepo deployments with Turborepo or pnpm workspaces, configuring serverless function regions for optimal latency, using Vercel Storage (KV, Postgres, Blob) for data persistence, troubleshooting build failures and deployment errors, configuring build settings and output directory, or optimizing Next.js builds for Vercel's infrastructure.
---

# Vercel Deployment - Production Deployments

## When to use this skill

- Deploying Next.js applications to Vercel platform using git push or Vercel CLI
- Setting up automatic preview deployments that create unique URLs for every pull request
- Configuring environment variables separately for Production, Preview, and Development environments
- Using Vercel Edge Functions for low-latency serverless compute at the edge network
- Implementing Edge Middleware in middleware.ts for request interception and auth
- Optimizing build performance with Vercel's build cache and incremental static regeneration
- Implementing redirects, rewrites, and custom headers in vercel.json configuration file
- Configuring custom domains (example.com) with automatic SSL/TLS certificates from Let's Encrypt
- Monitoring real user performance with Vercel Analytics, Web Vitals, and Speed Insights
- Implementing incremental static regeneration (ISR) with revalidate for Next.js pages
- Setting up monorepo deployments for Turborepo or pnpm workspace projects
- Configuring serverless function regions (iad1, sfo1, sin1) for optimal latency
- Using Vercel KV (Redis), Vercel Postgres, or Vercel Blob for data storage
- Troubleshooting build failures, deployment errors, and function timeouts in logs
- Configuring build settings (install command, build command, output directory) in project settings
- Optimizing Next.js configuration for Vercel (Image optimization, streaming, edge runtime)
- Using vercel.json for advanced configuration (builds, routes, cron jobs)
- Setting up deployment protection, password protection, or IP allowlisting
- Integrating with GitHub, GitLab, or Bitbucket for automatic deployments
- Running vercel --prod for production deployments from CLI
- Using Vercel Toolbar for debugging deployments and editing environment variables

## Deploy
\`\`\`bash
vercel --prod
\`\`\`

## Resources
- [Vercel Docs](https://vercel.com/docs)
