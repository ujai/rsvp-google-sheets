# Bug Fix Specification: Runtime ZodError - Missing Google Sheets Environment Variables

**Document Version**: 1.0
**Created**: 2025-11-27
**Last Updated**: 2025-11-27
**Status**: Ready for Implementation
**Priority**: Critical
**Severity**: P0 - Application Startup Blocker

---

## 1. Executive Summary

### 1.1 Problem Statement

The Majlis RSVP application fails to start due to missing Google Sheets environment variables, resulting in a runtime ZodError during the module evaluation phase. This blocks the entire application initialization in both development and production environments.

**Error**: `ZodError: Required environment variables are missing: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID`

**Root Cause**: The environment validation schema in `lib/env.ts` executes synchronously at module import time, throwing an error before the Next.js application can initialize when required Google Sheets credentials are not configured.

### 1.2 Solution Overview

Implement a comprehensive solution that maintains strict validation of Google Sheets credentials (as a MANDATORY requirement) while providing clear setup documentation, improved error messaging, and graceful runtime error handling. The solution will support dual environment configurations (development and production) with separate Google Sheets for each environment.

**Key Principles**:
- Google Sheets integration remains MANDATORY (not optional)
- Strict startup validation preserved (credentials must be present)
- Separate dev/prod Google Sheets with distinct configurations
- Clear, actionable error messages for configuration issues
- Graceful degradation for runtime API failures (post-startup)

### 1.3 Impact Assessment

**Current Impact**:
- Complete blockage of local development environment
- Application cannot start without credentials configured
- No graceful error recovery or helpful guidance
- Developer unable to proceed without external documentation

**User Impact**:
- **Development**: Blocks all local development until credentials configured
- **Production**: Not currently deployed; will affect production if credentials missing
- **End Users**: No impact (internal configuration issue)

**Business Impact**:
- Development velocity: HIGH (complete blocker)
- Production readiness: MEDIUM (prevents deployment without credentials)
- User experience: NONE (pre-deployment issue)

---

## 2. Technical Context

### 2.1 Current Architecture

**Application Stack**:
- **Framework**: Next.js 15 (App Router, React Server Components)
- **Language**: TypeScript (Strict Mode)
- **Validation**: Zod schema validation
- **Database**: Google Sheets API (googleapis npm package)
- **Runtime**: Node.js v18+

**Validation Flow**:
```
Application Startup
  → lib/env.ts imports
    → envSchema.parse(process.env) executes (line 82)
      → If validation fails: ZodError thrown
        → Application startup aborted
      → If validation succeeds: Application continues
```

**Module Import Chain**:
```
app/page.tsx
  → components/server/hero-section.tsx
    → lib/constants.ts
      → lib/env.ts (validation executes here)
```

### 2.2 Environment Variables Architecture

