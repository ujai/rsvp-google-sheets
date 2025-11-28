# Manual Testing Guide: Fresh Setup Process Verification

**Test ID**: Task 5.3
**Purpose**: Verify that the complete setup documentation is clear, complete, and accurate
**Dependencies**: Task 1.3, Task 2.1, Task 2.2 (all completed)
**Target Time**: Less than 30 minutes for someone familiar with GCP
**Tester**: Requires a fresh environment or new user

---

## Test Overview

This test verifies that:
- Documentation in `docs/google-sheets-setup.md` is complete and accurate
- All steps are clear and can be followed without assistance
- Setup process can be completed in under 30 minutes by someone familiar with GCP
- Application starts successfully after following the documentation
- No steps are missing or ambiguous
- Test RSVP submission works correctly

---

## Prerequisites

### Required for Fresh Setup Test:

- [ ] Fresh directory (clone repository to new location) OR different machine
- [ ] Google account with access to Google Cloud Console
- [ ] Terminal access
- [ ] Text editor
- [ ] Internet connection
- [ ] Node.js v18+ installed
- [ ] npm installed
- [ ] Basic familiarity with Google Cloud Platform (for target time < 30 min)

### Optional (for truly fresh test):

- [ ] Different user account who hasn't done setup before
- [ ] Different machine to avoid cached credentials
- [ ] Screen recording software to capture any issues

---

## Test Setup

### Step 1: Prepare Fresh Environment

**Option A: Fresh Directory (Same Machine)**
```bash
# Navigate to a different directory
cd /tmp  # or another location

# Clone the repository fresh
git clone [repository-url] majlis-rsvp-fresh-test
cd majlis-rsvp-fresh-test

# Install dependencies
npm install
```

**Option B: Different Machine/User**
```bash
# On fresh machine, clone repository
git clone [repository-url]
cd majlis-rsvp

# Install dependencies
npm install
```

### Step 2: Clear Any Existing Configuration

```bash
# Ensure no .env.local exists
rm -f .env.local

# Verify it's removed
ls -la | grep .env
```

### Step 3: Prepare Timing Mechanism

Start a timer when you begin following the documentation. The goal is to complete setup in less than 30 minutes.

**Timer Start Time**: __:__ (HH:MM)

---

## Test Procedure

### Part 1: Follow Documentation Exactly

**Instructions**: Open `docs/google-sheets-setup.md` and follow EVERY step exactly as written. Do NOT skip ahead or use prior knowledge. Document any issues.

#### Step-by-Step Checklist:

Follow each section in `docs/google-sheets-setup.md`:

- [ ] **Prerequisites** section read and understood
- [ ] **Step 1: Create Google Cloud Project**
  - [ ] All sub-steps (1.1 - 1.5) completed
  - [ ] Any unclear instructions noted
- [ ] **Step 2: Enable Google Sheets API**
  - [ ] All sub-steps (2.1 - 2.5) completed
  - [ ] Any unclear instructions noted
- [ ] **Step 3: Create Service Account**
  - [ ] All sub-steps (3.1 - 3.6) completed
  - [ ] Any unclear instructions noted
- [ ] **Step 4: Generate Service Account Key**
  - [ ] All sub-steps (4.1 - 4.7) completed
  - [ ] JSON file downloaded successfully
  - [ ] Any unclear instructions noted
- [ ] **Step 5: Create Development Google Sheet**
  - [ ] All sub-steps (5.1 - 5.6) completed
  - [ ] Sheet ID copied correctly
  - [ ] Any unclear instructions noted
- [ ] **Step 6: Share Sheet with Service Account**
  - [ ] All sub-steps (6.1 - 6.5) completed
  - [ ] Service account email copied from JSON
  - [ ] Sheet shared with Editor permission
  - [ ] Any unclear instructions noted
- [ ] **Step 7: Configure Environment Variables**
  - [ ] All sub-steps (7.1 - 7.5) completed
  - [ ] .env.local file created from .env.example
  - [ ] All three required variables configured
  - [ ] Values copied correctly from JSON file
  - [ ] Any unclear instructions noted
- [ ] **Step 8: Initialize Sheet Headers**
  - [ ] All sub-steps (8.1 - 8.3) completed
  - [ ] `npm run init-sheet` executed successfully
  - [ ] Headers verified in Google Sheet
  - [ ] Any unclear instructions noted
- [ ] **Step 9: Verify Setup**
  - [ ] All sub-steps (9.1 - 9.5) completed
  - [ ] Development server started without errors
  - [ ] Application accessible at http://localhost:3000
  - [ ] Test RSVP submitted successfully
  - [ ] Data verified in Google Sheet
  - [ ] Any unclear instructions noted

**Timer End Time**: __:__ (HH:MM)

**Total Time**: _____ minutes

---

### Part 2: Documentation Quality Assessment

Rate each aspect of the documentation:

#### Clarity (1-5 scale, 5 = very clear)

- [ ] Prerequisites explanation: 1 / 2 / 3 / 4 / 5
- [ ] Step-by-step instructions: 1 / 2 / 3 / 4 / 5
- [ ] Technical terminology usage: 1 / 2 / 3 / 4 / 5
- [ ] Visual guidance (screenshots): 1 / 2 / 3 / 4 / 5
- [ ] Overall clarity: 1 / 2 / 3 / 4 / 5

#### Completeness (Yes/No)

