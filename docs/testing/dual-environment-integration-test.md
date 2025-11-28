# Manual Testing Guide: Dual Environment Setup Integration Test

**Test ID**: Task 5.2
**Purpose**: Verify that development and production environments remain completely isolated
**Dependencies**: Task 2.3, all Phase 2 tasks (already completed)
**Estimated Time**: 1 hour
**Tester**: Manual testing required

---

## Test Overview

This test verifies that:
- Development and production Google Sheets are completely separate
- Data written in development appears only in the dev sheet
- Data written in production appears only in the prod sheet
- Edit links work correctly for each environment
- No cross-environment data leakage occurs

---

## Prerequisites

Before starting this test, ensure you have:
- [ ] Completed Google Sheets setup for development (from `docs/google-sheets-setup.md`)
- [ ] Access to Google Cloud Console
- [ ] Two separate Google accounts or ability to create two sheets in one account
- [ ] Text editor for modifying `.env.local`
- [ ] Terminal access

---

## Test Setup

### Step 1: Create Development Google Sheet

1. Go to Google Sheets: https://sheets.google.com
2. Create a new spreadsheet
3. Rename it to "Majlis RSVP - Development (Test)"
4. Rename the first tab to "RSVPs" (case-sensitive)
5. Share the sheet with your service account email (Editor permission)
6. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
7. Save this ID as **DEV_SHEET_ID** for later use

### Step 2: Create Production Google Sheet

1. Go to Google Sheets: https://sheets.google.com
2. Create another new spreadsheet
3. Rename it to "Majlis RSVP - Production (Test)"
4. Rename the first tab to "RSVPs" (case-sensitive)
5. Share the sheet with your service account email (Editor permission)
6. Copy the Sheet ID from the URL
7. Save this ID as **PROD_SHEET_ID** for later use

### Step 3: Initialize Both Sheets

Initialize development sheet:
```bash
# Set development sheet ID in .env.local
GOOGLE_SHEET_ID=[DEV_SHEET_ID]

# Initialize the sheet
npm run init-sheet
```

Initialize production sheet:
```bash
# Set production sheet ID in .env.local
GOOGLE_SHEET_ID=[PROD_SHEET_ID]

# Initialize the sheet
npm run init-sheet
```

After initialization, both sheets should have headers in row 1:
- Column A: Timestamp
- Column B: Nama
- Column C: Status Kehadiran
- Column D: Bilangan Orang
- Column E: Edit Link

---

## Test Procedure

### Test Case 1: Development Environment RSVP Submission

**Objective**: Verify data is written to development sheet only

**Steps**:

1. Configure development environment:
   ```bash
   # Edit .env.local
   GOOGLE_SHEET_ID=[DEV_SHEET_ID]
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open browser and navigate to `http://localhost:3000`

4. Submit a test RSVP with the following data:
   - Name: "Test Dev User 1"
   - Attendance: "Hadir"
   - Number of people: "2"

5. Click Submit

6. Verify in Development Google Sheet:
   - [ ] New row appears in "Majlis RSVP - Development (Test)"
   - [ ] Row contains: Timestamp, "Test Dev User 1", "Hadir", "2", Edit Link
   - [ ] Edit link is populated (should start with `http://localhost:3000/edit/`)

7. Verify in Production Google Sheet:
   - [ ] NO new rows appear in "Majlis RSVP - Production (Test)"
   - [ ] Only the header row exists (no data rows)

**Expected Result**:
- ✅ Data appears ONLY in development sheet
- ✅ Production sheet remains empty (headers only)
- ✅ Edit link format is correct for development

**If Failed**:
- Check GOOGLE_SHEET_ID in .env.local matches DEV_SHEET_ID
- Verify both sheets are shared with service account
- Check browser console for errors

---

### Test Case 2: Production Environment RSVP Submission

**Objective**: Verify data is written to production sheet only and development sheet is unaffected

**Steps**:

1. Stop the development server (Ctrl+C)

2. Configure production environment:
   ```bash
   # Edit .env.local to simulate production
   GOOGLE_SHEET_ID=[PROD_SHEET_ID]
   NEXT_PUBLIC_APP_URL=https://example.com  # Simulating production URL
   ```

3. Restart the development server:
   ```bash
   npm run dev
   ```

4. Open browser and navigate to `http://localhost:3000`

5. Submit a test RSVP with the following data:
   - Name: "Test Prod User 1"
   - Attendance: "Hadir"
   - Number of people: "3"

6. Click Submit

7. Verify in Production Google Sheet:
   - [ ] New row appears in "Majlis RSVP - Production (Test)"
   - [ ] Row contains: Timestamp, "Test Prod User 1", "Hadir", "3", Edit Link
   - [ ] Edit link is populated (should start with `https://example.com/edit/`)

8. Verify in Development Google Sheet:
   - [ ] Still contains only 1 data row from Test Case 1
   - [ ] NO new rows appear
   - [ ] Data from "Test Dev User 1" is unchanged

**Expected Result**:
- ✅ Data appears ONLY in production sheet
- ✅ Development sheet unchanged (still has 1 row from Test Case 1)
- ✅ Edit link format reflects production URL

**If Failed**:
- Check GOOGLE_SHEET_ID in .env.local matches PROD_SHEET_ID
- Verify NEXT_PUBLIC_APP_URL is set correctly
- Check for errors in server logs

---

### Test Case 3: Edit Link Validation - Development Environment

**Objective**: Verify edit links work correctly for development environment