**Required Variables** (Google Sheets):
1. `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email for authentication
2. `GOOGLE_PRIVATE_KEY` - PEM-formatted private key for service account
3. `GOOGLE_SHEET_ID` - Target spreadsheet identifier

**Optional Variables**:
- `NEXT_PUBLIC_APP_URL` - Public application URL (default: http://localhost:3000)
- `RSVP_DEADLINE` - RSVP deadline timestamp (default: 2026-01-10T23:59:59+08:00)
- `EDIT_TOKEN_SECRET` - Secret for edit token generation
- `UPSTASH_REDIS_REST_URL` - Redis URL for rate limiting (optional)
- `UPSTASH_REDIS_REST_TOKEN` - Redis token for rate limiting (optional)

**Validation Rules** (from `lib/env.ts`):
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Must be valid email, non-empty
- `GOOGLE_PRIVATE_KEY`: Min 100 chars, must contain "BEGIN PRIVATE KEY" and "END PRIVATE KEY"
- `GOOGLE_SHEET_ID`: 40-100 chars, alphanumeric with dash/underscore only

### 2.3 Google Sheets Integration

**API Client**: googleapis v140+ (Google APIs Node.js Client)

**Functions** (from `lib/google-sheets.ts`):
- `getGoogleSheetsClient()` - Initializes authenticated client
- `appendRSVPToSheet()` - Creates new RSVP entry
- `findRSVPByToken()` - Retrieves RSVP by edit token
- `updateRSVPInSheet()` - Updates existing RSVP
- `initializeSheet()` - Sets up sheet headers (one-time)

**Sheet Structure**:
- Sheet Name: "RSVPs" (case-sensitive)
- Columns: A=Timestamp, B=Nama, C=Status Kehadiran, D=Bilangan Orang, E=Edit Link

**API Quotas**:
- Read requests: 100 per 100 seconds per user
- Write requests: 100 per 100 seconds per user

### 2.4 Current Error Behavior

**Startup Validation Error**:
```
Error: ZodError
Location: lib/env.ts:82
Trigger: envSchema.parse(process.env)
Result: Application fails to start, displays error stack trace
```

**Runtime API Errors** (current handling):
- 401/403: "Google Sheets API authentication failed"
- 404: "Google Sheets spreadsheet not found"
- 429: "Google Sheets API quota exceeded"
- ETIMEDOUT: "Google Sheets API request timed out"
- Other: "Failed to [operation] data in Google Sheets"

---

## 3. Requirements Specification

### 3.1 Functional Requirements

#### FR-1: Environment Variable Validation
**Priority**: MUST HAVE
**Description**: Application must validate Google Sheets credentials at startup and fail fast with clear error messages if credentials are missing or invalid.

**Acceptance Criteria**:
- [ ] Application validates all required Google Sheets environment variables at startup
- [ ] Validation uses Zod schema with strict type checking
- [ ] Missing variables trigger immediate application failure
- [ ] Invalid variable formats trigger immediate application failure
- [ ] Error messages clearly identify which variables are missing/invalid
- [ ] Error messages provide actionable guidance for resolution

#### FR-2: Dual Environment Support
**Priority**: MUST HAVE
**Description**: Application must support separate Google Sheets configurations for development and production environments.

**Acceptance Criteria**:
- [ ] `.env.local` file used for development configuration (not committed to git)
- [ ] Production environment variables configured via deployment platform
- [ ] Documentation explains how to create and configure two separate Google Sheets
- [ ] Each environment uses its own Google Sheet ID
- [ ] Credentials are environment-specific (dev credentials in .env.local, prod in platform)
- [ ] No cross-environment data leakage (dev writes to dev sheet, prod writes to prod sheet)

#### FR-3: Setup Documentation
**Priority**: MUST HAVE
**Description**: Comprehensive documentation must guide developers through Google Sheets setup and credential configuration.

**Acceptance Criteria**:
- [ ] Step-by-step guide for creating Google Cloud project
- [ ] Step-by-step guide for enabling Google Sheets API
- [ ] Step-by-step guide for creating service account
- [ ] Step-by-step guide for generating credentials JSON
- [ ] Step-by-step guide for creating development Google Sheet
- [ ] Step-by-step guide for creating production Google Sheet
- [ ] Instructions for sharing sheets with service account
- [ ] Instructions for extracting and configuring environment variables
- [ ] Troubleshooting guide for common configuration errors
- [ ] Screenshots or examples where helpful

#### FR-4: Environment Variable Template
**Priority**: MUST HAVE
**Description**: Provide a `.env.example` template with clear comments explaining each variable.

**Acceptance Criteria**:
- [ ] `.env.example` file exists in project root
- [ ] All required Google Sheets variables listed with examples
- [ ] All optional variables listed with defaults
- [ ] Clear comments explain purpose of each variable
- [ ] Comments explain format requirements (e.g., \n in private key)
- [ ] Instructions reference setup documentation
- [ ] File is committed to git (no sensitive values)

#### FR-5: Improved Error Messages
**Priority**: MUST HAVE
**Description**: When environment validation fails, display clear, actionable error messages that guide developers to resolution.

**Acceptance Criteria**:
- [ ] Error message clearly states configuration is missing
- [ ] Error message lists specifically which variables are missing/invalid
- [ ] Error message provides 3-step resolution path:
  1. Copy .env.example to .env.local
  2. Follow setup guide
  3. Configure credentials
- [ ] Error message includes path to setup documentation
- [ ] Error formatting is readable (not raw stack trace)
- [ ] Error appears in console during development
- [ ] Error appears in logs during production builds

#### FR-6: Runtime Error Handling
**Priority**: MUST HAVE
**Description**: After successful startup, handle Google Sheets API failures gracefully without crashing the application.

**Acceptance Criteria**:
- [ ] API errors caught and logged server-side
- [ ] API errors do not crash the application
- [ ] UI displays event details even when API is unavailable
- [ ] RSVP form hidden when API is unavailable
- [ ] User-friendly message shown when form unavailable
- [ ] Different error messages for different failure types (auth, quota, network)
- [ ] Errors logged with sufficient context for debugging
- [ ] No sensitive credential information exposed in errors

#### FR-7: Credential Validation Helper
**Priority**: SHOULD HAVE
**Description**: Provide a helper script to validate Google Sheets credentials are working correctly.

**Acceptance Criteria**:
- [ ] Script tests Google Sheets API connection
- [ ] Script verifies service account authentication
- [ ] Script checks sheet access permissions
- [ ] Script validates sheet structure (RSVPs tab exists)
- [ ] Script provides clear success/failure output
- [ ] Script includes diagnostic information on failures
- [ ] Script runnable via npm script: `npm run validate-sheets`

#### FR-8: Health Check Endpoint
**Priority**: SHOULD HAVE
**Description**: Expose an API endpoint that reports Google Sheets integration health status.

**Acceptance Criteria**:
- [ ] Endpoint: `/api/health/sheets`
- [ ] Endpoint tests Google Sheets API connectivity
- [ ] Endpoint returns JSON with status: "healthy" | "unhealthy"
- [ ] Endpoint returns detailed error information when unhealthy
- [ ] Endpoint does not expose sensitive credentials
- [ ] Endpoint has appropriate rate limiting
- [ ] Endpoint accessible only in non-production or with authentication

### 3.2 Non-Functional Requirements

#### NFR-1: Security
**Priority**: MUST HAVE

**Requirements**:
- [ ] Private keys never committed to git (.env.local in .gitignore)
- [ ] Credentials never logged or exposed in error messages
- [ ] Service account has minimal permissions (Google Sheets access only)
- [ ] Environment variables are server-side only (not prefixed with NEXT_PUBLIC_)
- [ ] Timing-safe token comparison to prevent timing attacks
- [ ] Input sanitization for all user data written to sheets
- [ ] Formula injection prevention in sheet writes

**Security Best Practices**:
- Separate credentials for dev and prod reduces risk
- Service account permissions scoped to specific sheets only
- Credential rotation procedures documented
- No credentials in client-side code or browser
- Secure credential storage on deployment platform

#### NFR-2: Performance
**Priority**: SHOULD HAVE

**Requirements**:
- [ ] Environment validation adds <50ms to startup time
- [ ] API timeouts set to 10 seconds (prevents hanging)
- [ ] Error messages generated quickly (<100ms)
- [ ] Health check responds within 5 seconds
- [ ] Validation helper runs within 10 seconds

**Performance Considerations**:
- Google Sheets API quotas: 100 requests per 100 seconds
- In-memory rate limiting for development
- Redis rate limiting for production
- Response caching where appropriate
- Pagination for large datasets

#### NFR-3: Reliability
**Priority**: MUST HAVE

**Requirements**:
- [ ] Startup validation is deterministic (no race conditions)
- [ ] Error messages are consistent across environments
- [ ] Runtime errors do not prevent subsequent requests
- [ ] API retry logic for transient failures
- [ ] Graceful degradation when API unavailable

**Reliability Measures**:
- Comprehensive error handling in all API functions
- Logging with sufficient context for debugging
- No silent failures (all errors logged)
- Clear distinction between startup and runtime errors

#### NFR-4: Maintainability
**Priority**: SHOULD HAVE

**Requirements**:
- [ ] Code comments explain validation logic
- [ ] Comments explain dual-environment setup
- [ ] Documentation kept up-to-date with code changes
- [ ] Error messages reference current documentation paths
- [ ] Validation schema is easily extensible
- [ ] TypeScript types ensure type safety

**Maintainability Practices**:
- Clear separation of concerns (validation, API client, error handling)
- Consistent error message format
- Centralized constants for sheet structure
- Type-safe environment access via validated `env` object

#### NFR-5: Usability
**Priority**: MUST HAVE

**Requirements**:
- [ ] Setup documentation is beginner-friendly
- [ ] Error messages are non-technical where possible
- [ ] Resolution steps are numbered and actionable
- [ ] Documentation includes visual aids (screenshots)
- [ ] Common issues have troubleshooting entries
- [ ] New developers can set up environment in <30 minutes

---

## 4. Detailed Design

### 4.1 Improved Error Messaging

**Location**: `lib/env.ts`

**Current Code** (line 82):
```typescript
export const env = envSchema.parse(process.env)
```

**Proposed Enhancement**:
```typescript
/**
 * Parse and validate environment variables
 * Throws ZodError with enhanced error messages if validation fails
 */
function validateEnvironment() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('\n' + '='.repeat(70));
      console.error('CONFIGURATION ERROR: Missing Google Sheets Credentials');
      console.error('='.repeat(70));
      console.error('\nThe application requires Google Sheets environment variables.\n');

      console.error('Missing or invalid variables:');
      error.issues.forEach(issue => {
        const field = issue.path.join('.');
        console.error(`  ❌ ${field}: ${issue.message}`);
      });

      console.error('\n' + '-'.repeat(70));
      console.error('Resolution Steps:');
      console.error('-'.repeat(70));
      console.error('1. Copy .env.example to .env.local:');
      console.error('   $ cp .env.example .env.local\n');
      console.error('2. Follow the Google Sheets setup guide:');
      console.error('   docs/google-sheets-setup.md\n');
      console.error('3. Configure your credentials in .env.local\n');
      console.error('For troubleshooting, see: docs/troubleshooting.md');
      console.error('='.repeat(70) + '\n');
    }
    throw error;
  }
}

