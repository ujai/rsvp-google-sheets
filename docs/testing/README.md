# Testing Documentation

This directory contains comprehensive testing guides for the Majlis RSVP application, specifically for Task Group 5: Testing and Quality Assurance.

## Overview

The testing suite includes both automated unit tests and manual testing procedures to ensure the application works correctly, documentation is clear, and error handling is robust.

---

## Automated Tests

### Unit Tests (Task 5.1)

**Test File**: `/lib/env.test.ts`

**Test Framework**: Vitest

**Coverage**: Environment validation schema

**Run Tests**:
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm test -- --watch
```

**Test Suites**:
- Missing required variables (4 tests)
- Invalid GOOGLE_PRIVATE_KEY format (3 tests)
- Invalid GOOGLE_SERVICE_ACCOUNT_EMAIL format (2 tests)
- Invalid GOOGLE_SHEET_ID format (3 tests)
- Valid variables pass validation (3 tests)
- Optional variables use defaults (7 tests)

**Total**: 22 tests covering all environment validation scenarios

---

## Manual Testing Guides

All manual testing guides follow a consistent structure:
- Test Overview
- Prerequisites
- Test Setup
- Step-by-Step Test Procedures
- Verification Checklists
- Pass/Fail Criteria
- Cleanup Instructions
- Issue Documentation Templates

### 1. Dual Environment Integration Test (Task 5.2)

**File**: `dual-environment-integration-test.md`

**Purpose**: Verify development and production environments are completely isolated

**What It Tests**:
- Data written in development appears only in dev sheet
- Data written in production appears only in prod sheet
- Edit links work correctly for each environment
- No cross-environment data leakage

**Estimated Time**: 1 hour

**Test Cases**: 5 comprehensive scenarios

**Key Verifications**:
- Environment isolation
- Edit link functionality
- Multiple submissions without cross-contamination

---

### 2. Fresh Setup Process Test (Task 5.3)

**File**: `fresh-setup-process-test.md`

**Purpose**: Verify setup documentation is clear, complete, and accurate

**What It Tests**:
- Documentation clarity and completeness
- Setup process can be completed in under 30 minutes
- All steps are actionable
- Application starts successfully after following docs

**Estimated Time**: 1-2 hours (including fresh setup)

**Test Sections**:
- Follow documentation exactly (all 9 steps)
- Documentation quality assessment (clarity, completeness)
- Application functionality verification (4 test cases)
- Improvement recommendations

**Success Criteria**:
- Setup time < 30 minutes (for GCP-familiar users)
- Documentation clarity rating >= 4/5
- All functionality tests pass

---

### 3. Error Message Validation Test (Task 5.4)

**File**: `error-message-validation-test.md`

**Purpose**: Verify error messages are clear, actionable, and helpful

**What It Tests**:
- Error messages identify specific missing variables
- Error messages describe format issues clearly
- 3-step resolution path is included
- Documentation references are accurate
- Following instructions resolves the issue

**Estimated Time**: 1 hour

**Test Cases**: 9 scenarios covering:
- Missing GOOGLE_SHEET_ID
- Missing GOOGLE_PRIVATE_KEY
- Missing GOOGLE_SERVICE_ACCOUNT_EMAIL
- All three missing
- Invalid GOOGLE_PRIVATE_KEY format
- Invalid GOOGLE_SERVICE_ACCOUNT_EMAIL format
- Invalid GOOGLE_SHEET_ID format
- Following error instructions
- Documentation accuracy

**Quality Assessment**:
- Clarity (1-5)
- Actionability (1-5)
- Visual formatting (1-5)
- Completeness (1-5)
- Helpfulness (1-5)

---

### 4. Validation Script Test (Task 5.5)

**File**: `validation-script-test.md`

**Purpose**: Verify `npm run validate-sheets` script works correctly in all scenarios

**What It Tests**:
- All 6 validation checks execute correctly
- Specific error messages for each failure type
- Exit codes are correct (0 = success, 1 = failure)
- Test row is appended to sheet successfully

**Estimated Time**: 1 hour

**Test Cases**: 9 scenarios covering:
1. Valid credentials - all checks pass
2. Missing GOOGLE_SHEET_ID
3. Invalid credentials
4. Sheet not shared (403 Permission Denied)
5. Sheet not found (404)
6. Missing RSVPs sheet
7. Read-only permissions (write fails)
8. Test row appended successfully
9. Exit codes verification

**Script Steps Validated**:
- Step 1: Environment variables loaded
- Step 2: API client initialized
- Step 3: Authentication tested
- Step 4: RSVPs sheet checked
- Step 5: Read access tested
- Step 6: Write access tested

---

## Testing Workflow

### For Developers

1. **Before Committing Code**:
   ```bash
   # Run automated unit tests
   npm test
   ```

2. **After Documentation Changes**:
   - Follow `fresh-setup-process-test.md`
   - Verify all steps are still accurate

3. **After Environment Validation Changes**:
   - Run unit tests: `npm test`
   - Follow `error-message-validation-test.md`

4. **After Validation Script Changes**:
   - Follow `validation-script-test.md`

### For QA/Testers

1. **Initial Setup Testing**:
   - Follow `fresh-setup-process-test.md` on a fresh machine
   - Document any issues or improvements needed

2. **Environment Isolation Testing**:
   - Follow `dual-environment-integration-test.md`
   - Verify no data leakage between environments

3. **Error Handling Testing**:
   - Follow `error-message-validation-test.md`
   - Assess error message quality

4. **Validation Tooling Testing**:
   - Follow `validation-script-test.md`
   - Verify all failure scenarios produce helpful messages

---

## Test Status Tracking

Each manual testing guide includes:
- [ ] Test completion checklist
- [ ] Pass/Fail status
- [ ] Tester name and date
- [ ] Notes section for observations

Fill these out when conducting tests to track results over time.

---

## Continuous Improvement

### Updating Tests

When application code changes:
1. Update unit tests to reflect new behavior
2. Run `npm test` to verify all tests pass
3. Update manual testing guides if procedures change
4. Re-run manual tests after significant changes

### Adding New Tests

When adding new features:
1. Add unit tests to `lib/env.test.ts` if related to environment validation
2. Create new manual testing guides for complex features
3. Follow the existing guide structure for consistency
4. Update this README with links to new guides

---

## Test Results

### Unit Tests

**Status**: ✅ All Passing
**Test File**: `/lib/env.test.ts`
**Total Tests**: 22
**Last Run**: 2025-11-28
**Coverage**: Environment validation schema

### Manual Tests

Manual tests are conducted as needed. Results are documented in the testing guide files.

**Guides Available**:
- ✅ Dual Environment Integration Test
- ✅ Fresh Setup Process Test
- ✅ Error Message Validation Test
- ✅ Validation Script Test

---

## Troubleshooting Tests

### Unit Tests Failing

1. Ensure dependencies are installed:
   ```bash
   npm install
   ```

2. Check Node.js version (v18+ required):
   ```bash
   node --version
   ```

3. Clear cache and re-run:
   ```bash
   npm test -- --clearCache
   ```

### Manual Tests Issues

If manual tests cannot be completed:
1. Check prerequisites are met
2. Verify all previous phases are completed
3. Ensure valid credentials are configured
4. Consult `docs/troubleshooting.md` for setup issues

---

## Additional Resources

- **Setup Documentation**: `docs/google-sheets-setup.md`
- **Environment Configuration**: `docs/environment-configuration.md`
- **Troubleshooting Guide**: `docs/troubleshooting.md`
- **Main README**: `/README.md`

---

## Contact

For issues with testing procedures or questions about test results, refer to:
- Project documentation in `/docs`
- Issue tracker (if applicable)
- Development team

---

**Last Updated**: 2025-11-28
