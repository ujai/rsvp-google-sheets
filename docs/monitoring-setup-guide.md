# Monitoring & Analytics Setup Guide

**Feature:** UI Improvement - Baby Boy Aqiqah Theme
**Version:** 2.0.0
**Platform:** Vercel
**Last Updated:** 2025-12-03

This guide covers setting up comprehensive monitoring, analytics, and alerting for your production deployment.

---

## Table of Contents

1. [Vercel Analytics](#vercel-analytics)
2. [Error Tracking with Sentry (Optional)](#error-tracking-with-sentry-optional)
3. [Custom Monitoring Dashboard](#custom-monitoring-dashboard)
4. [Alert Configuration](#alert-configuration)
5. [Key Metrics to Monitor](#key-metrics-to-monitor)
6. [Log Analysis](#log-analysis)
7. [Performance Monitoring](#performance-monitoring)

---

## Vercel Analytics

Vercel provides built-in analytics for tracking Core Web Vitals and user behavior.

### Step 1: Enable Vercel Web Analytics

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **aqiqah-rahmat**
3. Navigate to **Analytics** tab
4. Click **Enable Web Analytics**

**What You Get:**
- Real user monitoring (RUM)
- Core Web Vitals tracking
- Page performance metrics
- Traffic analytics
- Geographic distribution

### Step 2: Install Analytics Package (Optional)

For more granular tracking:

```bash
npm install @vercel/analytics
```

**Add to your app:**

Create or update `/home/bajai/Projek/aqiqah-rahmat/app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Redeploy:**
```bash
vercel --prod
```

### Step 3: Configure Analytics Settings

In Vercel Dashboard → **Analytics** → **Settings**:

1. **Data Retention:**
   - Select retention period (7 days, 30 days, 90 days)
   - Free tier: 7 days
   - Pro tier: 90 days

2. **Privacy Settings:**
   - [ ] Enable IP anonymization
   - [ ] Respect "Do Not Track" headers
   - [ ] GDPR compliance mode (if applicable)

3. **Custom Events (Pro Feature):**
   - Track specific user interactions
   - Example: RSVP submissions, calendar exports

### Step 4: View Analytics Dashboard

Navigate to **Analytics** tab to view:

- **Overview:**
  - Total page views
  - Unique visitors
  - Bounce rate
  - Average session duration

- **Core Web Vitals:**
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
  - FCP (First Contentful Paint)
  - TTFB (Time to First Byte)

- **Top Pages:**
  - Most visited pages
  - Performance per page
  - Exit rates

- **Devices:**
  - Desktop vs mobile traffic
  - Browser distribution
  - Operating systems

- **Geography:**
  - Visitor locations
  - Regional performance

---

## Error Tracking with Sentry (Optional)

For comprehensive error tracking and debugging.

### Step 1: Create Sentry Account

1. Go to [Sentry.io](https://sentry.io/)
2. Sign up for free account
3. Create new project:
   - Platform: **Next.js**
   - Project name: **aqiqah-rahmat**

### Step 2: Install Sentry SDK

```bash
npm install @sentry/nextjs
```

### Step 3: Initialize Sentry

```bash
npx @sentry/wizard@latest -i nextjs
```

This wizard will:
- Create `sentry.client.config.ts`
- Create `sentry.server.config.ts`
- Create `sentry.edge.config.ts`
- Update `next.config.ts`
- Add environment variables

### Step 4: Configure Sentry

**Add to `.env.local` and Vercel:**

```env
NEXT_PUBLIC_SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/7890123
SENTRY_ORG=your-org-name
SENTRY_PROJECT=aqiqah-rahmat
SENTRY_AUTH_TOKEN=your-auth-token
```

**Configure in Vercel Dashboard:**
1. Go to **Settings** → **Environment Variables**
2. Add all Sentry variables for **Production** environment

### Step 5: Test Error Tracking

Add a test error button (remove after testing):

```typescript
// app/page.tsx (temporary for testing)
<button onClick={() => { throw new Error('Test Sentry Error'); }}>
  Test Error Tracking
</button>
```

Click the button and verify error appears in Sentry dashboard.

### Step 6: Configure Alerts in Sentry

1. Go to Sentry Dashboard → **Alerts**
2. Click **Create Alert Rule**
3. Configure:
   - **When:** Issues are first seen
   - **Then:** Send notification to email/Slack
   - **For:** All issues or specific error types

**Recommended Alerts:**
- New error types detected
- Error frequency > 10 occurrences/hour
- Performance regression detected
- Release health degradation

### Step 7: Set Up Release Tracking

In your build process:

```bash
# package.json
{
  "scripts": {
    "build": "next build && sentry-cli releases propose-version"
  }
}
```

This allows tracking which deployment introduced errors.

---

## Custom Monitoring Dashboard

Create a simple monitoring dashboard for quick health checks.

### Health Check Endpoint

Already implemented: `/api/health/sheets`

**Test it:**
```bash
curl https://your-production-domain.com/api/health/sheets
```

**Expected Response:**
```json
{
  "status": "healthy",
  "sheetId": "1Abc123...",
  "timestamp": "2025-12-03T10:30:00.000Z"
}
```

### Create a Monitoring Page (Optional)

Create `/home/bajai/Projek/aqiqah-rahmat/app/admin/monitoring/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HealthStatus {
  sheets: 'healthy' | 'unhealthy';
  lastChecked: string;
}

export default function MonitoringPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health/sheets');
        const data = await res.json();
        setHealth({
          sheets: data.status,
          lastChecked: new Date().toISOString(),
        });
      } catch (error) {
        setHealth({
          sheets: 'unhealthy',
          lastChecked: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">System Health Monitor</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Google Sheets API</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Checking...</p>
            ) : (
              <>
                <p className={`text-2xl font-bold ${
                  health?.sheets === 'healthy' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {health?.sheets === 'healthy' ? '✅ Healthy' : '❌ Unhealthy'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Last checked: {health?.lastChecked ? new Date(health.lastChecked).toLocaleString() : 'Never'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Add more health checks as needed */}
      </div>
    </div>
  );
}
```

**Access:** `https://your-domain.com/admin/monitoring`

**Note:** Add authentication before deploying to protect this page.

---

## Alert Configuration

### Vercel Deployment Notifications

1. Go to **Settings** → **Notifications**
2. Enable notifications for:
   - [ ] **Deployment Success:** Get notified when deployments succeed
   - [ ] **Deployment Failed:** Get notified when deployments fail
   - [ ] **Domain Configuration:** Changes to domain settings

3. Configure notification channels:
   - **Email:** Your team email
   - **Slack:** (Optional) Connect Slack workspace
   - **Discord:** (Optional) Connect Discord webhook

### Google Sheets API Quota Alerts

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Google Sheets API**
3. Click on **Quotas**
4. Set up quota alerts:
   - Alert when usage > 80% of quota
   - Alert when quota exceeded

### Custom Alerting Script

Create a simple uptime monitor:

**Create:** `/home/bajai/Projek/aqiqah-rahmat/scripts/monitor-health.ts`

```typescript
#!/usr/bin/env tsx

/**
 * Simple health check script
 * Run via cron job: */5 * * * * tsx /path/to/monitor-health.ts
 */

const PRODUCTION_URL = 'https://your-production-domain.com';
const ALERT_EMAIL = 'your-email@example.com'; // Configure email alerting

async function checkHealth() {
  try {
    const response = await fetch(`${PRODUCTION_URL}/api/health/sheets`);
    const data = await response.json();

    if (data.status !== 'healthy') {
      console.error('❌ Health check failed:', data);
      // Send alert (implement email/Slack notification here)
      sendAlert('Google Sheets API is unhealthy');
    } else {
      console.log('✅ Health check passed');
    }
  } catch (error) {
    console.error('❌ Health check error:', error);
    sendAlert('Health check endpoint unreachable');
  }
}

function sendAlert(message: string) {
  // Implement your alerting logic
  // Options: Email, Slack webhook, Discord webhook, SMS
  console.error(`🚨 ALERT: ${message}`);
}

checkHealth();
```

**Set up cron job (Linux/Mac):**
```bash
crontab -e

# Add this line to check every 5 minutes
*/5 * * * * cd /home/bajai/Projek/aqiqah-rahmat && tsx scripts/monitor-health.ts
```

---

## Key Metrics to Monitor

### 1. Core Web Vitals

Monitor these in Vercel Analytics:

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| LCP | ≤ 2.5s | > 3.0s |
| FID | ≤ 100ms | > 200ms |
| CLS | ≤ 0.1 | > 0.2 |
| FCP | ≤ 1.8s | > 2.5s |
| TTFB | ≤ 600ms | > 1000ms |

**Action if threshold exceeded:**
- Investigate performance bottlenecks
- Check bundle size
- Review third-party scripts
- Optimize images

### 2. Error Rates

Track in Sentry or Vercel logs:

| Error Type | Target | Alert Threshold |
|------------|--------|-----------------|
| Client Errors | < 1% of requests | > 2% |
| Server Errors | < 0.1% of requests | > 0.5% |
| API Errors | < 0.5% of requests | > 1% |

**Action if threshold exceeded:**
- Review error logs
- Identify common patterns
- Deploy hotfix if critical

### 3. Traffic & Engagement

Track in Vercel Analytics:

| Metric | Target | Monitor For |
|--------|--------|-------------|
| Page Views | - | Sudden drops (> 50%) |
| Unique Visitors | - | Unusual spikes or drops |
| Bounce Rate | < 50% | > 70% |
| Session Duration | > 2 minutes | < 1 minute |
| RSVP Conversion | > 30% | < 20% |

**Action if anomaly detected:**
- Check for deployment issues
- Verify all features working
- Review user feedback

### 4. Google Sheets API

Monitor via health check endpoint:

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| API Response Time | < 2s | > 5s |
| API Success Rate | > 99% | < 95% |
| Quota Usage | < 80% | > 90% |

**Action if threshold exceeded:**
- Check API quota in Google Cloud Console
- Verify service account permissions
- Review recent error logs

### 5. Form Submission

Track RSVP submissions:

| Metric | Expected | Alert If |
|--------|----------|----------|
| Daily Submissions | Varies | Zero for 24 hours |
| Submission Success Rate | > 95% | < 90% |
| Average Submission Time | < 3s | > 10s |

**Monitor via:**
- Google Sheet row count
- Application logs
- User feedback

---

## Log Analysis

### Vercel Function Logs

**Access logs:**
```bash
vercel logs --prod --follow
```

Or in dashboard: **Deployments** → **Production** → **Logs**

**What to look for:**
- ❌ Error messages
- ⚠️ Warning messages
- ✅ Successful API calls
- 🔍 Unusual patterns

**Common log patterns:**

```bash
# Successful RSVP submission
✅ [POST /api/rsvp] 200 in 1234ms

# Error during submission
❌ [POST /api/rsvp] 500 in 234ms
Error: Unable to append row to sheet

# Google Sheets API quota
⚠️ [GET /api/health/sheets] Quota usage: 85%
```

### Filter Logs by Type

```bash
# Show only errors
vercel logs --prod | grep "Error"

# Show only specific endpoint
vercel logs --prod | grep "/api/rsvp"

# Show last 100 lines
vercel logs --prod --output-lines=100
```

### Download Logs for Analysis

```bash
# Download logs to file
vercel logs --prod --output-lines=1000 > production-logs.txt

# Analyze with grep/awk
grep "Error" production-logs.txt | wc -l  # Count errors
```

---

## Performance Monitoring

### Real User Monitoring (RUM)

Use Vercel Analytics to track real user performance.

**Key Reports:**
1. **Core Web Vitals over time:** Identify trends
2. **Performance by page:** Find slow pages
3. **Performance by device:** Desktop vs mobile
4. **Performance by geography:** Regional issues

### Synthetic Monitoring

Set up automated Lighthouse audits:

**Create:** `/home/bajai/Projek/aqiqah-rahmat/.github/workflows/lighthouse.yml`

```yaml
name: Lighthouse CI

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:  # Manual trigger

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**Create:** `/home/bajai/Projek/aqiqah-rahmat/lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "url": ["https://your-production-domain.com"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 1.0}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

This runs Lighthouse daily and alerts if scores drop.

### Bundle Size Monitoring

Track bundle size over time:

```bash
# After each deployment
npm run build

# Check bundle sizes
ls -lh .next/static/chunks/*.js
```

**Set up alerts:**
- If main bundle > 150KB gzipped
- If any route bundle > 50KB gzipped
- If total size increases > 20% from baseline

---

## Monitoring Dashboard Creation

### Recommended Tools

1. **Vercel Analytics Dashboard**
   - Built-in, no setup required
   - Free tier available
   - Real-time data

2. **Google Data Studio (Free)**
   - Connect to Google Sheets (RSVP data)
   - Create custom reports
   - Share with stakeholders

3. **Grafana + Prometheus (Advanced)**
   - Self-hosted monitoring
   - Highly customizable
   - Requires technical setup

### Simple Dashboard with Google Sheets

1. **Create a "Metrics" sheet** in your Google Sheet
2. **Add formulas** to track:
   - Total RSVPs
   - RSVPs by date
   - Attendance status breakdown
   - Average party size

3. **Create charts** in Google Sheets
4. **Share dashboard** with stakeholders

**Example Formulas:**

```
// Total RSVPs
=COUNTA(RSVPs!B2:B)

// Attending count
=COUNTIF(RSVPs!C2:C, "Hadir")

// Not attending count
=COUNTIF(RSVPs!C2:C, "Tidak Hadir")

// Total guests
=SUMIF(RSVPs!C2:C, "Hadir", RSVPs!D2:D)
```

---

## Alert Response Procedures

### Error Rate Spike

**When:** Error rate > 2% of requests

**Actions:**
1. Check Vercel logs for error details
2. Check Sentry for error stack traces
3. Identify affected feature
4. Determine if rollback needed
5. Deploy hotfix if possible
6. Notify stakeholders

### Performance Degradation

**When:** Core Web Vitals exceed thresholds

**Actions:**
1. Run Lighthouse audit to identify issues
2. Check bundle size changes
3. Review recent deployments
4. Check third-party service status (Google Maps API)
5. Optimize if needed or rollback

### API Quota Exceeded

**When:** Google Sheets API quota > 90%

**Actions:**
1. Check quota usage in Google Cloud Console
2. Identify unusual usage patterns
3. Implement caching if applicable
4. Consider upgrading quota
5. Notify stakeholders if service affected

### Zero Submissions for 24 Hours

**When:** No RSVP submissions in 24 hours

**Actions:**
1. Verify form is working (manual test)
2. Check Google Sheets API health
3. Review error logs
4. Check if deadline passed
5. Investigate potential UX issues

---

## Monitoring Checklist

### Daily
- [ ] Check Vercel deployment status
- [ ] Review error logs (if errors present)
- [ ] Verify Google Sheets API health
- [ ] Check for new Sentry errors (if configured)

### Weekly
- [ ] Review Vercel Analytics dashboard
- [ ] Check Core Web Vitals trends
- [ ] Review RSVP submission rate
- [ ] Check bundle size (if new deployment)
- [ ] Review quota usage

### Monthly
- [ ] Comprehensive performance audit
- [ ] Review all alerts and thresholds
- [ ] Update monitoring documentation
- [ ] Stakeholder report on metrics

---

## Additional Resources

- **Vercel Docs:** https://vercel.com/docs/concepts/analytics
- **Sentry Docs:** https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Google Cloud Monitoring:** https://cloud.google.com/monitoring/docs
- **Lighthouse CI:** https://github.com/GoogleChrome/lighthouse-ci

---

## Monitoring Setup Checklist

- [ ] Vercel Analytics enabled
- [ ] Analytics package installed (optional)
- [ ] Sentry configured (optional)
- [ ] Health check endpoint working
- [ ] Deployment notifications configured
- [ ] Key metrics defined
- [ ] Alert thresholds set
- [ ] Response procedures documented
- [ ] Team trained on monitoring tools
- [ ] Dashboard accessible to stakeholders

**Monitoring Complete!** Your application is now fully monitored.