export const env = validateEnvironment();
```

**Benefits**:
- Clear visual separation with borders
- Lists specific missing variables
- Provides 3-step resolution path
- References documentation
- Maintains strict validation (still throws)

### 4.2 Environment Variable Template

**File**: `.env.example` (already exists at `.env.local.example`)

**Proposed Action**: Rename `.env.local.example` to `.env.example` for consistency with Next.js conventions, or keep both files.

**Content Structure** (already comprehensive in existing file):
```env
# ==============================================================================
# Google Sheets API Configuration (REQUIRED)
# ==============================================================================

GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# ==============================================================================
# Application Configuration (OPTIONAL)
# ==============================================================================

NEXT_PUBLIC_APP_URL=http://localhost:3000
RSVP_DEADLINE=2026-01-10T23:59:59+08:00
EDIT_TOKEN_SECRET=your_random_secret_string_here_minimum_32_characters
```

**Enhancement Needed**: Add section for production configuration guidance:
```env
# ==============================================================================
# Development vs Production Configuration
# ==============================================================================
# DEVELOPMENT:
#   - Use .env.local (not committed to git)
#   - Create a separate "Development" Google Sheet
#   - Use development service account credentials
#
# PRODUCTION:
#   - Configure environment variables in deployment platform (Vercel, etc.)
#   - Create a separate "Production" Google Sheet
#   - Use production service account credentials
#   - Never commit production credentials to git
#
# See docs/environment-configuration.md for detailed guidance
# ==============================================================================
```

### 4.3 Setup Documentation Structure

**File**: `docs/google-sheets-setup.md` (to be created)

**Outline**:
```markdown
# Google Sheets Setup Guide

## Prerequisites
- Google account
- Access to Google Cloud Console
- Terminal access for running scripts

## Step 1: Create Google Cloud Project
1.1. Navigate to Google Cloud Console
1.2. Click "Select a project" → "New Project"
1.3. Enter project name: "majlis-rsvp-dev" (or your choice)
1.4. Click "Create"
1.5. Wait for project creation (30-60 seconds)

[Screenshot: Project creation dialog]

## Step 2: Enable Google Sheets API
2.1. In Cloud Console, navigate to "APIs & Services" → "Library"
2.2. Search for "Google Sheets API"
2.3. Click "Google Sheets API" in results
2.4. Click "Enable" button
2.5. Wait for API to enable (5-10 seconds)

[Screenshot: Enable API screen]

## Step 3: Create Service Account
3.1. Navigate to "APIs & Services" → "Credentials"
3.2. Click "Create Credentials" → "Service Account"
3.3. Service account details:
     - Name: majlis-rsvp-service-account
     - ID: (auto-generated)
     - Description: Service account for RSVP Google Sheets access
3.4. Click "Create and Continue"
3.5. Grant role: "Editor" (for sheet access)
3.6. Click "Continue" → "Done"

[Screenshot: Service account creation]

## Step 4: Generate Service Account Key
4.1. Click on the newly created service account email
4.2. Navigate to "Keys" tab
4.3. Click "Add Key" → "Create new key"
4.4. Select "JSON" format
4.5. Click "Create"
4.6. JSON file downloads automatically
4.7. Save this file securely (contains credentials)

[Screenshot: Key creation]

## Step 5: Create Development Google Sheet
5.1. Go to Google Sheets: https://sheets.google.com
5.2. Click "+ Blank" to create new spreadsheet
5.3. Rename to "Majlis RSVP - Development"
5.4. Rename first tab to "RSVPs" (case-sensitive)
5.5. Copy Sheet ID from URL:
     https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
5.6. Save Sheet ID for later use

[Screenshot: Sheet with RSVPs tab]

## Step 6: Share Sheet with Service Account
6.1. In your Google Sheet, click "Share" button
6.2. Paste service account email from JSON file:
     Format: xxxxx@xxxxx.iam.gserviceaccount.com
6.3. Change permission to "Editor"
6.4. Uncheck "Notify people"
6.5. Click "Share"

[Screenshot: Share dialog]

## Step 7: Configure Environment Variables
7.1. Copy .env.example to .env.local:
     ```bash
     cp .env.example .env.local
     ```
7.2. Open .env.local in text editor
7.3. Extract values from downloaded JSON file:
     - client_email → GOOGLE_SERVICE_ACCOUNT_EMAIL
     - private_key → GOOGLE_PRIVATE_KEY (keep \n characters)
7.4. Set GOOGLE_SHEET_ID to Sheet ID from Step 5.5
7.5. Save .env.local

Example:
```env
GOOGLE_SHEET_ID=1abc123def456ghi789jkl
GOOGLE_SERVICE_ACCOUNT_EMAIL=majlis-rsvp@my-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n"
```

## Step 8: Initialize Sheet Headers
8.1. Run initialization script:
     ```bash
     npm run init-sheet
     ```
8.2. Verify output: "Sheet initialized successfully"
8.3. Check Google Sheet: Headers should appear in row 1

[Screenshot: Sheet with headers]

## Step 9: Verify Setup
9.1. Start development server:
     ```bash
     npm run dev
     ```
9.2. Application should start without errors
9.3. Navigate to http://localhost:3000
9.4. Submit test RSVP
9.5. Verify data appears in Google Sheet

## Production Setup
For production environment, repeat Steps 5-7 with:
- New Google Sheet named "Majlis RSVP - Production"
- Different Sheet ID
- Configure in deployment platform (not .env.local)

See docs/environment-configuration.md for production details.

## Troubleshooting
See docs/troubleshooting.md for common issues and solutions.
```

### 4.4 Environment Configuration Guide

**File**: `docs/environment-configuration.md` (to be created)

**Outline**:
```markdown
# Environment Configuration Guide

## Overview
This application supports separate configurations for development and production environments, each with its own Google Sheet.

## Configuration Files

### Development: .env.local
- **Location**: Project root
- **Purpose**: Local development configuration
- **Git Status**: NOT committed (in .gitignore)
- **Variables**: All development credentials

Create from template:
```bash
cp .env.example .env.local
```

### Production: Platform Environment Variables
- **Location**: Deployment platform (Vercel, Railway, etc.)
- **Purpose**: Production configuration
- **Git Status**: Not in repository
- **Variables**: All production credentials

## Dual Google Sheets Setup

### Why Two Sheets?
- **Isolation**: Development testing doesn't affect production data
- **Safety**: Mistakes in dev don't impact live users
- **Security**: Separate credentials reduce risk
- **Testing**: Can test with realistic data without side effects

### Development Sheet
- **Name**: "Majlis RSVP - Development"
- **Purpose**: Local development and testing
- **Configured In**: .env.local
- **Who Has Access**: Developers only

### Production Sheet
- **Name**: "Majlis RSVP - Production"
- **Purpose**: Live event RSVPs
- **Configured In**: Platform environment variables
- **Who Has Access**: Production service account only

## Variable Reference

### Required Variables

#### GOOGLE_SHEET_ID
- **Type**: String (40-100 characters)
- **Format**: Alphanumeric with dashes/underscores
- **Example**: 1abc123def456ghi789jkl012mno345pqr678stu
- **Where**: From Google Sheet URL
- **Development**: Dev sheet ID
- **Production**: Prod sheet ID

#### GOOGLE_SERVICE_ACCOUNT_EMAIL
- **Type**: Email address
- **Format**: service-account-name@project-id.iam.gserviceaccount.com
- **Example**: majlis-rsvp@my-project-123456.iam.gserviceaccount.com
- **Where**: From service account JSON file (client_email field)
- **Development**: Dev service account
- **Production**: Prod service account (can be same or different)

