# Manual Testing Guide: Error Message Validation

**Test ID**: Task 5.4
**Purpose**: Verify all error messages are clear, actionable, and reference correct documentation
**Dependencies**: Task 1.1, Task 1.3 (already completed)
**Estimated Time**: 1 hour
**Tester**: Manual testing required

---

## Test Overview

This test verifies that:
- Error messages clearly identify which variables are missing or invalid
- Error messages provide actionable 3-step resolution path
- Error messages reference correct documentation paths
- Error messages are formatted with visual borders for readability
- Following error message instructions resolves the issue
- Different types of errors produce appropriate messages

---

## Prerequisites

Before starting this test:
- [ ] Working .env.local file with valid credentials (backup this file!)
- [ ] Text editor to modify .env.local
- [ ] Terminal access
- [ ] Familiarity with the application's environment variables

---

## Test Setup

### Backup Current Configuration

```bash
# Backup your working .env.local
cp .env.local .env.local.backup

# Verify backup
ls -la .env.local*
```

---

## Test Procedure

### Test 1: Missing GOOGLE_SHEET_ID

**Objective**: Verify error message when GOOGLE_SHEET_ID is missing

**Steps**:

1. Edit .env.local and comment out or remove GOOGLE_SHEET_ID:
   ```bash
   # GOOGLE_SHEET_ID=your_sheet_id_here
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

2. Attempt to start the application:
   ```bash
   npm run dev
   ```

3. Capture the error output

**Verification Checklist**:

- [ ] Application fails to start (exits with error)
- [ ] Error message has visual borders (=== lines at top and bottom)
- [ ] Error clearly states "CONFIGURATION ERROR: Missing Google Sheets Credentials"
- [ ] Error lists "GOOGLE_SHEET_ID" in missing variables section
- [ ] Error shows specific issue with ❌ symbol
- [ ] Error includes 3 resolution steps:
  - [ ] Step 1: Copy .env.example to .env.local
  - [ ] Step 2: Follow docs/google-sheets-setup.md
  - [ ] Step 3: Configure credentials in .env.local
- [ ] Error references troubleshooting documentation: docs/troubleshooting.md
- [ ] Error message is formatted and readable (not raw JSON)

**Expected Error Output** (should contain):
```
======================================================================
CONFIGURATION ERROR: Missing Google Sheets Credentials
======================================================================

The application requires Google Sheets environment variables.

Missing or invalid variables:
  ❌ GOOGLE_SHEET_ID: [error message]

----------------------------------------------------------------------
Resolution Steps:
----------------------------------------------------------------------
1. Copy .env.example to .env.local:
   $ cp .env.example .env.local

2. Follow the Google Sheets setup guide:
   docs/google-sheets-setup.md

3. Configure your credentials in .env.local

For troubleshooting, see: docs/troubleshooting.md
======================================================================
```

**Actual Error Output**:
```
[Paste actual error output here]
```

**Test Result**: [ ] PASS / [ ] FAIL

**Notes**: _______________________________

---

### Test 2: Missing GOOGLE_PRIVATE_KEY

**Objective**: Verify error message when GOOGLE_PRIVATE_KEY is missing

**Steps**:

1. Restore .env.local from backup:
   ```bash
   cp .env.local.backup .env.local
   ```

2. Edit .env.local and comment out or remove GOOGLE_PRIVATE_KEY:
   ```bash
   GOOGLE_SHEET_ID=your_sheet_id_here
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
   # GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

3. Attempt to start the application:
   ```bash
   npm run dev
   ```

**Verification Checklist**:

- [ ] Application fails to start
- [ ] Error message has visual borders
- [ ] Error lists "GOOGLE_PRIVATE_KEY" in missing variables
- [ ] Error shows ❌ symbol for GOOGLE_PRIVATE_KEY
- [ ] Error includes 3 resolution steps
- [ ] Error references documentation

**Actual Error Output**:
```
[Paste actual error output here]
```

**Test Result**: [ ] PASS / [ ] FAIL

---

### Test 3: Missing GOOGLE_SERVICE_ACCOUNT_EMAIL

**Objective**: Verify error message when GOOGLE_SERVICE_ACCOUNT_EMAIL is missing

**Steps**:

1. Restore .env.local from backup:
   ```bash
   cp .env.local.backup .env.local
   ```

