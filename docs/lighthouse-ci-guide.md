# Lighthouse CI Guide

## Overview

Lighthouse CI automates performance, accessibility, SEO, and best practices audits for the Majlis Aqiqah RSVP application.

**Configuration File:** `.lighthouserc.json`
**Performance Budget:** Strict thresholds based on WCAG 2.1 AA and Core Web Vitals

---

## Performance Budget

### Lighthouse Categories

| Category | Minimum Score | Priority |
|----------|---------------|----------|
| Performance | 90/100 | Critical |
| Accessibility | 100/100 | Critical |
| Best Practices | 90/100 | High |
| SEO | 90/100 | High |

### Core Web Vitals

| Metric | Maximum Value | Description |
|--------|---------------|-------------|
| **FCP** (First Contentful Paint) | 2000ms | Time until first content renders |
| **LCP** (Largest Contentful Paint) | 2500ms | Time until largest content element renders |
| **TBT** (Total Blocking Time) | 300ms | Total time JS blocks main thread |
| **CLS** (Cumulative Layout Shift) | 0.1 | Visual stability - no unexpected layout shifts |
| **TTI** (Time to Interactive) | 3800ms | Time until page is fully interactive |
| **Speed Index** | 3400ms | How quickly content is visually displayed |

---

## Installation

### Install Lighthouse CI

```bash
npm install -D @lhci/cli
```

This will add `@lhci/cli` to your `devDependencies`.

---

## Usage

### 1. Start Production Build

Lighthouse CI requires a running production build:

```bash
# Build the application
npm run build

# Start production server
npm run start
```

The server should be running on `http://localhost:3000`.

### 2. Run Lighthouse CI

In a separate terminal (while the server is running):

```bash
npx lhci autorun
```

### What Happens:

1. **Collect:** Runs Lighthouse 3 times on `http://localhost:3000`
2. **Assert:** Checks metrics against thresholds in `.lighthouserc.json`
3. **Upload:** Uploads results to temporary public storage (24-hour retention)

---

## Understanding Results

### Success Output

If all assertions pass:

```
✅ Passed performance budget
   Performance: 92 (≥ 90)
   Accessibility: 100 (= 100)
   Best Practices: 95 (≥ 90)
   SEO: 92 (≥ 90)

✅ Passed Core Web Vitals
   FCP: 1450ms (≤ 2000ms)
   LCP: 1820ms (≤ 2500ms)
   TBT: 180ms (≤ 300ms)
   CLS: 0.05 (≤ 0.1)

Report uploaded to: https://storage.googleapis.com/...
```

### Failure Output

If any assertion fails:

```
❌ Failed performance budget

Categories:
  Performance: 85 (expected ≥ 90) ❌

Metrics:
  largest-contentful-paint: 3200ms (expected ≤ 2500ms) ❌
  total-blocking-time: 450ms (expected ≤ 300ms) ❌

Action Required:
1. Review Lighthouse report at URL above
2. Identify performance bottlenecks
3. Optimize and re-test
```

---

## Interpreting Lighthouse Reports

### Accessing Reports

After running `lhci autorun`, you'll get a URL like:
```
https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/...
```

Click this URL to view detailed HTML reports for each run.

### Key Sections to Review

#### 1. Performance
- **Opportunities:** Specific suggestions to improve load time
- **Diagnostics:** Issues that don't directly impact metrics but should be addressed
- **Passed Audits:** What you're doing well

**Common Issues:**
- Unoptimized images
- Render-blocking resources
- Unused JavaScript
- Large bundle sizes

#### 2. Accessibility
- **Violations:** WCAG failures (must fix for 100 score)
- **Passed Audits:** Accessible features implemented correctly

**Common Issues:**
- Missing alt text
- Color contrast too low
- Missing ARIA labels
- Improper heading hierarchy

#### 3. Best Practices
- **Security issues:** Mixed content, insecure requests
- **Browser compatibility:** Deprecated APIs
- **Trust and safety:** HTTPS usage, CSP headers

#### 4. SEO
- **Meta tags:** Title, description, viewport
- **Crawlability:** Robots.txt, canonical URLs
- **Mobile-friendliness:** Tap targets, font sizes

---

## Troubleshooting

### Issue: "Connection Refused"

**Problem:** Lighthouse can't connect to `http://localhost:3000`

**Solution:**
```bash
# Ensure server is running
npm run start

# Check it's accessible
curl http://localhost:3000
```

### Issue: "Port Already in Use"

**Problem:** Port 3000 is occupied

**Solution:**
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run start

# Update .lighthouserc.json URL to match
```

### Issue: Failing Assertions

**Problem:** Metrics don't meet budget

**Solutions by Metric:**

#### Performance < 90
- Reduce JavaScript bundle size
- Optimize images (WebP, compression)
- Implement code splitting
- Remove unused dependencies
- Enable caching headers

#### LCP > 2500ms
- Optimize largest image/content
- Use `priority` prop on hero image
- Preload critical resources
- Reduce server response time

#### TBT > 300ms
- Reduce JavaScript execution time
- Break up long tasks
- Defer non-critical scripts
- Use web workers for heavy computation

#### CLS > 0.1
- Set explicit width/height on images
- Reserve space for dynamic content
- Avoid inserting content above existing content
- Use CSS containment

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/lighthouse.yml`:

```yaml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build app
        run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          npm run start &
          sleep 5
          lhci autorun
```

### Vercel Integration

Lighthouse CI can run on Vercel preview deployments:

```bash
# In .lighthouserc.json, update URL
"url": ["https://your-preview-url.vercel.app"]

# Run in CI
lhci autorun
```

---

## Configuration Details

### .lighthouserc.json Breakdown

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,                    // Run 3 times, median result
      "url": ["http://localhost:3000"],     // URL to audit
      "settings": {
        "preset": "desktop",                 // Desktop mode (can use "mobile")
        "chromeFlags": "--no-sandbox --disable-gpu"
      }
    },
    "assert": {
      "assertions": {
        // Category scores (0-1 scale)
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1.0 }],

        // Specific metrics (milliseconds)
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],

        // "error" = build fails if not met
        // "warn" = warning only, doesn't fail build
      }
    },
    "upload": {
      "target": "temporary-public-storage"  // Free, 24-hour storage
      // Alternative: "filesystem" to save locally
    }
  }
}
```

### Customization

#### Test Mobile Performance

Change preset to mobile:
```json
"settings": {
  "preset": "mobile"
}
```

#### Relax Budget (Not Recommended)

If targets are too strict:
```json
"categories:performance": ["warn", { "minScore": 0.85 }]
// Changes from error to warning, allows lower score
```

#### Test Multiple Pages

```json
"url": [
  "http://localhost:3000",
  "http://localhost:3000/edit/test-token"
]
```

---

## Best Practices

### 1. Run on Every PR

Automate Lighthouse CI in GitHub Actions to catch regressions early.

### 2. Test Both Mobile and Desktop

Run separate audits:
```bash
# Mobile (default)
LHCI_PRESET=mobile lhci autorun

# Desktop
LHCI_PRESET=desktop lhci autorun
```

### 3. Save Reports Locally

For detailed analysis:
```json
"upload": {
  "target": "filesystem",
  "outputDir": "./lighthouse-reports"
}
```

### 4. Track Trends Over Time

- Save reports for each release
- Compare before/after major changes
- Set up dashboards (Lighthouse CI Server)

---

## Performance Monitoring Workflow

### Before Every Release:

1. **Build production version**
   ```bash
   npm run build
   npm run start
   ```

2. **Run Lighthouse CI**
   ```bash
   npx lhci autorun
   ```

3. **Review results**
   - All budgets passing?
   - Any new warnings?
   - Compare to previous release

4. **Fix issues** (if any)
   - Optimize images
   - Reduce bundle size
   - Fix accessibility violations

5. **Re-test**
   ```bash
   npx lhci autorun
   ```

6. **Deploy** when all checks pass

---

## Common Optimizations

Based on Lighthouse recommendations:

### Images
```bash
# Compress hero image
npx squoosh-cli --webp auto public/images/hero.jpeg

# Or use online tool: https://squoosh.app/
```

### JavaScript
```bash
# Analyze bundle
ANALYZE=true npm run build

# Look for:
# - Large dependencies to replace
# - Unused code to remove
# - Opportunities for dynamic imports
```

### Accessibility
```bash
# Install axe DevTools Chrome extension
# Scan page for violations
# Fix all critical and serious issues
```

---

## Resources

### Tools
- **Lighthouse CI:** https://github.com/GoogleChrome/lighthouse-ci
- **Lighthouse:** https://developers.google.com/web/tools/lighthouse
- **Web Vitals:** https://web.dev/vitals/

### Documentation
- **Core Web Vitals:** https://web.dev/vitals/
- **Performance Budgets:** https://web.dev/performance-budgets-101/
- **Accessibility:** https://web.dev/accessibility/

### Support
- **Lighthouse GitHub:** https://github.com/GoogleChrome/lighthouse/issues
- **Web.dev Community:** https://web.dev/community/

---

## Quick Reference

### Common Commands

```bash
# Install
npm install -D @lhci/cli

# Run (with server running on :3000)
npx lhci autorun

# Collect only (no assertions)
npx lhci collect

# Assert only (after collect)
npx lhci assert

# Upload only
npx lhci upload
```

### Budget Thresholds

| Metric | Budget | Type |
|--------|--------|------|
| Performance Score | ≥ 90 | Category |
| Accessibility Score | = 100 | Category |
| Best Practices | ≥ 90 | Category |
| SEO Score | ≥ 90 | Category |
| FCP | ≤ 2000ms | Metric |
| LCP | ≤ 2500ms | Metric |
| TBT | ≤ 300ms | Metric |
| CLS | ≤ 0.1 | Metric |
| TTI | ≤ 3800ms | Metric |
| Speed Index | ≤ 3400ms | Metric |

---

**Last Updated:** 2025-12-03
**Project:** Majlis Aqiqah RSVP
**Phase:** 7 - Polish & Optimization