#### GOOGLE_PRIVATE_KEY
- **Type**: PEM-formatted private key
- **Format**: Multiline string with \n line breaks, wrapped in quotes
- **Example**: "-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
- **Where**: From service account JSON file (private_key field)
- **Security**: Never commit, never log, never expose
- **Development**: Dev service account key
- **Production**: Prod service account key

### Optional Variables

#### NEXT_PUBLIC_APP_URL
- **Type**: URL
- **Default**: http://localhost:3000
- **Development**: http://localhost:3000
- **Production**: https://your-domain.com (must update)
- **Usage**: Generating edit links

#### RSVP_DEADLINE
- **Type**: ISO 8601 datetime with timezone
- **Default**: 2026-01-10T23:59:59+08:00
- **Format**: YYYY-MM-DDTHH:mm:ss+HH:mm
- **Usage**: RSVP form deadline enforcement

#### EDIT_TOKEN_SECRET
- **Type**: String (32+ characters recommended)
- **Default**: Random if not set
- **Generation**: `openssl rand -hex 32`
- **Usage**: Edit token generation/validation
- **Security**: Must be same across all instances

#### UPSTASH_REDIS_REST_URL
- **Type**: URL
- **Required**: No (falls back to in-memory)
- **Usage**: Distributed rate limiting
- **Recommended**: Production only

#### UPSTASH_REDIS_REST_TOKEN
- **Type**: String
- **Required**: No (with UPSTASH_REDIS_REST_URL)
- **Usage**: Redis authentication
- **Recommended**: Production only

## Setting Up Production

### Option 1: Vercel
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables:
   - Go to Project Settings → Environment Variables
   - Add each variable with production values
   - Set scope to "Production"
4. Deploy

### Option 2: Railway
1. Create new project from GitHub
2. Configure environment variables:
   - Go to Variables tab
   - Add each variable with production values
3. Deploy

### Option 3: Docker/VPS
1. Create .env.production file (not committed)
2. Configure environment variables
3. Load in docker-compose or systemd service
4. Deploy

## Security Best Practices

### DO:
✅ Keep .env.local in .gitignore
✅ Use separate credentials for dev and prod
✅ Rotate credentials periodically
✅ Use strong EDIT_TOKEN_SECRET (32+ characters)
✅ Configure Redis for production rate limiting
✅ Limit service account permissions to specific sheets
✅ Review audit logs periodically

### DON'T:
❌ Commit .env.local to git
❌ Share credentials via email or Slack
❌ Use production credentials in development
❌ Log credential values in application code
❌ Expose credentials in client-side code
❌ Grant "Owner" role to service account
❌ Share private keys in screenshots

## Credential Rotation

If credentials are compromised:

### Development Credentials
1. Go to Google Cloud Console
2. Delete compromised service account key
3. Generate new service account key
4. Update .env.local with new key
5. Restart development server

### Production Credentials
1. Go to Google Cloud Console
2. Create new service account key
3. Update platform environment variables
4. Delete compromised key
5. Redeploy application
6. Verify application works
7. Monitor logs for authentication errors

## Troubleshooting

### "Missing environment variables" error
- Check .env.local exists in project root
- Verify all required variables are set
- Check for typos in variable names
- Ensure no extra spaces around = sign

### "Invalid credentials" error
- Check GOOGLE_PRIVATE_KEY has \n characters
- Ensure private key is wrapped in quotes
- Verify service account email is correct
- Check service account has Editor role

### Production environment not working
- Verify environment variables set in platform
- Check variable names match exactly
- Ensure production sheet is shared with service account
- Review deployment logs for errors

For more issues, see docs/troubleshooting.md
```

### 4.5 Runtime Error Handling

**Current State**: API functions in `lib/google-sheets.ts` already have comprehensive error handling with try-catch blocks and specific error types.

**Enhancement Needed**: Graceful UI degradation in components

**Location**: Components that use RSVP form (e.g., `app/page.tsx`, `components/client/rsvp-form.tsx`)

**Proposed Pattern**:
```typescript
// In Server Component (app/page.tsx)
async function checkGoogleSheetsHealth(): Promise<boolean> {
  try {
    // Attempt to read from sheets (lightweight check)
    const sheets = getGoogleSheetsClient();
    await sheets.spreadsheets.get({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      fields: 'spreadsheetId', // Minimal data
    });
    return true;
  } catch (error) {
    console.error('[Health Check] Google Sheets API unavailable:', error);
    return false;
  }
}

// In page component
export default async function Home() {
  const isAPIHealthy = await checkGoogleSheetsHealth();

  return (
    <main>
      <HeroSection />
      <EventDetails />
      {isAPIHealthy ? (
        <RSVPForm />
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p>Sistem RSVP tidak tersedia buat masa ini.</p>
          <p>Sila hubungi penganjur untuk maklumat kehadiran.</p>
        </div>
      )}
    </main>
  );
}
```

**Benefits**:
- Application doesn't crash if API unavailable
- Users can still see event details
- Clear message about RSVP unavailability
- Maintains user experience even during outages

### 4.6 Validation Helper Script

**File**: `scripts/validate-credentials.ts` (to be created)

**Purpose**: Test Google Sheets connection and diagnose issues

**Implementation**:
```typescript
#!/usr/bin/env tsx

import { google } from 'googleapis';
import { env } from '../lib/env';

/**
 * Validation Helper Script
 *
 * Tests Google Sheets API connection and validates setup
 * Run with: npm run validate-sheets
 */

