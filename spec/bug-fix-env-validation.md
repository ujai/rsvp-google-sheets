# Bug Fix: Environment Variable Validation Blocking Development Server

## 1. Overview

### Purpose
Fix the runtime ZodError that prevents the Next.js development server from starting when Google Sheets credentials are not configured, allowing developers to work on features that don't require these credentials.

### Current Problem
The application fails to start in development mode because the environment validation schema (`lib/env.ts`) requires all Google Sheets credentials to be present at startup, even when working on features that don't need them.

### Goals
- Allow the development server to start without Google Sheets credentials
- Maintain strict validation in production environments
- Ensure Google Sheets features fail gracefully when credentials are missing
- Provide clear error messages when credentials are needed but not configured

### Target Users
- Developers working on the majlis-rsvp project
- Team members who need to run the app locally without full credentials

---

## 2. Bug Details

### Error Information
**Error Type**: Runtime ZodError
**Environment**: Next.js 16.0.3 (Turbopack)
**Error Location**: `/home/ujai/Projek/Rahmat/majlis-rsvp/lib/env.ts:82:30`

### Missing Environment Variables
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`

### Stack Trace
```
lib/env.ts:82 - envSchema.parse(process.env) fails
lib/constants.ts:2 - imports from env.ts
components/server/hero-section.tsx:3 - imports from constants
app/page.tsx:4 - imports hero-section
```

### Root Cause
The environment validation runs immediately when `lib/env.ts` is imported, and the schema marks Google Sheets credentials as required (`.min(1)` validators without `.optional()`). This causes the parse to fail before the application can start.

The validation is triggered during the import chain:
1. `app/page.tsx` imports hero-section
2. `hero-section` imports constants
3. `constants.ts` imports env
4. `env.ts` executes validation immediately on line 82

---

## 3. Proposed Solution

### Option A: Make Google Sheets Credentials Optional (Recommended)
Make the Google Sheets environment variables optional in the schema, and add runtime validation when Google Sheets features are actually used.

**Advantages**:
- Development server starts without credentials
- Maintains type safety
- Errors occur only when features are used
- More flexible for development

**Disadvantages**:
- Need to add validation in multiple places where credentials are used
- Slightly more complex error handling

### Option B: Environment-Based Validation
Only require Google Sheets credentials in production, make them optional in development.

**Advantages**:
- Simple conditional logic
- Clear separation between environments

**Disadvantages**:
- Can't test Google Sheets features in development without credentials
- May hide configuration issues until production

### Option C: Lazy Validation
Delay validation until credentials are actually accessed.

**Advantages**:
- Maximum flexibility
- App starts quickly

**Disadvantages**:
- Errors occur later in the application lifecycle
- More complex implementation

---

## 4. Technical Requirements

### Changes Needed

#### 4.1. Update Environment Schema (`lib/env.ts`)
- Modify Google Sheets credential validators to be optional
- Add helper function to validate credentials when needed
- Update TypeScript types to reflect optional credentials

#### 4.2. Add Runtime Validation
- Create validation helper for Google Sheets operations
- Add validation checks in functions that use Google Sheets API
- Provide clear error messages when credentials are missing

#### 4.3. Update Documentation
- Update `.env.local.example` to clarify which variables are optional
- Add comments explaining when credentials are needed
- Update README with development setup instructions

#### 4.4. Test Cases
- Test app startup without credentials
- Test Google Sheets features fail gracefully without credentials
- Test Google Sheets features work correctly with credentials
- Test error messages are clear and actionable

---

## 5. Impact Analysis

### Files Affected
- `/home/ujai/Projek/Rahmat/majlis-rsvp/lib/env.ts` - Primary changes
- `/home/ujai/Projek/Rahmat/majlis-rsvp/lib/google-sheets.ts` (if exists) - Add validation
- Any server components using Google Sheets - Add error handling
- `/home/ujai/Projek/Rahmat/majlis-rsvp/.env.local.example` - Update documentation

### Breaking Changes
None - this is a bug fix that relaxes validation requirements.

### Migration Path
No migration needed. Existing configurations will continue to work.

---

## 6. Success Criteria

### Must Have
- [ ] Development server starts successfully without Google Sheets credentials
- [ ] Application runs in production with strict validation
- [ ] Clear error messages when Google Sheets features are used without credentials
- [ ] No TypeScript errors in the codebase

### Should Have
- [ ] Helper function for validating Google Sheets credentials
- [ ] Updated documentation in README and .env.example
- [ ] Error boundaries around Google Sheets features

### Nice to Have
- [ ] Development mode warning when credentials are missing
- [ ] Better error messages with setup instructions
- [ ] Automated tests for credential validation

---

## 7. Open Questions

1. **Feature Dependency**: Which pages/features actually require Google Sheets credentials?
   - Need to audit where RSVP data is written/read
   - Identify which routes can work without credentials

2. **Error Handling Strategy**: Should features that need credentials:
   - Show error message to users?
   - Render fallback UI?
   - Redirect to error page?

3. **Production Safety**: How to ensure credentials are present in production?
   - Build-time validation?
   - Startup health check?
   - Deployment environment validation?

4. **Development Experience**: Should we provide:
   - Mock data mode for development?
   - Local storage fallback?
   - Test credentials for development?

---

## 8. Next Steps

### Immediate Actions
1. Review which features actually require Google Sheets access
2. Decide on error handling strategy (Option A, B, or C)
3. Identify all locations where Google Sheets credentials are used

### Research Needed
- Audit codebase for Google Sheets API usage
- Review Next.js best practices for environment validation
- Check if other features depend on these credentials

### Stakeholders to Consult
- Development team working on majlis-rsvp
- Anyone who deploys this application
- Users who might encounter these errors

---

## 9. Additional Context

### Current Environment Schema
The current schema in `lib/env.ts` uses strict validation:
- Email validation for `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- Private key format validation (checks for PEM format, min 100 chars)
- Sheet ID format validation (40-100 chars, alphanumeric with dashes)

### Related Features
- RSVP form submission (likely requires Google Sheets)
- RSVP data retrieval (likely requires Google Sheets)
- Hero section rendering (currently imports constants, may not need credentials)

### Security Considerations
- Credentials should never be exposed to client-side code
- Keep validation in server-side only modules
- Ensure error messages don't leak sensitive information

---

## 10. Specification Metadata

**Created**: 2025-11-27
**Project**: majlis-rsvp
**Type**: Bug Fix
**Priority**: High (blocks development)
**Estimated Effort**: 2-4 hours
**Status**: Initialized - Awaiting Review