2. Edit .env.local and comment out or remove GOOGLE_SERVICE_ACCOUNT_EMAIL:
   ```bash
   GOOGLE_SHEET_ID=your_sheet_id_here
   # GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

3. Attempt to start the application:
   ```bash
   npm run dev
   ```

**Verification Checklist**:

- [ ] Application fails to start
- [ ] Error message has visual borders
- [ ] Error lists "GOOGLE_SERVICE_ACCOUNT_EMAIL" in missing variables
- [ ] Error shows ❌ symbol for GOOGLE_SERVICE_ACCOUNT_EMAIL
- [ ] Error includes 3 resolution steps
- [ ] Error references documentation

**Actual Error Output**:
```
[Paste actual error output here]
```

**Test Result**: [ ] PASS / [ ] FAIL

---

### Test 4: All Three Variables Missing

**Objective**: Verify error message lists all three missing variables

**Steps**:

1. Edit .env.local and comment out or remove ALL three Google Sheets variables:
   ```bash
   # GOOGLE_SHEET_ID=your_sheet_id_here
   # GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
   # GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

   # Keep other variables if present
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. Attempt to start the application:
   ```bash
   npm run dev
   ```

**Verification Checklist**:

- [ ] Application fails to start
- [ ] Error message has visual borders
- [ ] Error lists ALL THREE variables in missing variables section:
  - [ ] GOOGLE_SHEET_ID
  - [ ] GOOGLE_SERVICE_ACCOUNT_EMAIL
  - [ ] GOOGLE_PRIVATE_KEY
- [ ] Each variable has ❌ symbol
- [ ] Error includes 3 resolution steps
- [ ] Error references documentation

**Actual Error Output**:
```
[Paste actual error output here]
```

**Test Result**: [ ] PASS / [ ] FAIL

---

### Test 5: Invalid GOOGLE_PRIVATE_KEY Format

**Objective**: Verify error describes format issue for invalid private key

**Steps**:

1. Restore .env.local from backup:
   ```bash
   cp .env.local.backup .env.local
   ```

2. Edit .env.local and set GOOGLE_PRIVATE_KEY to invalid format:
   ```bash
   GOOGLE_SHEET_ID=your_sheet_id_here
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="invalid-key-format"  # Invalid - no BEGIN/END markers
   ```

3. Attempt to start the application:
   ```bash
   npm run dev
   ```

**Verification Checklist**:

- [ ] Application fails to start
- [ ] Error message has visual borders
- [ ] Error lists "GOOGLE_PRIVATE_KEY" in missing/invalid variables
- [ ] Error message describes the format issue (e.g., "must be a valid PEM-formatted private key")
- [ ] Error includes 3 resolution steps
- [ ] Error references documentation

**Expected Error Detail** (for GOOGLE_PRIVATE_KEY):
Should mention:
- "PEM-formatted" OR "BEGIN PRIVATE KEY" / "END PRIVATE KEY"
- Indicates format validation failed

**Actual Error Output**:
```
[Paste actual error output here]
```

**Test Result**: [ ] PASS / [ ] FAIL

---

### Test 6: Invalid GOOGLE_SERVICE_ACCOUNT_EMAIL Format

**Objective**: Verify error describes format issue for invalid email

**Steps**:

1. Restore .env.local from backup:
   ```bash
   cp .env.local.backup .env.local
   ```

2. Edit .env.local and set GOOGLE_SERVICE_ACCOUNT_EMAIL to invalid format:
   ```bash
   GOOGLE_SHEET_ID=your_sheet_id_here
   GOOGLE_SERVICE_ACCOUNT_EMAIL=not-an-email  # Invalid email format
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

3. Attempt to start the application:
   ```bash
   npm run dev
   ```

**Verification Checklist**:

- [ ] Application fails to start
- [ ] Error message has visual borders
- [ ] Error lists "GOOGLE_SERVICE_ACCOUNT_EMAIL" in invalid variables
- [ ] Error message describes format issue (e.g., "must be a valid email address")
- [ ] Error includes 3 resolution steps
- [ ] Error references documentation

**Actual Error Output**:
```
[Paste actual error output here]
```

**Test Result**: [ ] PASS / [ ] FAIL

---

### Test 7: Invalid GOOGLE_SHEET_ID Format

**Objective**: Verify error describes format issue for invalid sheet ID

**Steps**:

1. Restore .env.local from backup:
   ```bash
   cp .env.local.backup .env.local
   ```

2. Edit .env.local and set GOOGLE_SHEET_ID to invalid format:
   ```bash
   GOOGLE_SHEET_ID=short  # Too short, should be 40+ characters
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