async function validateCredentials() {
  console.log('\n=== Google Sheets Credential Validation ===\n');

  // Step 1: Check environment variables are loaded
  console.log('Step 1: Checking environment variables...');
  try {
    console.log(`  ✅ GOOGLE_SHEET_ID: ${env.GOOGLE_SHEET_ID.substring(0, 10)}...`);
    console.log(`  ✅ GOOGLE_SERVICE_ACCOUNT_EMAIL: ${env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
    console.log(`  ✅ GOOGLE_PRIVATE_KEY: [${env.GOOGLE_PRIVATE_KEY.length} characters]`);
  } catch (error) {
    console.error('  ❌ Environment validation failed');
    process.exit(1);
  }

  // Step 2: Initialize Google Sheets client
  console.log('\nStep 2: Initializing Google Sheets API client...');
  let sheets;
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    sheets = google.sheets({ version: 'v4', auth, timeout: 10000 });
    console.log('  ✅ API client initialized');
  } catch (error) {
    console.error('  ❌ Failed to initialize API client:', error);
    process.exit(1);
  }

  // Step 3: Test authentication
  console.log('\nStep 3: Testing authentication...');
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      fields: 'spreadsheetId,properties.title',
    });

    console.log('  ✅ Authentication successful');
    console.log(`  📄 Spreadsheet: "${response.data.properties?.title}"`);
    console.log(`  🆔 Sheet ID: ${response.data.spreadsheetId}`);
  } catch (error: any) {
    console.error('  ❌ Authentication failed');

    if (error.code === 404) {
      console.error('     Sheet not found. Check GOOGLE_SHEET_ID.');
    } else if (error.code === 403) {
      console.error('     Permission denied. Share sheet with service account:');
      console.error(`     ${env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
    } else {
      console.error(`     Error: ${error.message}`);
    }

    process.exit(1);
  }

  // Step 4: Check RSVPs sheet exists
  console.log('\nStep 4: Checking RSVPs sheet...');
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      fields: 'sheets.properties',
    });

    const rsvsSheet = response.data.sheets?.find(
      sheet => sheet.properties?.title === 'RSVPs'
    );

    if (rsvsSheet) {
      console.log('  ✅ "RSVPs" sheet found');
    } else {
      console.log('  ⚠️  "RSVPs" sheet not found');
      console.log('     Run: npm run init-sheet');
    }
  } catch (error) {
    console.error('  ❌ Failed to check sheets:', error);
    process.exit(1);
  }

  // Step 5: Test read access
  console.log('\nStep 5: Testing read access...');
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      range: 'RSVPs!A1:E1',
    });

    const headers = response.data.values?.[0];
    if (headers && headers.length === 5) {
      console.log('  ✅ Read access confirmed');
      console.log(`  📊 Headers: ${headers.join(', ')}`);
    } else {
      console.log('  ⚠️  Headers not set');
      console.log('     Run: npm run init-sheet');
    }
  } catch (error) {
    console.error('  ❌ Read access failed:', error);
    process.exit(1);
  }

  // Step 6: Test write access
  console.log('\nStep 6: Testing write access...');
  try {
    // Append test row
    await sheets.spreadsheets.values.append({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      range: 'RSVPs!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toISOString(),
          '[TEST] Validation Script',
          'Tidak Hadir',
          '',
          '[TEST]',
        ]],
      },
    });

    console.log('  ✅ Write access confirmed');
    console.log('  ℹ️  Test row appended to sheet (can be deleted)');
  } catch (error) {
    console.error('  ❌ Write access failed:', error);
    process.exit(1);
  }

  // Success summary
  console.log('\n' + '='.repeat(50));
  console.log('✅ All validation checks passed!');
  console.log('='.repeat(50));
  console.log('\nYour Google Sheets setup is working correctly.');
  console.log('You can now run: npm run dev\n');
}

// Run validation
validateCredentials().catch((error) => {
  console.error('\n❌ Validation failed:', error);
  process.exit(1);
});
```

**Add to package.json**:
```json
{
  "scripts": {
    "validate-sheets": "tsx scripts/validate-credentials.ts"
  }
}
```

### 4.7 Health Check Endpoint

**File**: `app/api/health/sheets/route.ts` (to be created)

**Implementation**:
```typescript
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { env } from '@/lib/env';

/**
 * Google Sheets Health Check Endpoint
 *
 * GET /api/health/sheets
 *
 * Returns JSON with Google Sheets API health status
 * Used for monitoring and diagnostics
 */
export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({
      version: 'v4',
      auth,
      timeout: 5000, // 5 second timeout for health check
    });

    // Lightweight check: just get sheet metadata
    const response = await sheets.spreadsheets.get({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      fields: 'spreadsheetId,properties.title',
    });

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      sheet: {
        id: response.data.spreadsheetId,
        title: response.data.properties?.title,
      },
    });
  } catch (error: any) {
    console.error('[Health Check] Google Sheets API check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: {
          code: error.code,
          message: error.message,
          type: getErrorType(error),
        },
      },
      { status: 503 }
    );
  }
}

