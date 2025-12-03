# Production Deployment Checklist

**Feature:** UI Improvement - Baby Boy Aqiqah Theme
**Version:** 2.0.0
**Target Platform:** Vercel
**Package Manager:** npm

This document outlines the complete production deployment process, including preparation, deployment, verification, and rollback procedures.

---

## Pre-Deployment Preparation

### 1. Code Freeze

- [ ] All Phase 1-7 tasks completed
- [ ] All pull requests merged to main branch
- [ ] No pending commits
- [ ] Latest code pulled from repository
- [ ] Feature branch merged and tested

```bash
# Verify you're on main branch
git branch --show-current

# Pull latest changes
git pull origin main

# Verify no uncommitted changes
git status
```

### 2. Final Testing

- [ ] All unit tests pass: `npm run test`
- [ ] All E2E tests pass: `npx playwright test`
- [ ] Manual testing complete (see [Pre-Deployment Checklist](pre-deployment-checklist.md))
- [ ] Cross-browser testing complete
- [ ] Mobile device testing complete
- [ ] Accessibility audit passed (zero axe violations)

### 3. Environment Preparation

- [ ] Production Google Sheet created
  - Named: "Aqiqah RSVP - Production"
  - Sheet tab named: "RSVPs"
  - Headers initialized: Timestamp, Nama, Status Kehadiran, Bilangan Orang, Edit Link
  - Shared with service account (Editor permissions)
- [ ] Google Maps API key restrictions updated
  - Production domain added to authorized referrers
  - HTTP referrer restrictions enabled
- [ ] Production environment variables documented
- [ ] Edit token secret generated (new, unique for production)
- [ ] RSVP deadline confirmed

### 4. Stakeholder Communication

- [ ] Deployment scheduled and communicated
- [ ] Downtime window communicated (if applicable)
- [ ] Rollback plan shared with team
- [ ] Success criteria defined

---

## Deployment Procedure

### Step 1: Deploy to Preview (Final Test)

```bash
# Deploy to preview environment
vercel
```

**Verify on Preview:**
- [ ] All features work
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Data saves to **production** Google Sheet
- [ ] Edit links work
- [ ] Calendar export works
- [ ] Google Maps loads

**Preview URL:** _________________________

### Step 2: Configure Production Environment Variables

In Vercel Dashboard (**Settings** → **Environment Variables**):

| Variable Name | Value | Environment | Notes |
|---------------|-------|-------------|-------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `AIza...` | ✅ Production | Google Maps API key |
| `GOOGLE_SHEET_ID` | `1Abc...` | ✅ Production | Production sheet ID |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `service@...` | ✅ Production | Service account |
| `GOOGLE_PRIVATE_KEY` | `"-----BEGIN...` | ✅ Production | Include quotes & \n |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.com` | ✅ Production | Your production URL |
| `RSVP_DEADLINE` | `2026-01-10T23:59:59+08:00` | ✅ Production | ISO 8601 format |
| `EDIT_TOKEN_SECRET` | `new_random_string` | ✅ Production | New secret for prod |

**Verification:**
- [ ] All variables added
- [ ] All variables marked for "Production" environment
- [ ] Values confirmed correct (no typos)
- [ ] Private key includes proper formatting

### Step 3: Update Google Maps API Restrictions

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your API Key
4. Under **Application restrictions**:
   - Select "HTTP referrers (web sites)"
5. Add production domains:
   ```
   https://your-production-domain.com/*
   https://your-production-domain.vercel.app/*
   ```
6. Click **Save**

**Verification:**
- [ ] Production domain added
- [ ] Restrictions saved
- [ ] Test with: `https://your-domain.com` (should work)
- [ ] Test with unauthorized domain (should fail)

### Step 4: Deploy to Production

```bash
# Final production deployment
vercel --prod
```

**Expected Output:**
```
Vercel CLI 32.0.0
🔍  Inspect: https://vercel.com/your-account/aqiqah-rahmat/prod-abc123
✅  Production: https://your-production-domain.com
📝  Deployed to production. Run `vercel --prod` to overwrite later deployments.
```

