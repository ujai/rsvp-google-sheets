# Manual Testing Guide: Validation Script Testing

**Test ID**: Task 5.5
**Purpose**: Test validation helper script with various configuration scenarios
**Dependencies**: Task 4.1 (already completed)
**Estimated Time**: 1 hour
**Tester**: Manual testing required

---

## Test Overview

This test verifies that:
- Validation script (`npm run validate-sheets`) works correctly
- All 6 validation checks execute in sequence
- Script provides clear success/failure messages
- Failure messages are specific and helpful
- Script exits with correct exit codes (0 = success, 1 = failure)
- Test row is successfully appended to sheet
- Script catches all common configuration issues

---

## Prerequisites

Before starting this test:
- [ ] Working .env.local file with valid credentials
- [ ] Google Sheet set up and shared with service account
- [ ] Terminal access
- [ ] Text editor to modify .env.local
- [ ] Backup of working configuration

---

## Test Setup

### Backup Current Configuration

```bash
# Backup your working .env.local
cp .env.local .env.local.backup

# Verify the script exists
ls -la scripts/validate-credentials.ts

# Verify npm script is configured
npm run validate-sheets --help 2>&1 | head -5
```

---

## Test Procedure

### Test 1: Valid Credentials - All Checks Pass

**Objective**: Verify script passes all checks with valid configuration

**Steps**:

1. Ensure .env.local has valid credentials:
   ```bash
   cat .env.local | grep GOOGLE_
   # Should show all three variables with values
   ```

2. Run the validation script:
   ```bash
   npm run validate-sheets
   ```

3. Monitor the output for all 6 steps

**Verification Checklist**:

- [ ] **Step 1: Checking environment variables**
  - [ ] Shows ✅ for GOOGLE_SHEET_ID (with preview)
  - [ ] Shows ✅ for GOOGLE_SERVICE_ACCOUNT_EMAIL
  - [ ] Shows ✅ for GOOGLE_PRIVATE_KEY (with character count)

- [ ] **Step 2: Initializing Google Sheets API client**
  - [ ] Shows ✅ for API client initialization
  - [ ] No errors displayed

- [ ] **Step 3: Testing authentication**
  - [ ] Shows ✅ for authentication successful
  - [ ] Shows spreadsheet title (📄 Spreadsheet: "...")
  - [ ] Shows sheet ID (🆔 Sheet ID: ...)

- [ ] **Step 4: Checking for RSVPs sheet**
  - [ ] Shows ✅ for "RSVPs" sheet found

- [ ] **Step 5: Testing read access**
  - [ ] Shows ✅ for read access confirmed
  - [ ] Shows headers (📊 Headers: Timestamp, Nama, ...)

- [ ] **Step 6: Testing write access**
  - [ ] Shows ✅ for write access confirmed
  - [ ] Shows info message about test row appended
  - [ ] Shows timestamp (🕐 Timestamp: ...)

- [ ] **Final Summary**
  - [ ] Shows success banner with borders
  - [ ] Shows "✅ All validation checks passed!"
  - [ ] Shows message "Your Google Sheets setup is working correctly."
  - [ ] Shows "You can now run: npm run dev"

- [ ] **Exit Code**
  - [ ] Script exits with code 0 (check with `echo $?`)

- [ ] **Google Sheet Verification**
  - [ ] Open Google Sheet in browser
  - [ ] New test row exists at bottom
  - [ ] Row contains: [Timestamp] | [TEST] Validation Script | Tidak Hadir | (empty) | [TEST]

**Actual Output**:
```
[Paste script output here]
```

**Test Result**: [ ] PASS / [ ] FAIL

**Exit Code**: _______

---

### Test 2: Missing GOOGLE_SHEET_ID

**Objective**: Verify script fails at appropriate step when GOOGLE_SHEET_ID is missing

**Steps**:

1. Edit .env.local and comment out GOOGLE_SHEET_ID:
   ```bash
   # GOOGLE_SHEET_ID=your_sheet_id_here
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

2. Run the validation script:
   ```bash
   npm run validate-sheets
   ```

**Verification Checklist**:

- [ ] Script starts running
- [ ] **Step 1 fails** with ❌ Environment validation failed
- [ ] Error message shows resolution hint
- [ ] Error references docs/google-sheets-setup.md
- [ ] Script exits immediately (doesn't continue to Step 2)
- [ ] Exit code is 1 (check with `echo $?`)
- [ ] Failure message is specific and helpful

**Expected Failure Point**: Step 1

**Actual Output**:
```
[Paste script output here]
```

**Test Result**: [ ] PASS / [ ] FAIL

**Exit Code**: _______

---

### Test 3: Invalid Credentials (Wrong Service Account Email)

**Objective**: Verify script fails at authentication step with invalid credentials

**Steps**:

1. Restore .env.local from backup:
   ```bash
   cp .env.local.backup .env.local
   ```

2. Edit .env.local and change service account email to invalid value:
   ```bash
   GOOGLE_SHEET_ID=your_sheet_id_here
   GOOGLE_SERVICE_ACCOUNT_EMAIL=fake-account@invalid.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

3. Run the validation script:
   ```bash
   npm run validate-sheets
   ```

**Verification Checklist**:

- [ ] Step 1 passes (env vars loaded)
- [ ] Step 2 passes (API client initialized)
- [ ] **Step 3 fails** with ❌ Authentication failed
- [ ] Error shows reason (e.g., "Invalid credentials" or "Permission denied")
- [ ] Error provides resolution hint
- [ ] Script exits at Step 3 (doesn't continue)
- [ ] Exit code is 1

**Expected Failure Point**: Step 3

**Actual Output**:
```
[Paste script output here]
```

**Test Result**: [ ] PASS / [ ] FAIL

---

### Test 4: Sheet Not Shared with Service Account (403 Permission Denied)

**Objective**: Verify script fails with helpful message when sheet permissions are wrong

**Steps**:

1. Restore .env.local from backup:
   ```bash
   cp .env.local.backup .env.local
   ```

2. In Google Sheets, temporarily remove service account's access:
   - Open your Google Sheet
   - Click Share button
   - Find service account email
   - Click "Remove" to revoke access

3. Run the validation script:
   ```bash
   npm run validate-sheets
   ```

4. After test, restore access:
   - Share sheet with service account again (Editor permission)

**Verification Checklist**:

- [ ] Step 1 passes
- [ ] Step 2 passes
- [ ] **Step 3 fails** with ❌ Authentication failed
- [ ] Error shows "Reason: Permission denied" (403)
- [ ] Error shows resolution: "Share sheet with service account:"
- [ ] Error displays service account email
- [ ] Error mentions 'Editor' permission needed
- [ ] Script exits at Step 3
- [ ] Exit code is 1

**Expected Failure Point**: Step 3

**Actual Output**:
```
[Paste script output here]
```

**Test Result**: [ ] PASS / [ ] FAIL

**Note**: Remember to restore sheet access after this test!

---

### Test 5: Sheet Not Found (404 - Wrong GOOGLE_SHEET_ID)

**Objective**: Verify script detects non-existent sheet

**Steps**:

1. Restore .env.local from backup:
   ```bash
   cp .env.local.backup .env.local
   ```

2. Edit .env.local with fake sheet ID:
   ```bash
   GOOGLE_SHEET_ID=1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa  # Fake ID
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

3. Run the validation script:
   ```bash
   npm run validate-sheets
   ```

**Verification Checklist**:

- [ ] Step 1 passes
- [ ] Step 2 passes
- [ ] **Step 3 fails** with ❌ Authentication failed
- [ ] Error shows "Reason: Sheet not found" (404)
- [ ] Error provides resolution: "Verify GOOGLE_SHEET_ID is correct"
- [ ] Error mentions URL format for verification
- [ ] Script exits at Step 3
- [ ] Exit code is 1

**Expected Failure Point**: Step 3

**Actual Output**:
```
[Paste script output here]
```

**Test Result**: [ ] PASS / [ ] FAIL

---

### Test 6: Missing RSVPs Sheet (Sheet Exists but Not Initialized)

**Objective**: Verify script warns about missing RSVPs sheet

**Steps**:

1. Create a temporary test Google Sheet:
   - Go to https://sheets.google.com
   - Create new sheet named "Test - No RSVPs Tab"
   - Do NOT rename the tab to "RSVPs" (keep it as "Sheet1")
   - Share with service account (Editor permission)
   - Copy the sheet ID

2. Edit .env.local with this test sheet ID:
   ```bash
   GOOGLE_SHEET_ID=[test-sheet-id-without-rsvps-tab]
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

3. Run the validation script:
   ```bash
   npm run validate-sheets
   ```

4. After test, restore original sheet ID

**Verification Checklist**:

- [ ] Step 1 passes
- [ ] Step 2 passes
- [ ] Step 3 passes (sheet exists and accessible)
- [ ] **Step 4 shows warning** with ⚠️ "RSVPs" sheet not found
- [ ] Warning provides action: "Run: npm run init-sheet"
- [ ] Script **fails** (exit code 1)
- [ ] Validation is incomplete (stops before Step 5)

**Expected Failure Point**: Step 4

**Actual Output**:
```
[Paste script output here]
```

**Test Result**: [ ] PASS / [ ] FAIL

**Cleanup**: Delete test sheet after this test

---

### Test 7: Read-Only Permissions (Write Access Fails)

**Objective**: Verify script detects insufficient permissions for write operations

**Steps**:

1. Restore .env.local from backup:
   ```bash
   cp .env.local.backup .env.local
   ```

2. In Google Sheets, change service account permission to "Viewer":
   - Open your Google Sheet
   - Click Share button
   - Find service account email
   - Change permission from "Editor" to "Viewer"
   - Click "Save"

3. Run the validation script:
   ```bash
   npm run validate-sheets
   ```

4. After test, restore Editor permission

**Verification Checklist**:

- [ ] Step 1 passes
- [ ] Step 2 passes
- [ ] Step 3 passes (can still authenticate and read metadata)
- [ ] Step 4 passes (can read sheet list)
- [ ] Step 5 passes (can read data)
- [ ] **Step 6 fails** with ❌ Write access failed
- [ ] Error shows "Reason: Permission denied" (403)
- [ ] Error mentions 'Editor' permission needed
- [ ] Error clarifies "(Not 'Viewer' or 'Commenter')"
- [ ] Script exits at Step 6
- [ ] Exit code is 1

**Expected Failure Point**: Step 6

**Actual Output**:
```
[Paste script output here]
```

**Test Result**: [ ] PASS / [ ] FAIL

**Note**: Remember to restore Editor permission after this test!

---

### Test 8: Verify Test Row Appended Successfully

**Objective**: Confirm that successful validation appends a test row to the sheet

**Steps**:

1. Restore .env.local from backup:
   ```bash
   cp .env.local.backup .env.local
   ```

2. Note current number of rows in Google Sheet

3. Run the validation script:
   ```bash
   npm run validate-sheets
   ```

4. Open Google Sheet in browser

**Verification Checklist**:

- [ ] All 6 validation steps pass
- [ ] New row appears at bottom of sheet
- [ ] Row contains timestamp in Column A
- [ ] Row contains "[TEST] Validation Script" in Column B (Nama)
- [ ] Row contains "Tidak Hadir" in Column C (Status)
- [ ] Column D (Bilangan Orang) is empty
- [ ] Row contains "[TEST]" in Column E (Edit Link)
- [ ] Timestamp matches the time shown in script output

**Google Sheet Data** (copy the test row):
```
[Timestamp] | [Name] | [Status] | [Number] | [Edit Link]
```

**Test Result**: [ ] PASS / [ ] FAIL

---

### Test 9: Exit Codes Verification

**Objective**: Verify script returns correct exit codes

**Steps**:

1. Run script with valid configuration:
   ```bash
   npm run validate-sheets
   echo "Exit code: $?"
   ```

2. Run script with invalid configuration (missing variable):
   ```bash
   # Temporarily remove GOOGLE_SHEET_ID
   npm run validate-sheets
   echo "Exit code: $?"
   # Restore configuration
   ```

**Verification Checklist**:

- [ ] Valid configuration: Exit code = 0
- [ ] Invalid configuration: Exit code = 1
- [ ] Exit codes are consistent across multiple runs

**Test Result**: [ ] PASS / [ ] FAIL

---

## Test Results Summary

### Overall Pass Criteria

All of the following must be true for overall test to PASS:

- [ ] Test 1: Valid credentials - All 6 checks pass - PASS
- [ ] Test 2: Missing GOOGLE_SHEET_ID - Fails at Step 1 - PASS
- [ ] Test 3: Invalid credentials - Fails at Step 3 - PASS
- [ ] Test 4: Permission denied - Fails at Step 3 with helpful message - PASS
- [ ] Test 5: Sheet not found - Fails at Step 3 with helpful message - PASS
- [ ] Test 6: Missing RSVPs sheet - Warns at Step 4 - PASS
- [ ] Test 7: Read-only permissions - Fails at Step 6 - PASS
- [ ] Test 8: Test row appended successfully - PASS
- [ ] Test 9: Exit codes correct - PASS

### Script Quality Assessment

Rate the validation script (1-5, 5 = excellent):

- [ ] Clarity of output: 1 / 2 / 3 / 4 / 5
- [ ] Helpfulness of error messages: 1 / 2 / 3 / 4 / 5
- [ ] Specificity of failures: 1 / 2 / 3 / 4 / 5
- [ ] Overall usefulness: 1 / 2 / 3 / 4 / 5

### Issues Found

Document any issues with the validation script:

**Issue 1**:
- Test number: _______
- Problem: _______________________________
- Suggested improvement: _______________________________

**Issue 2**:
- Test number: _______
- Problem: _______________________________
- Suggested improvement: _______________________________

---

## Cleanup

After completing all tests:

1. Restore original configuration:
   ```bash
   cp .env.local.backup .env.local
   ```

2. Restore Google Sheet permissions (if changed):
   - Ensure service account has Editor permission

3. Delete temporary test sheets (if created)

4. Optional: Remove test rows from your Google Sheet:
   - Open sheet in browser
   - Delete rows with "[TEST] Validation Script"

5. Verify application works:
   ```bash
   npm run dev
   # Should start successfully
   ```

6. Remove backup:
   ```bash
   rm .env.local.backup
   ```

---

## Improvement Recommendations

Based on test results, document any recommended improvements to the validation script:

### Critical Issues
1. _______________________________
2. _______________________________

### Minor Improvements
1. _______________________________
2. _______________________________

### Additional Suggestions
_________________________________________________________________
_________________________________________________________________

---

## Test Completion Checklist

- [ ] Backup of .env.local created
- [ ] All 9 test cases completed
- [ ] Script outputs captured for each test
- [ ] Pass/Fail recorded for each test
- [ ] Exit codes verified
- [ ] Test rows verified in Google Sheet
- [ ] Quality assessment completed
- [ ] Issues documented
- [ ] Original configuration restored
- [ ] Google Sheet permissions restored
- [ ] Test sheets deleted
- [ ] Application verified working
- [ ] Improvement recommendations documented

---

**Overall Test Status**: [ ] PASS / [ ] FAIL

**Tester Name**: _________________

**Test Date**: _________________

**Average Script Quality Rating**: _____ / 5

**Most Helpful Feature**: _______________________________

**Least Helpful Feature**: _______________________________

**Notes**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