function getErrorType(error: any): string {
  if (error.code === 401 || error.code === 403) {
    return 'authentication';
  } else if (error.code === 404) {
    return 'not_found';
  } else if (error.code === 429) {
    return 'quota_exceeded';
  } else if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
    return 'timeout';
  } else {
    return 'unknown';
  }
}
```

---

## 5. Implementation Plan

### 5.1 Phase 1: Immediate Fix (Unblock Development)
**Timeline**: 0.5-1 day
**Goal**: Get developer's environment working

#### Tasks:
1. **Improve Error Messages** (1-2 hours)
   - Modify `lib/env.ts` validation error handling
   - Add clear, formatted error output
   - Include resolution steps in error message
   - Test error display in development

2. **Create/Enhance .env.example** (30 minutes)
   - Verify existing `.env.local.example` is comprehensive
   - Add production configuration guidance section
   - Ensure all variables documented
   - Commit to git

3. **Create Setup Documentation** (2-3 hours)
   - Write `docs/google-sheets-setup.md`
   - Include step-by-step instructions with screenshots
   - Cover development environment setup
   - Include initialization steps

4. **Guide User Through Setup** (1-2 hours)
   - Walk through documentation with user
   - Help configure .env.local
   - Run init-sheet script
   - Verify application starts successfully

**Deliverables**:
- ✅ Application starts in development
- ✅ Clear error messages if misconfigured
- ✅ Setup documentation complete
- ✅ Developer can proceed with development

### 5.2 Phase 2: Environment Separation Documentation
**Timeline**: 0.5 day
**Goal**: Document production setup process

#### Tasks:
1. **Environment Configuration Guide** (1-2 hours)
   - Write `docs/environment-configuration.md`
   - Explain dev vs prod separation
   - Document both Google Sheets setup
   - Include platform-specific deployment guides

2. **Production Setup Section** (1 hour)
   - Add production instructions to setup guide
   - Document creating second Google Sheet
   - Explain platform environment variable configuration
   - Include security best practices

3. **Test Documentation** (1 hour)
   - Follow docs to set up second environment
   - Verify clarity and completeness
   - Fix any gaps or ambiguities

**Deliverables**:
- ✅ Environment configuration documentation
- ✅ Production setup instructions
- ✅ Dual-sheet setup documented
- ✅ Deployment platform guidance

### 5.3 Phase 3: Runtime Error Handling
**Timeline**: 1-1.5 days
**Goal**: Graceful degradation when API fails

#### Tasks:
1. **Health Check Function** (1-2 hours)
   - Create `checkGoogleSheetsHealth()` function
   - Add lightweight API test
   - Return boolean status
   - Add caching to reduce API calls

2. **UI Component Updates** (2-3 hours)
   - Modify `app/page.tsx` to check API health
   - Add conditional rendering for RSVP form
   - Create unavailability message component
   - Test both healthy and unhealthy states

3. **Error Boundaries** (1-2 hours)
   - Add React Error Boundary if needed
   - Handle unexpected errors gracefully
   - Display user-friendly error messages
   - Log errors server-side

4. **Testing** (2-3 hours)
   - Test with invalid credentials (should show message)
   - Test with quota exceeded (should show message)
   - Test with network timeout (should show message)
   - Test with valid credentials (should show form)
   - Verify event details always visible

**Deliverables**:
- ✅ Application doesn't crash on API failures
- ✅ Event details always visible
- ✅ RSVP form hidden when API unavailable
- ✅ Clear message when form unavailable

### 5.4 Phase 4: Developer Experience Improvements
**Timeline**: 0.5-1 day
**Goal**: Better tooling and diagnostics

#### Tasks:
1. **Validation Helper Script** (2-3 hours)
   - Create `scripts/validate-credentials.ts`
   - Add 6-step validation process
   - Provide clear success/failure output
   - Add to package.json scripts

2. **Health Check Endpoint** (1-2 hours)
   - Create `app/api/health/sheets/route.ts`
   - Return JSON status
   - Include diagnostic information
   - Test endpoint

3. **Troubleshooting Guide** (1-2 hours)
   - Create `docs/troubleshooting.md`
   - Document common issues and solutions
   - Add platform-specific issues
   - Include debugging tips

4. **Code Comments** (1 hour)
   - Add comments explaining dual-environment setup
   - Document validation logic
   - Explain error handling strategy

**Deliverables**:
- ✅ `npm run validate-sheets` command
- ✅ `/api/health/sheets` endpoint
- ✅ Troubleshooting documentation
- ✅ Improved code documentation

---

## 6. Testing Strategy

### 6.1 Unit Testing

#### Test: Environment Validation - Missing Variables
**File**: `lib/env.test.ts`
```typescript
test('should throw ZodError when Google Sheets variables missing', () => {
  const invalidEnv = { NODE_ENV: 'test' };
  expect(() => envSchema.parse(invalidEnv)).toThrow(ZodError);
});
```

#### Test: Environment Validation - Invalid Format
```typescript
test('should throw error when GOOGLE_PRIVATE_KEY is invalid', () => {
  const invalidEnv = {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@example.com',
    GOOGLE_PRIVATE_KEY: 'invalid-key',
    GOOGLE_SHEET_ID: 'test-sheet-id',
  };
  expect(() => envSchema.parse(invalidEnv)).toThrow();
});
```

#### Test: Environment Validation - Valid Variables
```typescript
test('should pass validation with all required variables', () => {
  const validEnv = {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
    GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
    GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
    NODE_ENV: 'test',
  };
  expect(() => envSchema.parse(validEnv)).not.toThrow();
});
```

### 6.2 Integration Testing

#### Test: Application Startup WITH Credentials
**Description**: Verify application starts successfully when all credentials configured
**Steps**:
1. Configure valid credentials in test environment
2. Start application
3. Verify no errors thrown
4. Verify homepage loads

**Expected**: Application starts, no errors, homepage accessible

#### Test: Application Startup WITHOUT Credentials
**Description**: Verify application fails with clear error when credentials missing
**Steps**:
1. Remove Google Sheets credentials from environment
2. Attempt to start application
3. Capture error output
4. Verify error message format

**Expected**: Application fails, clear error message with resolution steps displayed

#### Test: Google Sheets API - Development Sheet
**Description**: Verify API operations work with development Google Sheet
**Steps**:
1. Configure development credentials
2. Submit test RSVP
3. Verify data written to dev sheet
4. Retrieve RSVP by token
5. Update RSVP
6. Verify changes in dev sheet

**Expected**: All operations succeed, data in development sheet only

#### Test: Google Sheets API - Production Sheet
**Description**: Verify API operations work with production Google Sheet
**Steps**:
1. Configure production credentials
2. Submit test RSVP
3. Verify data written to prod sheet
4. Retrieve RSVP by token
5. Update RSVP
6. Verify changes in prod sheet

**Expected**: All operations succeed, data in production sheet only

#### Test: Graceful Degradation - API Unavailable
**Description**: Verify UI handles API unavailability gracefully
**Steps**:
1. Configure invalid credentials (simulate API failure)
2. Load homepage
3. Verify event details visible
4. Verify RSVP form hidden
5. Verify unavailability message displayed

**Expected**: Page loads, event details shown, form hidden, message displayed

### 6.3 Manual Testing

#### Test: Fresh Development Setup
**Description**: Follow documentation to set up development environment from scratch
**Steps**:
1. Clone repository to fresh directory
2. Follow `docs/google-sheets-setup.md` exactly
3. Create Google Cloud project
4. Enable API
5. Create service account
6. Generate credentials
7. Create development Google Sheet
8. Configure .env.local
9. Run init-sheet
10. Start development server

**Success Criteria**:
- [ ] Documentation is clear and complete
- [ ] No steps are missing or ambiguous
- [ ] Application starts successfully
- [ ] Can submit and view test RSVP
- [ ] Setup time < 30 minutes

#### Test: Production Environment Configuration
**Description**: Set up production environment following documentation
**Steps**:
1. Create production Google Sheet
2. Generate production credentials
3. Configure environment variables in deployment platform
4. Deploy application
5. Submit test RSVP
6. Verify data in production sheet only

**Success Criteria**:
- [ ] Production sheet separate from development
- [ ] Credentials configured correctly
- [ ] Application deploys successfully
- [ ] RSVPs written to production sheet

#### Test: Error Message Clarity
**Description**: Verify error messages are clear and actionable
**Steps**:
1. Remove GOOGLE_SHEET_ID from .env.local
2. Start application
3. Review error message
4. Follow resolution steps in error message
5. Verify application starts after following steps

**Success Criteria**:
- [ ] Error message clearly identifies missing variable
- [ ] Resolution steps are numbered and actionable
- [ ] Documentation paths are correct
- [ ] Following steps resolves the error

#### Test: Validation Helper Script
**Description**: Verify validation script correctly diagnoses issues
**Steps**:
1. Run `npm run validate-sheets` with valid credentials
2. Verify all checks pass
3. Remove GOOGLE_SHEET_ID
4. Run validation script
5. Verify it detects missing variable
6. Misconfigure sheet name
7. Run validation script
8. Verify it detects missing RSVPs sheet

**Success Criteria**:
- [ ] Script detects all configuration issues
- [ ] Error messages are specific and helpful
- [ ] Script passes with valid configuration

#### Test: Dual Environment Independence
**Description**: Verify dev and prod environments are truly separate
**Steps**:
1. Configure development environment
2. Submit test RSVP
3. Verify data in development sheet
4. Switch to production configuration
5. Submit test RSVP
6. Verify data in production sheet only
7. Verify development sheet unchanged

**Success Criteria**:
- [ ] Data written to correct sheet per environment
- [ ] No cross-environment data leakage
- [ ] Edit links work for respective environments

---

## 7. Acceptance Criteria

### 7.1 Must Have (Phase 1 & 2)

- [ ] **AC-1**: Application starts successfully when Google Sheets credentials are properly configured in .env.local
- [ ] **AC-2**: Application fails fast with clear error message when credentials are missing or invalid
- [ ] **AC-3**: Error message lists specifically which variables are missing or invalid
- [ ] **AC-4**: Error message includes 3-step resolution path (copy .env.example, follow guide, configure)
- [ ] **AC-5**: Error message references correct documentation paths
- [ ] **AC-6**: `.env.example` (or `.env.local.example`) exists with all variables documented
- [ ] **AC-7**: Each variable in template has clear comment explaining purpose and format
- [ ] **AC-8**: `docs/google-sheets-setup.md` provides step-by-step setup instructions
- [ ] **AC-9**: Setup documentation covers: Google Cloud project, API enablement, service account, credentials, sheet creation, sharing, environment configuration
- [ ] **AC-10**: Setup documentation includes screenshots or visual aids
- [ ] **AC-11**: `docs/environment-configuration.md` explains development vs production setup
- [ ] **AC-12**: Configuration guide documents how to create two separate Google Sheets
- [ ] **AC-13**: Configuration guide documents .env.local for development
- [ ] **AC-14**: Configuration guide documents platform environment variables for production
- [ ] **AC-15**: Strict validation remains in place (credentials always required at startup)

### 7.2 Must Have (Phase 3)

- [ ] **AC-16**: Runtime errors from Google Sheets API are caught and logged server-side
- [ ] **AC-17**: Runtime errors do not crash the application
- [ ] **AC-18**: UI displays event details even when API is unavailable
- [ ] **AC-19**: RSVP form is hidden when API is unavailable
- [ ] **AC-20**: User-friendly message displayed when RSVP form unavailable
- [ ] **AC-21**: Different error messages for different failure types (auth, quota, timeout)
- [ ] **AC-22**: No sensitive credential information exposed in error messages or logs

### 7.3 Should Have (Phase 4)

- [ ] **AC-23**: `npm run validate-sheets` command exists and runs successfully
- [ ] **AC-24**: Validation script tests API connection and reports clear success/failure
- [ ] **AC-25**: Validation script checks authentication, sheet access, read/write permissions
- [ ] **AC-26**: Health check endpoint `/api/health/sheets` returns JSON status
- [ ] **AC-27**: Health check endpoint reports "healthy" or "unhealthy" with details
- [ ] **AC-28**: `docs/troubleshooting.md` documents common configuration issues
- [ ] **AC-29**: Troubleshooting guide includes solutions for: missing credentials, permission denied, invalid format, quota exceeded
- [ ] **AC-30**: Code includes comments explaining dual-environment setup

### 7.4 Nice to Have (Future)

- [ ] **AC-31**: Admin UI panel showing Google Sheets connection status
- [ ] **AC-32**: Automated test suite verifies Google Sheets integration
- [ ] **AC-33**: CLI tool automates Google Sheets setup and credential generation
- [ ] **AC-34**: Template Google Sheet that can be copied for new environments
- [ ] **AC-35**: Monitoring/alerting for Google Sheets API failures in production

---

## 8. Dependencies and Prerequisites

### 8.1 External Dependencies

#### Google Services
- **Google Cloud Platform** account
- **Google Sheets API** enabled in GCP project
- **Service Account** with credentials
- **Two Google Sheets**: Development and Production

#### npm Packages (Already Installed)
- `googleapis` v140+ - Google APIs Node.js Client
- `zod` v3+ - Schema validation
- `next` v15+ - Next.js framework
- `react` v19+ - React library

### 8.2 Internal Dependencies

#### Existing Files
- `lib/env.ts` - Environment validation (to be modified)
- `lib/google-sheets.ts` - API client functions (already has error handling)
- `.env.local.example` - Template (to be enhanced)
- `scripts/init-sheet.ts` - Sheet initialization (already exists)

### 8.3 New Files Required

#### Documentation
- `docs/google-sheets-setup.md` - Setup guide
- `docs/environment-configuration.md` - Environment configuration
- `docs/troubleshooting.md` - Troubleshooting guide

#### Scripts
- `scripts/validate-credentials.ts` - Validation helper

#### API Routes
- `app/api/health/sheets/route.ts` - Health check endpoint

### 8.4 Skills Required

- **Google Cloud Platform**: Project creation, API enablement, service accounts
- **Next.js**: Environment variables, API routes, Server Components
- **TypeScript**: Type safety, error handling
- **Google Sheets API**: Authentication, read/write operations
- **Technical Writing**: Clear, step-by-step documentation

---

## 9. Risk Assessment

### 9.1 Technical Risks

#### Risk: Documentation Gaps
**Probability**: Medium
**Impact**: High
**Mitigation**:
- Review documentation with fresh eyes (user testing)
- Include screenshots for visual guidance
- Provide troubleshooting section for common issues
- Iterate based on developer feedback

#### Risk: Google Cloud Platform Complexity
**Probability**: Medium
**Impact**: Medium
**Mitigation**:
- Step-by-step instructions with no assumed knowledge
- Screenshots of each GCP console screen
- Common pitfall warnings (e.g., sheet sharing)
- Link to official Google documentation

#### Risk: Credential Exposure
**Probability**: Low
**Impact**: Critical
**Mitigation**:
- Strong warnings in documentation about not committing credentials
- `.env.local` in .gitignore
- Example files contain no real credentials
- Code review checklist includes credential check

#### Risk: Runtime Degradation Impact
**Probability**: Low
**Impact**: Medium
**Mitigation**:
- Clear user messaging when form unavailable
- Event details always visible (core information preserved)
- Monitoring/alerting for API failures
- SLA for restoring service

### 9.2 Operational Risks

#### Risk: Production Misconfiguration
**Probability**: Medium
**Impact**: High
**Mitigation**:
- Separate documentation section for production
- Validation checklist before deployment
- Health check endpoint for verification
- Monitoring dashboard showing API status

#### Risk: Credential Rotation Complexity
**Probability**: Low
**Impact**: Medium
**Mitigation**:
- Document rotation procedures
- Test rotation in development first
- Zero-downtime rotation strategy
- Backup credentials during rotation

#### Risk: API Quota Exhaustion
**Probability**: Low
**Impact**: Medium
**Mitigation**:
- Rate limiting implemented
- Quota monitoring in GCP console
- Caching where appropriate
- Clear error messages on quota exceeded

---

## 10. Timeline and Milestones

### 10.1 Estimated Timeline

**Total Duration**: 2.5-4 days

| Phase | Tasks | Duration | Dependencies |
|-------|-------|----------|--------------|
| Phase 1 | Immediate fix, documentation, setup | 0.5-1 day | None |
| Phase 2 | Environment separation docs | 0.5 day | Phase 1 |
| Phase 3 | Runtime error handling | 1-1.5 days | Phase 1 |
| Phase 4 | Developer tooling | 0.5-1 day | Phase 1, 2 |

**Minimum Viable Fix** (Phase 1 only): 0.5-1 day

### 10.2 Milestones

#### Milestone 1: Developer Unblocked
**Target**: End of Phase 1
**Criteria**:
- Developer's environment working
- Application starts successfully
- Setup documentation complete
- Developer can proceed with feature work

#### Milestone 2: Production Ready
**Target**: End of Phase 2
**Criteria**:
- Production setup documented
- Dual-environment process validated
- Security best practices documented
- Deployment checklist available

#### Milestone 3: Error Resilience
**Target**: End of Phase 3
**Criteria**:
- Application handles runtime API failures gracefully
- UI degrades gracefully (shows event, hides form)
- All error types handled
- User experience maintained during outages

#### Milestone 4: Developer Experience Optimized
**Target**: End of Phase 4
**Criteria**:
- Validation helper available
- Health check endpoint functional
- Troubleshooting guide complete
- Setup can be done independently

### 10.3 Critical Path

```
Phase 1: Immediate Fix
  ↓
