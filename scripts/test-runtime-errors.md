# Runtime Error Testing Guide

This guide provides step-by-step instructions for testing all runtime error scenarios to verify graceful degradation is working correctly.

## Prerequisites

- Application is set up with valid Google Sheets credentials
- Development server is running: `npm run dev`
- Access to `.env.local` file for testing configuration changes

## Test Scenarios

### Test 1: Valid Credentials (Baseline)

**Objective**: Verify normal operation when API is healthy

**Steps**:
1. Ensure `.env.local` has valid credentials
2. Start development server: `npm run dev`
3. Navigate to http://localhost:3000
4. Observe the page

**Expected Results**:
- ✅ Page loads without errors
- ✅ Hero section visible
- ✅ Event details visible
- ✅ RSVP form visible and functional
- ✅ No error messages displayed
- ✅ Can submit RSVP successfully
- ✅ Data appears in Google Sheet

**Verification**:
```bash
# Check server logs for any errors
# Should see no error messages
```

---

### Test 2: Invalid Credentials (Authentication Failure)

**Objective**: Verify graceful degradation when credentials are invalid

**Steps**:
1. Open `.env.local`
2. Modify `GOOGLE_SERVICE_ACCOUNT_EMAIL` to invalid value:
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=invalid@example.com
   ```
3. Save file
4. Restart development server: `npm run dev`
5. Navigate to http://localhost:3000
6. Observe the page

**Expected Results**:
- ✅ Application starts successfully (no startup crash)
- ✅ Hero section visible
- ✅ Event details visible
- ✅ RSVP form is HIDDEN
- ✅ Unavailability message displayed in Malay
- ✅ Message suggests contacting organizer
- ✅ No technical error details exposed to user
- ✅ Server logs show health check failure with error details

**Verification**:
```bash
# Check server logs
# Should see: "[Google Sheets Health Check] API unavailable:"
# With error code 401 or 403
```

**Cleanup**:
1. Restore valid `GOOGLE_SERVICE_ACCOUNT_EMAIL` in `.env.local`
2. Restart server

---

### Test 3: Sheet Not Found (404 Error)

**Objective**: Verify graceful degradation when sheet ID is invalid

**Steps**:
1. Open `.env.local`
2. Modify `GOOGLE_SHEET_ID` to invalid value:
   ```env
   GOOGLE_SHEET_ID=invalid_sheet_id_that_does_not_exist
   ```
3. Save file
4. Restart development server: `npm run dev`
5. Navigate to http://localhost:3000
6. Observe the page

**Expected Results**:
- ✅ Application starts successfully (no startup crash)
- ✅ Hero section visible
- ✅ Event details visible
- ✅ RSVP form is HIDDEN
- ✅ Unavailability message displayed
- ✅ No crash or stack trace shown to user
- ✅ Server logs show 404 error

**Verification**:
```bash
# Check server logs
# Should see: "[Google Sheets Health Check] API unavailable:"
# With error code 404
```

**Cleanup**:
1. Restore valid `GOOGLE_SHEET_ID` in `.env.local`
2. Restart server

---

### Test 4: Permission Denied (403 Error)

**Objective**: Verify graceful degradation when sheet is not shared with service account

**Steps**:
1. Go to your Google Sheet
2. Remove sharing permissions for the service account
3. Wait a few minutes for changes to propagate
4. Navigate to http://localhost:3000
5. Observe the page

**Expected Results**:
- ✅ Application starts successfully
- ✅ Hero section visible
- ✅ Event details visible
- ✅ RSVP form is HIDDEN
- ✅ Unavailability message displayed
- ✅ Server logs show 403 permission error

**Verification**:
```bash
# Check server logs
# Should see: "[Google Sheets Health Check] API unavailable:"
# With error code 403
```

**Cleanup**:
1. Re-share Google Sheet with service account email (Editor permissions)
2. Wait a few minutes
3. Refresh page - form should reappear after cache expires (2 minutes)

---

### Test 5: Network Timeout

**Objective**: Verify timeout handling

**Note**: This test is harder to simulate without network tools. The health check has a 5-second timeout built-in.

**Steps**:
1. If you have network debugging tools (like Charles Proxy), set up a delay
2. Alternatively, temporarily modify the health check timeout in `/lib/google-sheets-health.ts`:
   ```typescript
   timeout: 100, // Very short timeout to force failure
   ```
3. Restart server and navigate to http://localhost:3000

**Expected Results**:
- ✅ Page loads within reasonable time (not hanging)
- ✅ Hero section visible
- ✅ Event details visible
- ✅ RSVP form is HIDDEN after timeout
- ✅ Unavailability message displayed
- ✅ Server logs show timeout error

**Cleanup**:
1. Restore timeout to 5000ms
2. Restart server

---

### Test 6: API Quota Exceeded (429 Error)

**Objective**: Verify handling of quota exceeded errors

**Note**: This is difficult to test without actually exceeding quota limits (100 requests per 100 seconds)

**Manual Simulation**:
1. Temporarily modify `/lib/google-sheets-health.ts` to throw a quota error:
   ```typescript
   export async function checkGoogleSheetsHealth(): Promise<boolean> {
     // Simulate quota exceeded for testing
     const error: any = new Error('Quota exceeded');
     error.code = 429;
     console.error("[Google Sheets Health Check] API unavailable:", {
       message: error.message,
       code: error.code,
       status: error.status,
       timestamp: new Date().toISOString(),
     });
     return false;
   }
   ```
2. Restart server and navigate to http://localhost:3000

**Expected Results**:
- ✅ Application continues to function
- ✅ Event details visible
- ✅ RSVP form is HIDDEN
- ✅ Unavailability message displayed
- ✅ Server logs show 429 quota error

**Cleanup**:
1. Restore original health check function
2. Restart server

---

### Test 7: Health Check Caching

**Objective**: Verify health check results are cached for 2 minutes

**Steps**:
1. Ensure valid credentials in `.env.local`
2. Start server and load page - form should show
3. Open `.env.local` and change to invalid credentials
4. DO NOT restart server
5. Refresh page immediately
6. Observe the page

**Expected Results (First 2 minutes)**:
- ✅ Form still shows (cached healthy result)
- ✅ No API call made (check server logs)

**Steps (continued)**:
7. Wait 2 minutes
8. Refresh page again

**Expected Results (After 2 minutes)**:
- ✅ Health check runs again
- ✅ Detects invalid credentials
- ✅ Form is now HIDDEN
- ✅ Unavailability message shown

**Cleanup**:
1. Restore valid credentials
2. Restart server

---

### Test 8: Error Boundary - Component Crash

**Objective**: Verify error boundary catches unexpected component errors

**Steps**:
1. Temporarily modify a component to throw an error (e.g., in `RSVPSection`):
   ```typescript
   export function RSVPSection({ deadlinePassed }: RSVPSectionProps) {
     // Force an error for testing
     throw new Error("Test error boundary");

     // ... rest of component
   }
   ```
2. Restart server and navigate to http://localhost:3000

**Expected Results**:
- ✅ Application doesn't crash
- ✅ Error boundary catches the error
- ✅ User-friendly error message displayed in Malay
- ✅ "Ralat Tidak Dijangka" (Unexpected Error) shown
- ✅ Reload button available
- ✅ No technical stack trace shown to user (only in development)
- ✅ Error logged to console

**Verification**:
```bash
# Check browser console
# Should see: "[Error Boundary] Caught an error:"
```

**Cleanup**:
1. Remove the test error throw
2. Restart server

---

### Test 9: Multiple Rapid Page Loads (Cache Effectiveness)

**Objective**: Verify caching reduces API calls

**Steps**:
1. Ensure valid credentials
2. Start server
3. Load page http://localhost:3000
4. Refresh page 5 times rapidly
5. Check server logs

**Expected Results**:
- ✅ Only ONE health check API call made
- ✅ Subsequent loads use cached result
- ✅ Page loads quickly (no repeated API calls)
- ✅ Form shows on all loads

**Verification**:
```bash
# Check server logs
# Should see only ONE health check, not 5
```

---

### Test 10: Form Submission with API Failure Mid-Session

**Objective**: Verify form submission errors are handled gracefully

**Steps**:
1. Start with valid credentials
2. Load page - form should show
3. Fill out RSVP form but DON'T submit yet
4. Change credentials in `.env.local` to invalid
5. Restart server
6. Now submit the form

**Expected Results**:
- ✅ Form submission fails (expected)
- ✅ Error message shown to user via toast
- ✅ No application crash
- ✅ User can try again
- ✅ Error logged server-side

---

## Acceptance Criteria Verification

After completing all tests, verify these acceptance criteria:

### AC-16: Runtime errors caught and logged
- ✅ All API errors logged server-side
- ✅ Logs include error code, message, timestamp
- ✅ No sensitive credentials in logs

### AC-17: No application crashes
- ✅ Application continues running in all error scenarios
- ✅ No startup failures due to runtime API errors
- ✅ Error boundary catches unexpected errors

### AC-18: Event details always visible
- ✅ Hero section shows in all error scenarios
- ✅ Event details shows in all error scenarios
- ✅ Footer shows in all error scenarios

### AC-19: RSVP form hidden when API unavailable
- ✅ Form hidden on invalid credentials
- ✅ Form hidden on 404 sheet not found
- ✅ Form hidden on 403 permission denied
- ✅ Form hidden on timeout

### AC-20: User-friendly message when unavailable
- ✅ Message in Malay language
- ✅ Clear explanation of issue
- ✅ Suggests contacting organizer
- ✅ Apologizes for inconvenience

### AC-21: Different error messages for different failure types
- ✅ Health check logs different error codes (401, 403, 404, 429, timeout)
- ✅ User sees consistent unavailability message (internal differentiation)

### AC-22: No credentials exposed
- ✅ Error messages don't show credentials
- ✅ Logs don't show private keys
- ✅ User-facing errors don't show technical details
- ✅ Stack traces only in development, not production

---

## Quick Test Script

For rapid testing, you can run this sequence:

```bash
# Test 1: Valid (baseline)
npm run dev
# Visit http://localhost:3000 - form should show

