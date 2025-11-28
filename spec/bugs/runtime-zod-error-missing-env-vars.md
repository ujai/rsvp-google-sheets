# Bug Fix: Runtime ZodError - Missing Google Sheets Environment Variables

## 1. Overview

### Bug Type
Runtime ZodError

### Severity
Critical - Application fails to start

### Status
In Progress - Requirements Gathered

### Reported Date
2025-11-27

### Updated Date
2025-11-27

## 2. Problem Description

The application fails at startup due to missing required Google Sheets environment variables. The Zod schema validation in `lib/env.ts` throws an error when parsing `process.env`, preventing the Next.js application from initializing.

### Error Message
```
ZodError: Required environment variables are missing:
- GOOGLE_SERVICE_ACCOUNT_EMAIL
- GOOGLE_PRIVATE_KEY
- GOOGLE_SHEET_ID
```

### Error Location
- **Primary**: `lib/env.ts:82` - `envSchema.parse(process.env)`
- **Cascade Path**:
  1. `lib/env.ts:82`
  2. `lib/constants.ts:2`
  3. `components/server/hero-section.tsx:3`
  4. `app/page.tsx:4`

### Root Cause
Runtime validation error occurring during module evaluation phase, before the application can fully start.

## 3. Impact Analysis

### Affected Components
- Application startup
- Google Sheets integration (MANDATORY feature)
- Server-side components that depend on environment configuration
- Development and production environments (separate configurations needed)

### User Impact
- **Currently**: Blocks local development completely
- Complete application failure when credentials are missing
- No graceful degradation
- Developer needs to configure Google Sheets credentials to proceed

### Visual Evidence
Screenshot shows Runtime ZodError in Next.js dev mode with the missing environment variable errors, confirming this blocks the development server from starting.

## 4. Technical Context

