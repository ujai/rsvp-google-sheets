# Vercel Deployment Guide

**Feature:** UI Improvement - Baby Boy Aqiqah Theme
**Version:** 2.0.0
**Platform:** Vercel
**Package Manager:** npm

This guide walks through deploying the aqiqah RSVP application to Vercel, from preview deployment to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Preview Deployment](#preview-deployment)
4. [Environment Variables Configuration](#environment-variables-configuration)
5. [Production Deployment](#production-deployment)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying to Vercel, ensure you have:

- [x] **GitHub repository** with your code pushed
- [x] **Vercel account** (free tier is sufficient)
- [x] **All environment variables** documented and ready
- [x] **Google Maps API key** with domain restrictions configured
- [x] **Production Google Sheet** created and configured (separate from development)
- [x] **Pre-deployment checklist** completed

### Required Information

Gather these before starting:
- Google Maps API Key: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Production Google Sheet ID
- Service Account Email
- Service Account Private Key
- Edit Token Secret (generate a new one for production)
- RSVP Deadline Date

---

## Initial Setup

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

Verify installation:
```bash
vercel --version
```

### 2. Login to Vercel

```bash
vercel login
```

This will:
- Open a browser window
- Ask you to authenticate
- Link your local CLI to your Vercel account

### 3. Link Your Project

Navigate to your project directory:
```bash
cd /home/bajai/Projek/aqiqah-rahmat
```

Initialize Vercel project:
```bash
vercel
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account/team
- **Link to existing project?** → No (or Yes if you already created one)
- **What's your project's name?** → `aqiqah-rahmat` (or your preferred name)
- **In which directory is your code located?** → `./` (current directory)
- **Want to override the settings?** → No

This creates a `.vercel` directory with your project configuration.

---

## Preview Deployment

Preview deployments allow you to test before going to production.

### 1. Deploy to Preview

```bash
vercel
```

This will:
- Build your application
- Deploy to a preview URL (e.g., `aqiqah-rahmat-abc123.vercel.app`)
- Provide a URL to access the deployment

**Output Example:**
```
Vercel CLI 32.0.0
🔍  Inspect: https://vercel.com/your-account/aqiqah-rahmat/abc123
✅  Preview: https://aqiqah-rahmat-abc123.vercel.app
```

### 2. Configure Environment Variables for Preview

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to https://vercel.com
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Click **Add New**
   - Enter **Key** and **Value**
   - Select environments: **Preview** (for now)
   - Click **Save**

**Option B: Via Vercel CLI**

```bash
# Add environment variables one by one
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
# When prompted, paste the value and select 'Preview' environment

vercel env add GOOGLE_SHEET_ID
# Paste production Google Sheet ID

vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL
# Paste service account email

vercel env add GOOGLE_PRIVATE_KEY
# Paste private key (include quotes and \n characters)

vercel env add NEXT_PUBLIC_APP_URL
# Use preview URL: https://aqiqah-rahmat-abc123.vercel.app

vercel env add RSVP_DEADLINE
# Example: 2026-01-10T23:59:59+08:00

vercel env add EDIT_TOKEN_SECRET
# Paste a strong random string
```

### 3. Redeploy with Environment Variables

After adding environment variables, redeploy:

```bash
vercel
```

The new deployment will include your environment variables.

### 4. Test Preview Deployment

Visit your preview URL and verify:
- [ ] Page loads without errors
- [ ] Countdown timer displays
- [ ] Google Maps embed loads
- [ ] Form submission works
- [ ] Data saves to **production Google Sheet** (verify this!)
- [ ] Calendar export button works
- [ ] Confetti animation fires
- [ ] No console errors

**Check Vercel Logs:**
```bash
vercel logs <deployment-url>
```

Or view in dashboard:
- Go to **Deployments** → Select your deployment → **Logs**

---

## Environment Variables Configuration

### Complete List of Required Variables

| Variable | Example | Environment | Description |
|----------|---------|-------------|-------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `AIzaSyABC...` | All | Google Maps embed API key |
| `GOOGLE_SHEET_ID` | `1Abc123...` | All | Production Google Sheet ID |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `service@project.iam.gserviceaccount.com` | All | Service account email |
| `GOOGLE_PRIVATE_KEY` | `"-----BEGIN PRIVATE KEY-----\n..."` | All | Service account private key |
| `NEXT_PUBLIC_APP_URL` | `https://aqiqah-rahmat.vercel.app` | Production | Your production domain |
| `RSVP_DEADLINE` | `2026-01-10T23:59:59+08:00` | All | RSVP deadline (ISO 8601) |
| `EDIT_TOKEN_SECRET` | `random_secret_string_here` | All | Secret for edit token generation |

### Important Notes

1. **Google Private Key Format:**
   - Must include quotes around the value
   - Must include `\n` for line breaks (not actual newlines)
   - Example: `"-----BEGIN PRIVATE KEY-----\nMIIEv...ABCD==\n-----END PRIVATE KEY-----\n"`

2. **Production Google Sheet:**
   - Create a NEW Google Sheet for production (don't reuse development sheet)
   - Name it clearly: "Aqiqah RSVP - Production"
   - Share it with the service account (Editor permissions)
   - Initialize with headers: `Timestamp`, `Nama`, `Status Kehadiran`, `Bilangan Orang`, `Edit Link`

3. **Google Maps API Key Restrictions:**
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Click on your API Key
   - Under "Application restrictions":
     - Select "HTTP referrers (web sites)"
     - Add your preview domain: `*.vercel.app/*`
     - Add your production domain: `yourdomain.com/*`
   - Click **Save**

---

## Production Deployment

Once preview deployment is tested and approved, deploy to production.

### 1. Final Pre-Production Checks

- [ ] Preview deployment fully tested
- [ ] All environment variables verified
- [ ] Google Maps API key restrictions include production domain
- [ ] Production Google Sheet is ready and shared
- [ ] Stakeholders notified of deployment
- [ ] Rollback plan documented

### 2. Update Environment Variables for Production

In Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. For each variable, click **Edit**
3. Check **Production** environment
4. Click **Save**

**OR** add production-specific values:
1. Add **NEXT_PUBLIC_APP_URL** with production domain
2. Verify all other variables are set for **Production** environment

### 3. Deploy to Production

```bash
vercel --prod
```

This will:
- Build your application
- Deploy to production URL
- Assign your custom domain (if configured)

**Output Example:**
```
Vercel CLI 32.0.0
🔍  Inspect: https://vercel.com/your-account/aqiqah-rahmat/prod123
✅  Production: https://aqiqah-rahmat.vercel.app
```

### 4. Configure Custom Domain (Optional)

If you have a custom domain:

1. In Vercel Dashboard, go to **Settings** → **Domains**
2. Click **Add**
3. Enter your domain: `aqiqah.yourdomain.com`
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

**DNS Configuration:**
- Add a CNAME record pointing to `cname.vercel-dns.com`

---

## Post-Deployment Verification

### 1. Smoke Tests

Visit production URL and verify:

- [ ] **Page loads:** No errors, all assets load
- [ ] **Hero section:** Image displays, gold border present
- [ ] **Countdown timer:** Shows correct time remaining, updates every second
- [ ] **Event details:** All information correct
- [ ] **Google Maps:** Embed loads, interactive, correct location
- [ ] **RSVP form:** All fields present, validation works
- [ ] **Radio selection:** "Hadir" and "Tidak Hadir" work correctly
- [ ] **Number input:** +/- buttons work, manual entry works
- [ ] **Form submission:** Success message appears, confetti fires
- [ ] **Data saved:** Check production Google Sheet for new entry
- [ ] **Edit link:** Works and allows editing
- [ ] **Calendar export:** Button works, event details correct
- [ ] **Toast notifications:** Appear for success/errors
- [ ] **Mobile responsive:** Test on mobile device

### 2. Performance Check

Run Lighthouse audit on production URL:

```bash
npx lighthouse https://your-production-url.vercel.app --view
```

Verify:
- [ ] **Performance:** ≥ 90
- [ ] **Accessibility:** 100
- [ ] **Best Practices:** ≥ 90
- [ ] **SEO:** ≥ 90

### 3. Monitor Vercel Logs

Check for errors:

```bash
vercel logs --prod
```

Or in dashboard:
- **Deployments** → **Production** → **Logs**

Look for:
- ❌ Any error messages
- ⚠️ Warnings about deprecated features
- ✅ Successful API calls
- ✅ No CSP violations

### 4. Test Google Sheets Integration

1. Submit a test RSVP
2. Go to production Google Sheet
3. Verify:
   - New row added
   - All fields populated correctly
   - Edit link is valid
   - Timestamp is correct

### 5. Browser Testing

Test on multiple browsers:
- [ ] Chrome (desktop & mobile)
- [ ] Firefox (desktop)
- [ ] Safari (desktop & iOS)
- [ ] Edge (desktop)

---

## Troubleshooting

### Build Fails on Vercel

**Symptom:** Deployment fails during build step

**Possible Causes:**
1. TypeScript errors
2. Missing environment variables
3. Dependency issues
4. Build timeout

**Solutions:**

```bash
# Test build locally first
npm run build

# Check Vercel logs
vercel logs <deployment-url>

# Increase build timeout (vercel.json)
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "maxDuration": 300
      }
    }
  ]
}
```

### Environment Variables Not Working

**Symptom:** Application can't access environment variables

**Causes:**
- Variables not set for correct environment (Preview vs Production)
- Typo in variable name
- Need to redeploy after adding variables

**Solutions:**
1. Check variable name matches exactly (case-sensitive)
2. Verify environment is selected (Preview/Production)
3. Redeploy after adding variables:
   ```bash
   vercel --force
   ```

### Google Maps Not Loading

**Symptom:** Map embed shows error or blank

**Causes:**
- API key not set
- Domain not authorized
- API not enabled

**Solutions:**
1. Check `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in Vercel
2. Verify domain restrictions in Google Cloud Console
3. Enable "Maps Embed API" in Google Cloud Console
4. Check browser console for specific error

### Google Sheets Permission Error

**Symptom:** "The caller does not have permission" error

**Causes:**
- Sheet not shared with service account
- Wrong service account email
- Private key issue

**Solutions:**
1. Share production Google Sheet with service account email
2. Give Editor permissions
3. Verify `GOOGLE_SERVICE_ACCOUNT_EMAIL` is correct
4. Check `GOOGLE_PRIVATE_KEY` format (must include `\n`)

### Deployment Succeeds but Features Don't Work

**Symptom:** App deploys but specific features fail

**Checklist:**
1. Check Vercel function logs for errors
2. Verify all environment variables are set for Production
3. Test API endpoints directly: `/api/health/sheets`
4. Check browser console for client-side errors
5. Verify Google Sheets API quotas not exceeded

### CSP Violations

**Symptom:** Features blocked by Content Security Policy

**Check:**
1. Browser console for CSP errors
2. `next.config.ts` CSP configuration
3. Ensure Google Maps domains are allowed:
   - `img-src https://maps.googleapis.com https://maps.gstatic.com`
   - `frame-src https://www.google.com`
   - `connect-src https://maps.googleapis.com`

### Slow Performance

**Symptom:** Lighthouse Performance score < 90

**Check:**
1. Bundle size: `npm run build`
2. Image optimization: Use Next.js Image component
3. Enable compression in Vercel (usually automatic)
4. Check for blocking resources
5. Verify animations respect `prefers-reduced-motion`

---

## Vercel-Specific Optimizations

### 1. Edge Functions (Optional)

For faster response times, consider Edge Functions:

```typescript
// Add to API routes
export const config = {
  runtime: 'edge',
};
```

**Note:** Not all APIs work with Edge runtime. Test thoroughly.

### 2. Image Optimization

Vercel automatically optimizes images with Next.js Image component.

Ensure you're using:
```tsx
import Image from 'next/image';

<Image
  src="/images/hero.jpeg"
  alt="Majlis Aqiqah"
  width={860}
  height={886}
  priority
/>
```

### 3. Analytics

Enable Vercel Analytics:
1. Go to **Analytics** tab in Vercel dashboard
2. Click **Enable Web Analytics**
3. Follow setup instructions
4. View real-user metrics

### 4. Caching

Vercel automatically caches:
- Static assets (images, fonts, CSS, JS)
- Server-rendered pages (with proper cache headers)

Customize caching in `next.config.ts`:
```typescript
{
  headers: async () => [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}
```

---

## Rollback Procedure

If issues arise in production:

### Quick Rollback (5 minutes)

```bash
vercel rollback
```

This reverts to the previous successful deployment.

### Manual Rollback via Dashboard

1. Go to **Deployments** in Vercel dashboard
2. Find previous working deployment
3. Click **⋯** (three dots)
4. Click **Promote to Production**

### Git-Based Rollback

```bash
# Find stable commit
git log --oneline

# Revert to stable commit
git revert <commit-hash>

# Push and redeploy
git push origin main
# Vercel auto-deploys from main branch
```

---

## Additional Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables
- **Custom Domains:** https://vercel.com/docs/concepts/projects/domains
- **Vercel CLI Reference:** https://vercel.com/docs/cli

---

## Deployment Checklist Summary

- [ ] Vercel CLI installed and authenticated
- [ ] Project linked to Vercel
- [ ] All environment variables added (Preview & Production)
- [ ] Google Maps API key restrictions configured
- [ ] Production Google Sheet created and shared
- [ ] Preview deployment tested successfully
- [ ] Production deployment executed
- [ ] Post-deployment smoke tests passed
- [ ] Performance metrics verified
- [ ] Monitoring enabled
- [ ] Team notified of deployment

**Deployment Complete!** → Proceed to [Monitoring Setup Guide](monitoring-setup-guide.md)