Milestone 1: Developer Unblocked ← BLOCKING (highest priority)
  ↓
Phase 2: Environment Docs (parallel with Phase 3)
  ↓
Phase 3: Runtime Handling (parallel with Phase 2)
  ↓
Milestone 2: Production Ready
  ↓
Milestone 3: Error Resilience
  ↓
Phase 4: Developer Tooling
  ↓
Milestone 4: DX Optimized
```

**Highest Priority**: Phase 1 → Milestone 1 (unblock development)
**Parallel Work**: Phase 2 and 3 can run concurrently after Phase 1

---

## 11. Success Metrics

### 11.1 Quantitative Metrics

#### Developer Productivity
- **Setup Time**: Fresh environment setup < 30 minutes (from clone to running)
- **Error Resolution Time**: Configuration error to resolution < 5 minutes
- **Time to First RSVP**: < 45 minutes (including setup, init, test)

#### Application Reliability
- **Startup Success Rate**: 100% when credentials configured
- **Runtime Error Recovery**: 0 application crashes from API errors
- **Graceful Degradation**: Event details visible in 100% of API failure cases

#### Documentation Quality
- **Setup Success Rate**: 100% of developers can set up independently
- **Documentation Clarity**: 0 unanswered questions in setup process
- **Troubleshooting Coverage**: 90%+ of issues covered in troubleshooting guide

### 11.2 Qualitative Metrics

#### Developer Experience
- Developers can set up environment without assistance
- Error messages are clear and actionable
- Documentation is comprehensive and easy to follow
- Validation tools provide helpful diagnostics

#### User Experience
- End users see event details even during API outages
- Clear messaging when RSVP unavailable
- No confusion or technical errors exposed

#### Code Quality
- Type-safe environment access
- Comprehensive error handling
- Clear code comments
- Maintainable architecture

---

## 12. Future Enhancements

### 12.1 Short-Term (Next Sprint)

1. **Admin Dashboard**
   - View all RSVPs
   - Export to CSV/PDF
   - Connection status indicator
   - Real-time sync status

2. **Enhanced Monitoring**
   - Application Performance Monitoring (APM)
   - Google Sheets API usage tracking
   - Error rate alerts
   - Uptime monitoring

3. **Automated Testing**
   - Integration test suite for Google Sheets
   - E2E tests for RSVP flow
   - Credential validation in CI/CD

### 12.2 Medium-Term (Next Month)

1. **Setup Automation**
   - CLI tool for Google Sheets setup
   - Automated GCP project creation
   - Template sheet generation
   - Credential configuration wizard

2. **Backup and Recovery**
   - Automated sheet backups
   - Point-in-time recovery
   - Data export/import tools
   - Disaster recovery procedures

3. **Advanced Error Handling**
   - Retry logic with exponential backoff
   - Circuit breaker pattern
   - Fallback to cached data
   - Queue for failed writes

### 12.3 Long-Term (Future Releases)

1. **Multi-Database Support**
   - Optional PostgreSQL backend
   - MongoDB integration
   - Airtable as alternative
   - Database abstraction layer

2. **Offline Support**
   - Service worker for offline access
   - Local storage caching
   - Sync when connection restored
   - Offline-first architecture

3. **Advanced Features**
   - Real-time RSVP updates (WebSocket)
   - SMS notifications via Twilio
   - Email confirmations via SendGrid
   - Calendar invites (ICS files)

---

## 13. Rollback Plan

### 13.1 Rollback Triggers

- Critical error in production after deployment
- Data corruption in Google Sheets
- Security vulnerability discovered
- Application fails to start in production

### 13.2 Rollback Procedure

#### Step 1: Immediate Actions
1. Revert to previous deployment (via platform)
2. Verify application starts
3. Verify RSVP submission works
4. Notify team of rollback

#### Step 2: Investigation
1. Collect error logs
2. Review failed deployment changes
3. Identify root cause
4. Document findings

#### Step 3: Fix Forward
1. Create hotfix branch
2. Implement fix
3. Test thoroughly in staging
4. Deploy hotfix
5. Verify resolution

### 13.3 Rollback Prevention

- Comprehensive testing before deployment
- Staging environment that mirrors production
- Gradual rollout (canary deployment)
- Health check monitoring
- Automated alerts on errors

---

## 14. Maintenance and Support

### 14.1 Ongoing Maintenance

#### Weekly
- Review application logs for errors
- Monitor Google Sheets API quota usage
- Check health check endpoint status

#### Monthly
- Review and update documentation
- Audit service account permissions
- Check for googleapis package updates
- Review credential rotation schedule

#### Quarterly
- Test disaster recovery procedures
- Audit security practices
- Review and optimize API usage
- Update dependencies

### 14.2 Support Procedures

#### Developer Support
- **Documentation**: Primary reference in `/docs` directory
- **Troubleshooting Guide**: Common issues and solutions
- **Validation Script**: Diagnose configuration issues
- **Health Check**: Verify API connectivity

#### Production Support
- **Monitoring**: Health check endpoint + platform monitoring
- **Alerting**: API failure alerts, quota warnings
- **Escalation**: On-call engineer for critical issues
- **Runbook**: Step-by-step recovery procedures

### 14.3 Documentation Updates

Documentation must be updated when:
- Google Cloud Console UI changes
- API endpoints change
- New environment variables added
- Deployment process changes
- Common issues identified

**Process**:
1. Identify outdated section
2. Update documentation
3. Test updated instructions
4. Commit changes
5. Notify team

---

## 15. Appendices

### 15.1 Glossary

- **Service Account**: Google Cloud identity for applications (not users)
- **PEM Format**: Privacy-Enhanced Mail format for private keys
- **Zod**: TypeScript-first schema validation library
- **Environment Variable**: Configuration value stored outside code
- **Graceful Degradation**: System continues functioning with reduced features
- **Rate Limiting**: Restricting number of API requests over time
- **Health Check**: Endpoint that reports system status
- **Edit Token**: Unique identifier for editing RSVP entries

### 15.2 References

#### Google Documentation
- Google Sheets API: https://developers.google.com/sheets/api
- Service Accounts: https://cloud.google.com/iam/docs/service-accounts
- Google Auth Library: https://github.com/googleapis/google-auth-library-nodejs

#### Framework Documentation
- Next.js Environment Variables: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
- Zod Documentation: https://zod.dev
- React Error Boundaries: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

#### Project Files
- `/README.md` - Project overview and quick start
- `/lib/env.ts` - Environment validation schema
- `/lib/google-sheets.ts` - Google Sheets API client
- `/.env.local.example` - Environment variable template

### 15.3 Related Specifications

- **Feature Spec**: RSVP System (parent feature)
- **Security Spec**: Data Protection and Input Validation
- **Deployment Spec**: Production Deployment Checklist
- **Monitoring Spec**: Application Health Monitoring

### 15.4 Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-27 | Claude Code | Initial specification based on user requirements |

---

## 16. Approval and Sign-off

### 16.1 Stakeholder Approval

| Role | Name | Approval Date | Signature |
|------|------|---------------|-----------|
| Product Owner | [Name] | | |
| Tech Lead | [Name] | | |
| Developer | [Name] | | |
| QA Lead | [Name] | | |

### 16.2 Implementation Authorization

- [ ] Requirements reviewed and approved
- [ ] Technical design reviewed and approved
- [ ] Timeline and resources confirmed
- [ ] Risk assessment reviewed
- [ ] Security considerations approved
- [ ] Ready for implementation

**Authorization Date**: _______________
**Authorized By**: _______________

---

**Document End**

*This specification is a living document and may be updated as requirements evolve or new information becomes available. All changes should be documented in the Change Log section.*