# Test 2: Invalid email
# Edit .env.local: GOOGLE_SERVICE_ACCOUNT_EMAIL=invalid@example.com
# Restart server
# Visit http://localhost:3000 - unavailability message should show

# Test 3: Invalid sheet
# Edit .env.local: GOOGLE_SHEET_ID=invalid_id
# Restart server
# Visit http://localhost:3000 - unavailability message should show

# Test 8: Error boundary
# Edit components/client/rsvp-section.tsx - add throw new Error()
# Restart server
# Visit http://localhost:3000 - error boundary UI should show

# Restore all changes
# Restart server
# Visit http://localhost:3000 - form should show again
```

---

## Notes

- Always check server logs during testing to verify errors are being logged
- Use browser DevTools console to see client-side errors
- Health check cache is 2 minutes - wait for cache to expire or restart server
- Production mode may hide some error details that are visible in development
- Test in both development and production build if possible

---

## Troubleshooting

**Form still shows after making credentials invalid**:
- Wait 2 minutes for cache to expire, or restart server
- Check that you saved `.env.local` changes
- Verify server picked up the changes (restart if needed)

**Can't see error logs**:
- Check terminal where server is running
- Look for "[Google Sheets Health Check]" prefix
- Ensure you're looking at server logs, not browser console

**Error boundary not catching errors**:
- Error boundaries only catch rendering errors
- They don't catch errors in event handlers or async code
- Make sure error is thrown during render, not in a click handler

---

**Testing Completed**: Mark all test scenarios as ✅ when verified
**Date Tested**: _______________
**Tested By**: _______________