### Environment Variables Required
1. `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email for Google Sheets API
2. `GOOGLE_PRIVATE_KEY` - Private key for authentication
3. `GOOGLE_SHEET_ID` - Target spreadsheet identifier

### Current Behavior
- Zod schema validation runs at module import time
- Missing variables cause immediate failure
- No fallback or error recovery mechanism

## 5. User Requirements (Gathered 2025-11-27)

### Key Decisions
1. **Google Sheets is MANDATORY** - Not optional, no mock data mode
2. **Separate Google Sheets for Dev and Prod** - Two different spreadsheets
3. **User has credentials** - Just needs configuration guidance
4. **Graceful degradation at runtime** - If API fails, show event details but hide RSVP form
5. **Not blocking production** - Only affects local development currently
6. **Flexible timeline** - Wants best long-term solution

### Solution Constraints
- MUST maintain Google Sheets as a hard requirement
- MUST support separate configurations for development and production
- MUST provide clear setup documentation for both environments
- MUST handle runtime API failures gracefully (different from startup validation)
- MUST NOT use mock data or optional modes

## 6. Recommended Approach

**Selected Solution**: Mandatory Google Sheets with Dual Environment Support

### Core Strategy
1. **Keep strict validation** - Google Sheets credentials remain required
2. **Separate dev/prod configurations** - Two Google Sheets, two sets of credentials
3. **Clear setup documentation** - Step-by-step guide for configuring credentials
4. **Better error messaging** - Helpful instructions when validation fails
5. **Runtime graceful degradation** - Handle API failures after startup gracefully

### Implementation Plan

#### Phase 1: Immediate Fix (Unblock Development)
1. Create comprehensive setup documentation
2. Provide `.env.example` template with clear instructions
3. Guide user through Google Sheets credential configuration
4. Verify application starts with credentials in place

#### Phase 2: Environment Separation
1. Document process for creating two Google Sheets (dev and prod)
2. Set up `.env.local` for development configuration
3. Document `.env.production` or production environment variables
4. Test both configurations independently

#### Phase 3: Improved Error Handling
1. Enhance startup error messages with actionable guidance
2. Implement runtime error handling for Google Sheets API failures
3. Graceful UI degradation: show event details, hide RSVP form when API unavailable
4. Add health check or diagnostic endpoint for integration status

#### Phase 4: Developer Experience
1. Add validation helper to verify credentials are working
2. Create troubleshooting guide for common issues
3. Document credential rotation procedures
4. Add comments in code explaining the dual-sheet setup

## 7. Acceptance Criteria

### Must Have
- [ ] Application starts successfully WITH Google Sheets credentials configured
- [ ] Clear, actionable error messages when credentials are missing at startup
- [ ] `.env.example` file with all required variables documented
- [ ] Step-by-step setup guide for configuring Google Sheets credentials
- [ ] Documentation for creating and configuring two separate Google Sheets (dev and prod)
- [ ] Strict validation remains in place (credentials always required)
- [ ] Runtime error handling when Google Sheets API fails after startup
- [ ] UI gracefully degrades: shows event details but hides RSVP form when API unavailable

### Should Have
- [ ] Helper script or command to validate credentials are working
- [ ] Troubleshooting guide for common configuration issues
- [ ] Health check endpoint showing Google Sheets integration status
- [ ] Clear logging for Google Sheets API failures
- [ ] Instructions for credential rotation
- [ ] Documentation on managing separate dev and prod sheets

### Nice to Have
- [ ] Admin UI panel showing credential status
- [ ] Automated test to verify Google Sheets connection
- [ ] CLI tool to set up Google Sheets and generate credentials
- [ ] Template Google Sheet that can be copied for new environments

## 8. Testing Requirements

### Unit Tests
- Environment schema validation (must reject when variables missing)
- Environment schema validation (must pass when all variables present)
- Runtime error handling for Google Sheets API failures
- UI component behavior when API is unavailable

### Integration Tests
- Application startup WITH credentials (must succeed)
- Application startup WITHOUT credentials (must fail with clear message)
- Google Sheets API integration with development sheet
- Google Sheets API integration with production sheet
- Graceful degradation when API fails at runtime

### Manual Testing
- Fresh development environment setup following documentation
- Verify `.env.local` configuration for development
- Verify production environment variable configuration
- Test error messages are clear and actionable
- Test UI degradation when API is unavailable
- Verify both dev and prod sheets work independently

## 9. Documentation Needs

### Developer Documentation
- **Google Sheets Setup Guide** (PRIORITY)
  - Step-by-step: Creating a Google Cloud project
  - Step-by-step: Enabling Google Sheets API
  - Step-by-step: Creating service account
  - Step-by-step: Generating credentials JSON
  - Step-by-step: Creating development Google Sheet
  - Step-by-step: Sharing sheet with service account
  - How to extract and configure environment variables

- **Environment Configuration Guide**
  - `.env.local` setup for development
  - Production environment variables setup
  - Managing two separate Google Sheets
  - Explanation of each environment variable

- **Troubleshooting Guide**
  - "Application won't start" - missing credentials
  - "Permission denied" - sheet sharing issues
  - "Invalid credentials" - malformed private key
  - "API quota exceeded" - rate limiting
  - Runtime API failures vs startup failures

### Deployment Documentation
- Production environment requirements checklist
- Credential management best practices
- Security considerations for private keys
- Credential rotation procedures
- Backup and disaster recovery for Google Sheets data

## 10. Related Files

### Files to Modify
- `lib/env.ts` - Improve error messages in validation schema
- `lib/google-sheets.ts` (or similar) - Add runtime error handling
- `components/server/hero-section.tsx` - Add error boundary if needed
- `app/page.tsx` - Handle API unavailability gracefully
- Components that display RSVP form - Add conditional rendering

### Files to Create
- `.env.example` - Environment variable template with clear documentation
- `docs/google-sheets-setup.md` - Comprehensive setup guide (PRIORITY)
- `docs/environment-configuration.md` - Environment variable guide
- `docs/troubleshooting.md` - Common issues and solutions
- `scripts/validate-credentials.ts` - Optional helper to test credentials

## 11. Dependencies

### External Services
- Google Sheets API (MANDATORY)
- Google Cloud Platform project
- Google Service Account credentials
- Two separate Google Sheets (development and production)

### Internal Dependencies
- Zod validation library (keep strict validation)
- Next.js environment variable handling
- Google Sheets API client library

## 12. Timeline Estimate

### Phase 1: Immediate Fix (Unblock Development)
- Create setup documentation: 2-3 hours
- Create `.env.example`: 30 minutes
- Improve error messages: 1 hour
- Guide user through setup: 1-2 hours
- **Subtotal**: 4.5-6.5 hours (0.5-1 day)

### Phase 2: Environment Separation Documentation
- Document dual-sheet setup: 1-2 hours
- Create environment configuration guide: 1-2 hours
- Test both configurations: 1 hour
- **Subtotal**: 3-5 hours (0.5 day)

### Phase 3: Runtime Error Handling
- Implement graceful degradation: 2-3 hours
- Add error boundaries: 1-2 hours
- Update UI components: 2-3 hours
- Testing: 2-3 hours
- **Subtotal**: 7-11 hours (1-1.5 days)

### Phase 4: Developer Experience Improvements
- Validation helper script: 2-3 hours
- Troubleshooting guide: 1-2 hours
- Health check endpoint: 1-2 hours
- **Subtotal**: 4-7 hours (0.5-1 day)

**Total Estimate**: 2.5-4 days

**Minimum Viable Fix** (Phase 1 only): 0.5-1 day

## 13. User Answers to Clarifying Questions

### Resolved Questions
1. **Is Google Sheets integration required?** YES - MANDATORY, not optional
2. **Are there alternative data sources?** NO - Google Sheets is the chosen solution
3. **Are credentials available?** YES - User has credentials, needs configuration help
4. **Is this blocking production?** NO - Only blocking local development
5. **Development vs Production setup?** Separate Google Sheets for each environment
6. **Mock data needed?** NO - Real Google Sheets must be used
7. **Timeline urgency?** FLEXIBLE - Wants best long-term solution
8. **Runtime error handling?** YES - Show event details, hide RSVP form when API fails

### Key Constraints
- Google Sheets is a hard requirement (no optional mode)
- Must support two separate sheets (dev and prod)
- User needs clear documentation to configure
- Runtime graceful degradation required

### Security Considerations
- Private key storage in environment variables
- Never commit credentials to git
- Service account permissions should be minimal (read/write to specific sheets only)
- Environment variable exposure in logs (sanitize error messages)
- Credential management in CI/CD for production
- Separate credentials for dev and prod reduces risk
- Document credential rotation procedures

### Performance Considerations
- Google Sheets API has rate limits (document quotas)
- Cache responses where appropriate
- Handle API timeouts gracefully
- Consider pagination for large datasets
- Monitor API usage in production

## 14. Implementation Roadmap

### Immediate Actions (Start Now)
1. Create `.env.example` with all required Google Sheets variables
2. Write comprehensive Google Sheets setup documentation
3. Improve error messages in `lib/env.ts` to be actionable
4. Guide user through credential configuration to unblock development

### Short-term (After Dev Environment Works)
1. Document the dual-sheet setup (dev and prod)
2. Create environment configuration guide
3. Implement runtime error handling for API failures
4. Add graceful UI degradation when API unavailable
5. Test both dev and prod configurations

### Medium-term (Polish)
1. Create validation helper script
2. Add health check endpoint
3. Write troubleshooting guide
4. Add code comments explaining setup
5. Consider template Google Sheet

### Long-term (Maintenance)
1. Document credential rotation procedures
2. Monitor API usage and quotas
3. Set up alerts for API failures
4. Consider backup/redundancy strategy

### Success Metrics
- Application starts successfully in development
- Documentation is clear enough for new developers
- Runtime errors are handled gracefully
- Both dev and prod environments work independently
- User can configure credentials without assistance

## 15. Notes

### Current Status
- Blocking local development only (production not affected)
- User has credentials available, needs configuration guidance
- Requirements gathered 2025-11-27
- Decision: Google Sheets MANDATORY with dual environment support

### Important Decisions
- NO mock data mode
- NO optional/feature flag approach
- YES to strict validation (keep as hard requirement)
- YES to separate dev and prod Google Sheets
- YES to graceful runtime degradation (different from startup validation)

### Architecture Notes
- Startup validation vs runtime error handling are different concerns
  - Startup: Credentials MUST be present or app won't start
  - Runtime: API may fail (network, quota, etc.) - handle gracefully
- Two separate Google Sheets needed:
  - Development sheet (for local dev and testing)
  - Production sheet (for live deployments)
- Environment variable precedence:
  - Development: `.env.local` (not committed to git)
  - Production: Platform-specific env vars (Vercel, etc.)

### Related Issues
- May need to audit other required environment variables
- Consider broader environment configuration strategy
- Documentation should be kept up-to-date as setup evolves

## 16. Detailed Implementation Tasks

### Task 1: Create .env.example Template
**File**: `.env.example`
**Content**:
```env
# Google Sheets API Configuration
# Follow the setup guide in docs/google-sheets-setup.md