**Steps**:

1. Configure development environment:
   ```bash
   # Edit .env.local
   GOOGLE_SHEET_ID=[DEV_SHEET_ID]
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. Restart development server:
   ```bash
   npm run dev
   ```

3. Open "Majlis RSVP - Development (Test)" Google Sheet

4. Copy the Edit Link from the first data row (Column E)

5. Paste the edit link in browser and navigate to it

6. Verify the edit page:
   - [ ] Page loads successfully
   - [ ] Form is pre-filled with "Test Dev User 1" data
   - [ ] Can modify the data (e.g., change attendance to "Tidak Hadir")

7. Submit the update

8. Verify in Development Google Sheet:
   - [ ] Row is updated with new values
   - [ ] Timestamp is updated

9. Verify in Production Google Sheet:
   - [ ] No changes occur
   - [ ] Still has only 1 row from Test Case 2

**Expected Result**:
- ✅ Edit link works for development environment
- ✅ Updates are written to development sheet only
- ✅ Production sheet unaffected

---

### Test Case 4: Edit Link Validation - Production Environment

**Objective**: Verify edit links work correctly for production environment

**Steps**:

1. Configure production environment:
   ```bash
   # Edit .env.local
   GOOGLE_SHEET_ID=[PROD_SHEET_ID]
   NEXT_PUBLIC_APP_URL=https://example.com
   ```

2. Restart development server

3. Open "Majlis RSVP - Production (Test)" Google Sheet

4. Copy the Edit Link from the first data row (Column E)

5. Note: The link will have `https://example.com` which doesn't exist. Manually replace with `http://localhost:3000` to simulate accessing production edit link locally

6. Navigate to the modified link

7. Verify the edit page:
   - [ ] Page loads successfully
   - [ ] Form is pre-filled with "Test Prod User 1" data
   - [ ] Can modify the data

8. Submit the update

9. Verify in Production Google Sheet:
   - [ ] Row is updated with new values
   - [ ] Timestamp is updated

10. Verify in Development Google Sheet:
    - [ ] No changes occur
    - [ ] Still has 1 row with updated data from Test Case 3

**Expected Result**:
- ✅ Edit link works for production environment
- ✅ Updates are written to production sheet only
- ✅ Development sheet unaffected

---

### Test Case 5: Multiple Submissions - No Cross-Contamination

**Objective**: Verify multiple submissions maintain environment isolation

**Steps**:

1. Configure development environment and submit 2 more RSVPs:
   - "Test Dev User 2"
   - "Test Dev User 3"

2. Configure production environment and submit 2 more RSVPs:
   - "Test Prod User 2"
   - "Test Prod User 3"

3. Verify Development Sheet:
   - [ ] Contains 3 data rows total (Test Dev User 1, 2, 3)
   - [ ] All rows have localhost edit links
   - [ ] No production user data

4. Verify Production Sheet:
   - [ ] Contains 3 data rows total (Test Prod User 1, 2, 3)
   - [ ] All rows have example.com edit links
   - [ ] No development user data

**Expected Result**:
- ✅ Each environment has exactly 3 rows
- ✅ No mixing of data between environments
- ✅ Edit links are environment-appropriate

---

## Test Results Summary

### Pass Criteria

All of the following must be true for the test to pass:

- [ ] Development RSVP submissions appear ONLY in development sheet
- [ ] Production RSVP submissions appear ONLY in production sheet
- [ ] Edit links contain correct base URL for each environment
- [ ] Edit functionality works for both environments
- [ ] Updates to one environment do not affect the other
- [ ] Multiple submissions maintain complete isolation
- [ ] No data leakage between environments

### Fail Criteria

If ANY of the following occur, the test fails:

- [ ] Data from development appears in production sheet
- [ ] Data from production appears in development sheet
- [ ] Edit links have incorrect base URLs
- [ ] Edit links from one environment modify the other environment's sheet
- [ ] Any cross-environment data contamination

---

## Cleanup

After completing the test:

1. Delete test sheets (optional):
   - "Majlis RSVP - Development (Test)"
   - "Majlis RSVP - Production (Test)"

2. Or clear all test data from both sheets:
   - Delete all rows except headers (row 1)

3. Restore .env.local to your actual development configuration:
   ```bash
   GOOGLE_SHEET_ID=[your-actual-dev-sheet-id]
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

---

## Troubleshooting

### Issue: Data appears in both sheets

**Cause**: Using the same GOOGLE_SHEET_ID for both tests
**Solution**: Verify .env.local has correct sheet ID before each test case

### Issue: Edit links don't work

**Cause**: Edit token mismatch or sheet ID mismatch
**Solution**: Ensure GOOGLE_SHEET_ID matches the sheet you're trying to edit

### Issue: Permission denied errors

**Cause**: Sheet not shared with service account
**Solution**: Share both test sheets with service account email (Editor permission)

---

## Test Completion Checklist

- [ ] Both test sheets created and initialized
- [ ] Test Case 1 completed and passed
- [ ] Test Case 2 completed and passed
- [ ] Test Case 3 completed and passed
- [ ] Test Case 4 completed and passed
- [ ] Test Case 5 completed and passed
- [ ] All pass criteria met
- [ ] No fail criteria occurred
- [ ] Test results documented
- [ ] Cleanup completed

---

**Test Status**: [ ] PASS / [ ] FAIL

**Tester Name**: _________________

**Test Date**: _________________

**Notes**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