- [ ] All necessary steps included: Yes / No
- [ ] No steps missing: Yes / No
- [ ] No assumptions of prior knowledge: Yes / No
- [ ] Troubleshooting guidance available: Yes / No
- [ ] Links to additional resources provided: Yes / No

#### Issues Encountered

Document any issues, unclear steps, or missing information:

**Issue 1**:
- Step number: _______
- Description: _______________________________
- Suggested improvement: _______________________________

**Issue 2**:
- Step number: _______
- Description: _______________________________
- Suggested improvement: _______________________________

**Issue 3**:
- Step number: _______
- Description: _______________________________
- Suggested improvement: _______________________________

---

### Part 3: Application Functionality Verification

After completing setup, verify the application works correctly:

#### Test Case 1: Application Startup

```bash
npm run dev
```

**Verification**:
- [ ] Server starts without errors
- [ ] No ZodError thrown
- [ ] No Google Sheets API errors
- [ ] Port 3000 accessible
- [ ] Console shows "ready" message

**Console Output**:
```
[Copy relevant console output here]
```

#### Test Case 2: Homepage Access

Navigate to `http://localhost:3000`

**Verification**:
- [ ] Page loads successfully
- [ ] No error messages displayed
- [ ] Hero section visible
- [ ] Event details section visible
- [ ] RSVP form visible
- [ ] Page renders correctly

**Screenshot**: (Optional - take screenshot of homepage)

#### Test Case 3: RSVP Submission

Submit test RSVP with following data:
- Name: "Setup Test User"
- Attendance: "Hadir"
- Number of people: "2"

**Verification**:
- [ ] Form accepts input
- [ ] No validation errors
- [ ] Submit button works
- [ ] Success message displayed
- [ ] Edit link displayed in success message

**Success Message**: _______________________________

#### Test Case 4: Google Sheet Verification

Open your Google Sheet in browser

**Verification**:
- [ ] Sheet has headers in row 1
- [ ] New data row appears in row 2
- [ ] Timestamp is correct
- [ ] Name is "Setup Test User"
- [ ] Status is "Hadir"
- [ ] Number is "2"
- [ ] Edit link is populated

**Sheet Data** (copy row 2):
```
[Timestamp] | [Name] | [Status] | [Number] | [Edit Link]
```

#### Test Case 5: Edit Link Functionality

Copy edit link from success message or Google Sheet

**Verification**:
- [ ] Edit link navigates to edit page
- [ ] Form is pre-filled with submitted data
- [ ] Can modify data
- [ ] Update submission works
- [ ] Updated data appears in Google Sheet

**Edit Link**: _______________________________

---

## Test Results Summary

### Pass Criteria

All of the following must be true for test to PASS:

- [ ] Setup completed by following documentation only (no external help needed)
- [ ] Setup time is under 30 minutes (for GCP-familiar user)
- [ ] No critical steps missing from documentation
- [ ] Application starts successfully after setup
- [ ] Test RSVP submission works correctly
- [ ] Data appears in Google Sheet as expected
- [ ] Edit functionality works
- [ ] No errors encountered during normal flow
- [ ] Documentation clarity rating >= 4/5
- [ ] Documentation completeness: all "Yes"

### Fail Criteria

If ANY of the following occur, test FAILS:

- [ ] Setup cannot be completed without external help
- [ ] Setup time exceeds 30 minutes significantly (40+ minutes)
- [ ] Critical steps missing from documentation
- [ ] Application fails to start after following all steps
- [ ] RSVP submission fails
- [ ] Data does not appear in Google Sheet
- [ ] Multiple unclear or ambiguous steps
- [ ] Documentation clarity rating < 3/5

---

## Documentation Improvement Recommendations

Based on test results, document recommended improvements:

### Must Fix (Critical Issues)
1. _______________________________
2. _______________________________
3. _______________________________

### Should Fix (Important but not blocking)
1. _______________________________
2. _______________________________
3. _______________________________

### Nice to Have (Minor improvements)
1. _______________________________
2. _______________________________
3. _______________________________

### Additional Suggestions
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

## Cleanup

After completing test:

1. Decide whether to keep or delete test setup:
   - [ ] Keep for future testing
   - [ ] Delete test directory
   - [ ] Delete Google Cloud project
   - [ ] Delete Google Sheet

2. If keeping, document setup details:
   - Project name: _______________________________
   - Sheet ID: _______________________________
   - Service account email: _______________________________

---

## Post-Test Actions

Based on test results:

- [ ] Update documentation with improvements
- [ ] Add missing screenshots or examples
- [ ] Clarify ambiguous steps
- [ ] Add troubleshooting entries for encountered issues
- [ ] Test updated documentation (if major changes)
- [ ] Commit documentation improvements

---

## Test Completion Checklist

- [ ] Fresh environment prepared
- [ ] Timer used to track setup time
- [ ] All documentation steps followed exactly
- [ ] Setup time recorded
- [ ] Documentation quality assessed
- [ ] All verification test cases completed
- [ ] Issues and improvements documented
- [ ] Test results summary completed
- [ ] Cleanup performed
- [ ] Post-test actions identified

---

**Test Status**: [ ] PASS / [ ] FAIL

**Tester Name**: _________________

**Tester Experience Level**: [ ] GCP Beginner / [ ] GCP Intermediate / [ ] GCP Expert

**Test Date**: _________________

**Setup Time**: _____ minutes

**Overall Rating**: _____ / 5

**Would Recommend This Documentation**: [ ] Yes / [ ] No

**Additional Comments**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
