# Quick Test Guide - Phase 3 Runtime Error Handling

This is a quick reference for testing the Phase 3 implementation. For comprehensive testing, see `/scripts/test-runtime-errors.md`.

---

## Quick Test 1: Verify Normal Operation (Baseline)

**What to do**:
```bash
npm run dev
```

**Visit**: http://localhost:3000

**What you should see**:
- ✅ Hero section
- ✅ Event details
- ✅ RSVP form (visible and working)
- ✅ No error messages

**What to test**:
- Fill out and submit RSVP
- Check Google Sheet for new entry
- Verify edit link works

---

## Quick Test 2: Test Invalid Credentials

**What to do**:

1. Open `.env.local`
2. Change email to invalid:
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=invalid@example.com
   ```
3. Save and restart server: `npm run dev`
4. Visit: http://localhost:3000

**What you should see**:
- ✅ Hero section (still visible)
- ✅ Event details (still visible)
- ❌ RSVP form (HIDDEN)
- ✅ Yellow box with message: "Sistem RSVP tidak tersedia buat masa ini"

**Server logs should show**:
```
[Google Sheets Health Check] API unavailable: { code: 401 or 403 }
```

**Cleanup**:
1. Restore correct email in `.env.local`
2. Restart server

---

## Quick Test 3: Test Error Boundary

**What to do**:

1. Open `/components/client/rsvp-section.tsx`
2. Add this line at the start of the component:
   ```typescript
   export function RSVPSection({ deadlinePassed }: RSVPSectionProps) {
     throw new Error("Testing error boundary");  // ADD THIS LINE

     const [showConfirmation, setShowConfirmation] = useState(false);
     // ... rest of code
   }
   ```
3. Save and restart server
4. Visit: http://localhost:3000

**What you should see**:
- ✅ Full-page error UI
- ✅ Title: "Ralat Tidak Dijangka"
- ✅ User-friendly message in Malay
- ✅ "Muat Semula Halaman" button
- ✅ In dev mode: small gray box with error details at bottom

**Browser console should show**:
```
[Error Boundary] Caught an error: {
  error: "Testing error boundary",
  ...
}
```

**Cleanup**:
1. Remove the `throw new Error()` line
2. Restart server

---

## Quick Test 4: Test Health Check Caching

**What to do**:

1. Start with valid credentials
2. Start server: `npm run dev`
3. Visit: http://localhost:3000 (form should show)
4. Open `.env.local` and change to invalid email
5. **DO NOT restart server**
6. Refresh page immediately

**What you should see (first 2 minutes)**:
- ✅ Form still shows (using cached "healthy" result)
- ✅ No new API call in server logs

**What to do next**:
7. Wait 2 minutes
8. Refresh page again

**What you should see (after 2 minutes)**:
- ❌ Form now hidden (cache expired, new check failed)
- ✅ Unavailability message shown
- ✅ Server logs show new health check failure

**Cleanup**:
1. Restore valid credentials
2. Restart server

---

## Quick Verification Checklist

After running the tests, verify these work:

### ✅ Graceful Degradation
- [ ] Application never crashes
- [ ] Event details always visible
- [ ] Clear error messages in Malay
- [ ] No technical errors shown to users

### ✅ Health Check
- [ ] Form shows when API healthy
- [ ] Form hidden when API unhealthy
- [ ] Caching works (2-minute TTL)
- [ ] Timeout is 5 seconds max

### ✅ Error Boundary
- [ ] Catches component errors
- [ ] Shows user-friendly message
- [ ] Logs error details
- [ ] Provides recovery option (reload button)

### ✅ Security
- [ ] No credentials in logs
- [ ] No stack traces in production
- [ ] Error messages don't expose internals

---

## Common Issues and Fixes

### Issue: Form still shows after invalidating credentials

**Fix**:
- Wait 2 minutes for cache to expire, OR
- Restart server to clear cache

### Issue: Error boundary not catching error

**Fix**:
- Make sure you're throwing error during render (not in event handler)
- Check that error boundary is in layout.tsx
- Verify component is inside error boundary

### Issue: Can't see server logs

**Fix**:
- Check terminal where `npm run dev` is running
- Look for "[Google Sheets Health Check]" prefix
- Ensure you're looking at server logs, not browser console

---

## Expected Log Output

### Healthy API:
```
GET / 200 in 700ms (compile: 500ms, render: 200ms)
```
(No health check errors)

### Unhealthy API:
```
[Google Sheets Health Check] API unavailable: {
  message: 'Request failed with status code 403',
  code: 403,
  status: 403,
  timestamp: '2025-11-27T...'
}
GET / 200 in 5.5s (compile: 500ms, render: 5000ms)
```

### Error Boundary Triggered:
```
[Error Boundary] Caught an error: {
  error: 'Testing error boundary',
  stack: '...',
  componentStack: '...',
  timestamp: '2025-11-27T...'
}
```

---

## Test Results Template

Copy this to track your testing:

```
# Phase 3 Testing - [Your Name]
Date: _______________

## Test 1: Normal Operation
- [ ] Hero section visible
- [ ] Event details visible
- [ ] RSVP form visible and working
- [ ] Can submit RSVP successfully

## Test 2: Invalid Credentials
- [ ] Event details still visible
- [ ] RSVP form hidden
- [ ] Unavailability message shown in Malay
- [ ] Server logs show health check failure

## Test 3: Error Boundary
- [ ] Error UI displayed
- [ ] User-friendly message in Malay
- [ ] Reload button available
- [ ] Error logged to console

## Test 4: Caching
- [ ] Cached result used within 2 minutes
- [ ] Fresh check after cache expires
- [ ] Correct behavior in both cases

## Overall Assessment
- [ ] All tests passed
- [ ] Ready for production

Notes:
_____________________
_____________________
```

---

**For comprehensive testing, see**: `/home/ujai/Projek/Rahmat/majlis-rsvp/scripts/test-runtime-errors.md`

**For implementation details, see**: `/home/ujai/Projek/Rahmat/majlis-rsvp/PHASE-3-COMPLETE.md`