**Record Deployment Details:**
- Deployment URL: _________________________
- Deployment ID: _________________________
- Timestamp: _________________________
- Deployed by: _________________________

---

## Post-Deployment Verification

### Immediate Smoke Tests (0-5 minutes)

#### 1. Page Load
- [ ] Production URL loads without errors
- [ ] All assets load (images, fonts, CSS, JS)
- [ ] No 404 errors in Network tab
- [ ] No console errors
- [ ] SSL certificate active (HTTPS)

#### 2. Visual Verification
- [ ] Hero section displays correctly
- [ ] Countdown timer visible and updating
- [ ] Event details section complete
- [ ] Google Maps embed visible
- [ ] Form displays correctly
- [ ] Footer information present

#### 3. Core Functionality
- [ ] Submit test RSVP (use test data)
- [ ] Verify success confirmation appears
- [ ] Check confetti animation fires
- [ ] Verify data in production Google Sheet
- [ ] Test edit link from confirmation
- [ ] Verify update works

**Test RSVP Details:**
- Name: "Production Test - [Your Name]"
- Status: Hadir
- Number: 2 people
- Timestamp: _________________________

### Functional Testing (5-15 minutes)

#### 1. Countdown Timer
- [ ] Displays correct time remaining
- [ ] Updates every second
- [ ] Shows all units (days, hours, minutes, seconds)
- [ ] No console errors

#### 2. RSVP Form
- [ ] Radio buttons work (Hadir/Tidak Hadir)
- [ ] Number input appears when "Hadir" selected
- [ ] Number input +/- buttons work
- [ ] Form validation displays errors
- [ ] Submit button shows loading state
- [ ] Success message appears after submission

#### 3. Google Maps
- [ ] Map embed loads
- [ ] Interactive (can zoom, pan)
- [ ] Shows correct location
- [ ] No API key errors
- [ ] Directions links work (Google Maps, Waze)

#### 4. Calendar Export
- [ ] "Add to Calendar" button visible
- [ ] Dropdown shows options (Google, Apple, iCal, Outlook.com)
- [ ] Click Google Calendar option
- [ ] Event details correct
- [ ] Event adds to calendar

#### 5. Confetti Animation
- [ ] Fires after successful submission
- [ ] Uses theme colors (baby blue, gold)
- [ ] Lasts approximately 3 seconds
- [ ] Doesn't block user interaction
- [ ] Respects reduced motion (test with setting enabled)

#### 6. Toast Notifications
- [ ] Success toast appears after submission
- [ ] Toast positioned at top-center
- [ ] Toast auto-dismisses after ~4 seconds
- [ ] Close button works
- [ ] Error toast appears for validation failures

### Performance Testing (15-30 minutes)

#### 1. Lighthouse Audit

```bash
npx lighthouse https://your-production-domain.com --view
```

**Target Scores:**
- [ ] **Performance:** ≥ 90 (actual: _____)
- [ ] **Accessibility:** 100 (actual: _____)
- [ ] **Best Practices:** ≥ 90 (actual: _____)
- [ ] **SEO:** ≥ 90 (actual: _____)

**Core Web Vitals:**
- [ ] **LCP:** ≤ 2.5s (actual: _____)
- [ ] **FID:** ≤ 100ms (actual: _____)
- [ ] **CLS:** ≤ 0.1 (actual: _____)

#### 2. Bundle Size Verification

Check Vercel deployment logs for bundle sizes:
- [ ] Main bundle ≤ 150KB gzipped
- [ ] Total initial load ≤ 200KB gzipped
- [ ] No unexpected large dependencies

#### 3. Network Throttling Test

Open Chrome DevTools → Network → Throttling:
- [ ] Test with "Fast 3G"
- [ ] Test with "Slow 3G"
- [ ] Page remains usable
- [ ] Loading states visible

### Security Verification (10-20 minutes)

#### 1. CSP Headers Check