# Service account email (looks like: project-name@project-id.iam.gserviceaccount.com)
GOOGLE_SERVICE_ACCOUNT_EMAIL=

# Private key from service account JSON (entire key including -----BEGIN PRIVATE KEY-----)
# Note: In .env.local, wrap in quotes and use \n for line breaks
GOOGLE_PRIVATE_KEY=

# Google Sheet ID (from the spreadsheet URL)
# For development, use your dev sheet ID
# For production, use your prod sheet ID
GOOGLE_SHEET_ID=
```

### Task 2: Improve Error Messages in lib/env.ts
**Current**: Generic Zod error
**Improved**: Add custom error message with setup instructions

```typescript
try {
  return envSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    console.error('\n=== CONFIGURATION ERROR ===\n');
    console.error('Missing required environment variables for Google Sheets integration.\n');
    console.error('Required variables:');
    error.issues.forEach(issue => {
      console.error(`  - ${issue.path.join('.')}`);
    });
    console.error('\nSetup instructions:');
    console.error('1. Copy .env.example to .env.local');
    console.error('2. Follow the guide in docs/google-sheets-setup.md');
    console.error('3. Configure your Google Sheets credentials\n');
  }
  throw error;
}
```

### Task 3: Create Google Sheets Setup Documentation
**File**: `docs/google-sheets-setup.md`
**Sections**:
1. Prerequisites
2. Create Google Cloud Project
3. Enable Google Sheets API
4. Create Service Account
5. Generate Credentials JSON
6. Create Development Google Sheet
7. Create Production Google Sheet
8. Share Sheets with Service Account
9. Configure Environment Variables
10. Verify Setup

### Task 4: Implement Runtime Error Handling
**Location**: Google Sheets API client code
**Changes**:
- Wrap API calls in try-catch
- Log errors appropriately
- Return error state instead of throwing
- Allow components to handle unavailability

### Task 5: Graceful UI Degradation
**Components to update**:
- RSVP form component: Check if API is available before rendering
- Display user-friendly message when unavailable
- Show event details even if RSVP is disabled

### Task 6: Environment Configuration Guide
**File**: `docs/environment-configuration.md`
**Topics**:
- Development vs production configurations
- .env.local for development
- Production environment variables
- Managing two Google Sheets
- Security best practices

### Task 7: Validation Helper Script (Optional)
**File**: `scripts/validate-credentials.ts`
**Purpose**: Test Google Sheets connection
**Features**:
- Verify credentials are valid
- Test sheet access
- Check permissions
- Provide diagnostic output

## 17. References

- Zod documentation: https://zod.dev
- Google Sheets API: https://developers.google.com/sheets/api
- Next.js environment variables: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
- Google Cloud Service Accounts: https://cloud.google.com/iam/docs/service-accounts
- Google Sheets API Node.js Client: https://github.com/googleapis/google-api-nodejs-client