3. Attempt to start the application:
   ```bash
   npm run dev
   ```

**Verification Checklist**:

- [ ] Application fails to start
- [ ] Error message has visual borders
- [ ] Error lists "GOOGLE_SHEET_ID" in invalid variables
- [ ] Error message describes format issue (e.g., "must be at least 40 characters")
- [ ] Error includes 3 resolution steps
- [ ] Error references documentation

**Actual Error Output**:
```
[Paste actual error output here]
```

**Test Result**: [ ] PASS / [ ] FAIL

---

### Test 8: Following Error Message Instructions

**Objective**: Verify that following the error message instructions resolves the issue

**Steps**:

1. Start with Test 4 configuration (all three variables missing)

2. Follow the error message resolution steps exactly:

   **Step 1**: Copy .env.example to .env.local
   ```bash
   cp .env.example .env.local
   ```

   **Step 2**: Open docs/google-sheets-setup.md and verify it exists and is readable
   ```bash
   cat docs/google-sheets-setup.md | head -20
   ```

   **Step 3**: Configure credentials in .env.local (use your working backup)
   ```bash
   # Edit .env.local with valid credentials
   ```

3. Attempt to start the application:
   ```bash
   npm run dev
   ```

**Verification Checklist**:

- [ ] .env.example file exists and can be copied
- [ ] docs/google-sheets-setup.md exists and is accessible
- [ ] After following all 3 steps, application starts successfully
- [ ] No error messages displayed
- [ ] Application runs normally
- [ ] Can access http://localhost:3000

**Test Result**: [ ] PASS / [ ] FAIL

---

### Test 9: Documentation References Accuracy

**Objective**: Verify documentation paths referenced in errors are correct

**Steps**:

1. From any error message, note the documentation references

2. Verify each referenced file exists:
   ```bash
   ls -la docs/google-sheets-setup.md
   ls -la docs/troubleshooting.md
   ls -la .env.example
   ```

**Verification Checklist**:

- [ ] docs/google-sheets-setup.md exists
- [ ] docs/troubleshooting.md exists
- [ ] .env.example exists (or .env.local.example if referenced)
- [ ] All paths in error messages are accurate
- [ ] No broken documentation references

**Test Result**: [ ] PASS / [ ] FAIL

---

## Test Results Summary

### Overall Pass Criteria

All of the following must be true for overall test to PASS:

- [ ] Test 1: Missing GOOGLE_SHEET_ID - PASS
- [ ] Test 2: Missing GOOGLE_PRIVATE_KEY - PASS
- [ ] Test 3: Missing GOOGLE_SERVICE_ACCOUNT_EMAIL - PASS
- [ ] Test 4: All three missing - PASS
- [ ] Test 5: Invalid GOOGLE_PRIVATE_KEY format - PASS
- [ ] Test 6: Invalid GOOGLE_SERVICE_ACCOUNT_EMAIL format - PASS
- [ ] Test 7: Invalid GOOGLE_SHEET_ID format - PASS
- [ ] Test 8: Following instructions resolves issue - PASS
- [ ] Test 9: Documentation references accurate - PASS

### Error Message Quality Assessment

Rate the error messages overall (1-5, 5 = excellent):

- [ ] Clarity: 1 / 2 / 3 / 4 / 5
- [ ] Actionability: 1 / 2 / 3 / 4 / 5
- [ ] Visual formatting: 1 / 2 / 3 / 4 / 5
- [ ] Completeness: 1 / 2 / 3 / 4 / 5
- [ ] Helpfulness: 1 / 2 / 3 / 4 / 5

### Issues Found

Document any issues with error messages:

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

2. Verify application works:
   ```bash
   npm run dev
   # Should start successfully
   ```

3. Remove backup:
   ```bash
   rm .env.local.backup
   ```

---

## Improvement Recommendations

Based on test results, document any recommended improvements to error messages:

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
- [ ] Error outputs captured for each test
- [ ] Pass/Fail recorded for each test
- [ ] Quality assessment completed
- [ ] Issues documented
- [ ] Original configuration restored
- [ ] Application verified working after restore
- [ ] Improvement recommendations documented

---

**Overall Test Status**: [ ] PASS / [ ] FAIL

**Tester Name**: _________________

**Test Date**: _________________

**Average Error Message Quality Rating**: _____ / 5

**Notes**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