```bash
curl -I https://your-production-domain.com | grep -i "content-security-policy"
```

- [ ] CSP header present
- [ ] Allows Google Maps resources
- [ ] No inline scripts in production
- [ ] No console CSP violations

#### 2. API Key Security

- [ ] Google Maps API key restrictions active
- [ ] Test unauthorized domain is blocked
- [ ] Service account credentials not exposed in client bundle
- [ ] No sensitive data in browser DevTools

#### 3. Vulnerability Scan

```bash
npm audit --production
```

- [ ] No high/critical vulnerabilities
- [ ] All dependencies up to date
- [ ] Security patches applied

### Cross-Browser Testing (20-30 minutes)

| Browser | Version | Status | Issues Found |
|---------|---------|--------|--------------|
| Chrome Desktop | Latest | ☐ Pass / ☐ Fail | |
| Firefox Desktop | Latest | ☐ Pass / ☐ Fail | |
| Safari Desktop | Latest | ☐ Pass / ☐ Fail | |
| Edge Desktop | Latest | ☐ Pass / ☐ Fail | |
| Chrome Mobile (Android) | Latest | ☐ Pass / ☐ Fail | |
| Safari Mobile (iOS) | Latest | ☐ Pass / ☐ Fail | |

**Test on Each Browser:**
- [ ] Page loads
- [ ] Form submission works
- [ ] Countdown timer updates
- [ ] Google Maps loads
- [ ] Calendar export works
- [ ] No console errors

### Accessibility Testing (10-15 minutes)

#### 1. axe DevTools Scan

- [ ] Run axe scan on homepage
- [ ] Run axe scan on form with errors
- [ ] Run axe scan on confirmation screen
- [ ] **Zero violations** found

#### 2. Keyboard Navigation

- [ ] Tab through all interactive elements
- [ ] Radio buttons navigable with arrow keys
- [ ] Number input buttons focusable
- [ ] Focus indicators visible
- [ ] No keyboard traps

#### 3. Screen Reader Test

Test with NVDA (Windows) or VoiceOver (Mac):
- [ ] Form labels announced
- [ ] Error messages announced
- [ ] Button purposes clear
- [ ] Countdown timer status announced

### Mobile Testing (15-20 minutes)

Test on real mobile devices (iOS and Android):

**iOS Device:**
- [ ] All touch targets tappable (≥ 44px)
- [ ] Radio buttons work
- [ ] Number input buttons work
- [ ] Form submission works
- [ ] Calendar export to Apple Calendar works
- [ ] No layout issues
- [ ] Confetti performance acceptable

**Android Device:**
- [ ] All touch targets tappable
- [ ] Form controls work
- [ ] Google Maps loads
- [ ] Calendar export to Google Calendar works
- [ ] No layout issues
- [ ] Performance acceptable

---

## Monitoring Setup

### 1. Vercel Logs

Monitor for errors:

```bash
vercel logs --prod --follow
```

Or in Vercel Dashboard:
- Go to **Deployments** → **Production** → **Logs**

**Check for:**
- ❌ Runtime errors
- ⚠️ Warning messages
- ✅ Successful API calls
- ✅ No CSP violations

### 2. Google Sheets Health Check

Visit: `https://your-production-domain.com/api/health/sheets`

**Expected Response:**
```json
{
  "status": "healthy",
  "sheetId": "1Abc...",
  "timestamp": "2025-12-03T10:30:00.000Z"
}
```

- [ ] Status is "healthy"
- [ ] Correct sheet ID
- [ ] Recent timestamp

### 3. Error Tracking (Optional)

If using Sentry or similar:
- [ ] Error tracking configured
- [ ] Test error reported
- [ ] Alerts configured
- [ ] Dashboard accessible

---

## Rollback Procedure

Use this if critical issues are discovered post-deployment.

### Level 1: Quick Rollback (5 minutes)

**Use when:** Critical functionality broken, immediate rollback needed

```bash
vercel rollback
```

This reverts to the previous production deployment.

**Verification:**
- [ ] Previous version live
- [ ] Functionality restored
- [ ] Users notified of temporary revert

### Level 2: Promote Previous Deployment (10 minutes)

**Use when:** Specific deployment known to be stable

1. Go to Vercel Dashboard → **Deployments**
2. Find stable deployment
3. Click **⋯** (three dots)
4. Click **Promote to Production**
5. Confirm promotion

**Verification:**
- [ ] Correct version promoted
- [ ] Functionality verified
- [ ] Team notified

### Level 3: Git Revert (15 minutes)

**Use when:** Need to revert code changes

```bash
# Find problematic commit
git log --oneline

# Revert commit
git revert <commit-hash>

# Push to trigger new deployment
git push origin main
```

**Verification:**
- [ ] Commit reverted
- [ ] New deployment triggered
- [ ] Functionality restored

### Post-Rollback Actions

After any rollback:
1. **Document the issue:**
   - What went wrong?
   - When was it detected?
   - What metrics were affected?

2. **Communicate:**
   - Notify stakeholders
   - Update status page (if applicable)
   - Explain next steps

3. **Fix and redeploy:**
   - Create hotfix branch
   - Fix issue
   - Test thoroughly
   - Re-deploy with caution

---

## Known Issues & Limitations

### Build Issue (As of deployment)

**Issue:** Partial build warnings present
**Impact:** No user-facing impact, all features functional
**Status:** Non-blocking, to be resolved in future update
**Workaround:** Manual verification completed for all features

### Feature Limitations

1. **Confetti Animation**
   - Decorative only, not accessible to screen readers
   - Can be disabled via `prefers-reduced-motion`

2. **Google Maps**
   - Requires internet connection
   - Subject to 25,000 free loads/day quota
   - Privacy consideration: data sent to Google

3. **Countdown Timer**
   - Uses client system time
   - May be inaccurate if client clock wrong

---

## Sign-Off

### Pre-Deployment

- [ ] **Developer:** Code complete, tested, ready for deployment
  - Signed: _____________ Date: _______

- [ ] **QA:** All tests passed, no blocking issues
  - Signed: _____________ Date: _______

- [ ] **Product Owner:** Features approved, ready for production
  - Signed: _____________ Date: _______

### Post-Deployment

- [ ] **Deployment Lead:** Deployment successful, verification complete
  - Signed: _____________ Date: _______
  - Deployment URL: _________________________
  - Deployment Time: _________________________

- [ ] **Monitoring:** Monitoring enabled, no critical errors
  - Signed: _____________ Date: _______

---

## Deployment Summary

**Deployment Date:** _________________________
**Deployment Time:** _________________________
**Deployed By:** _________________________
**Deployment ID:** _________________________
**Production URL:** _________________________

**Features Deployed:**
- ✅ Countdown Timer
- ✅ Enhanced RSVP Form (Radix UI)
- ✅ Google Maps Embed
- ✅ Calendar Export Button
- ✅ Confetti Animation
- ✅ Design System Enhancements
- ✅ Performance Optimizations
- ✅ Accessibility Improvements

**Performance Metrics:**
- Lighthouse Performance: _______
- Lighthouse Accessibility: _______
- Bundle Size: _______ KB gzipped
- LCP: _______ s
- FID: _______ ms
- CLS: _______

**Status:** ☐ Success / ☐ Partial / ☐ Rollback

**Issues Found:** _________________________

**Next Steps:** _________________________

---

## Post-Deployment Monitoring Schedule

| Time | Action | Responsible | Status |
|------|--------|-------------|--------|
| T+1 hour | Check error logs | DevOps | ☐ |
| T+4 hours | Review analytics | Product | ☐ |
| T+24 hours | Performance review | Dev Team | ☐ |
| T+3 days | User feedback review | Product | ☐ |
| T+7 days | Final assessment | All | ☐ |

---

**Deployment Complete!** → Proceed to [Monitoring Setup Guide](monitoring-setup-guide.md)
