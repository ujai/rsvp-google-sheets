# Environment Configuration Guide

Complete guide to configuring development and production environments for the Majlis RSVP application with dual Google Sheets architecture.

**Purpose**: Understand how to properly separate development and production environments to ensure data isolation, security, and safe testing.

---

## Table of Contents

1. [Overview](#overview)
2. [Configuration Files](#configuration-files)
3. [Dual Google Sheets Architecture](#dual-google-sheets-architecture)
4. [Environment Variables Reference](#environment-variables-reference)
5. [Setting Up Development Environment](#setting-up-development-environment)
6. [Setting Up Production Environment](#setting-up-production-environment)
7. [Platform-Specific Configuration](#platform-specific-configuration)
8. [Security Best Practices](#security-best-practices)
9. [Credential Rotation](#credential-rotation)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The Majlis RSVP application supports separate configurations for development and production environments. Each environment uses its own Google Sheet to ensure complete data isolation.

### Why Separate Environments?

**Data Isolation**: Test RSVPs and real RSVPs are completely separate.

**Safety**: Development mistakes and testing don't affect production data.

**Security**: Separate credentials reduce the impact of credential exposure.

**Testing**: Developers can test freely with realistic data without consequences.

### Architecture Summary

```
Development Environment
├── Configuration: .env.local (local file, not committed)
├── Google Sheet: "Majlis RSVP - Development"
├── Credentials: Development service account
└── Access: Developers only

Production Environment
├── Configuration: Platform environment variables
├── Google Sheet: "Majlis RSVP - Production"
├── Credentials: Production service account (can be same or different)
└── Access: Live users
```

---

## Configuration Files

### Development: .env.local

**Location**: Project root directory (`your-project-folder/.env.local`)

**Purpose**: Local development configuration

**Git Status**: NOT committed (listed in `.gitignore`)

**Usage**: Automatically loaded by Next.js during development

**Creation**:
```bash
cd your-project-folder
cp .env.example .env.local
```

**Security**: Never commit this file. Never share it. Never include it in screenshots.

### Production: Platform Environment Variables

**Location**: Deployment platform settings (Vercel, Railway, Docker, etc.)

**Purpose**: Production configuration

**Git Status**: Not in repository at all

**Usage**: Configured through platform UI or CLI

**Security**: Platform-managed, encrypted at rest, only accessible to authorized users

### Template: .env.example

**Location**: Project root directory

**Purpose**: Template showing all available configuration options

**Git Status**: Committed to repository (contains no sensitive data)

**Usage**: Reference for setting up new environments

---

## Dual Google Sheets Architecture

### Why Two Separate Google Sheets?

The application requires two completely separate Google Sheets:

1. **Development Sheet**: For local development and testing
2. **Production Sheet**: For real event RSVPs

**Benefits**:

- **Isolation**: Zero risk of test data mixing with real RSVPs
- **Safety**: Development errors cannot affect production data
- **Security**: Separate sheets can have different access controls
- **Testing**: Full testing capability without side effects
- **Parallel Work**: Multiple developers can test without conflicts

### Sheet Structure

Both sheets must have identical structure:

**Sheet Name**: `RSVPs` (exact name, case-sensitive)

**Columns**:
- Column A: Timestamp
- Column B: Nama
- Column C: Status Kehadiran
- Column D: Bilangan Orang
- Column E: Edit Link

### Development Sheet

**Naming Convention**: "Majlis RSVP - Development"

**Purpose**:
- Local development testing
- Feature development
- Bug reproduction
- Integration testing

**Who Creates**: Developers

**Who Has Access**:
- Development service account (Editor)
- Developers (Owner/Editor)

**Data Lifecycle**: Can be cleared/reset as needed

### Production Sheet

**Naming Convention**: "Majlis RSVP - Production"

**Purpose**:
- Live event RSVPs
- Real user data
- Production analytics

**Who Creates**: DevOps/Admin

**Who Has Access**:
- Production service account (Editor)
- Limited admin access
- No developer direct access

**Data Lifecycle**: Permanent, backed up regularly

---

## Environment Variables Reference

### Required Variables

These three variables are REQUIRED for the application to start.

#### GOOGLE_SHEET_ID

**Description**: Unique identifier for the Google Sheet storing RSVP data

**Type**: String (40-100 characters)

**Format**: Alphanumeric with dashes and underscores

**Example**: `1abc123def456ghi789jkl012mno345pqr678stu`

**How to Find**:
1. Open your Google Sheet in browser
2. Look at URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
3. Copy the portion between `/d/` and `/edit`

**Development Value**: Sheet ID from development Google Sheet

**Production Value**: Sheet ID from production Google Sheet (DIFFERENT from dev)

**Validation Rules**:
- Minimum 40 characters
- Maximum 100 characters
- Only alphanumeric, dash (-), and underscore (_) characters

---

#### GOOGLE_SERVICE_ACCOUNT_EMAIL

**Description**: Email address of the Google Cloud service account

**Type**: Email address

**Format**: `service-account-name@project-id.iam.gserviceaccount.com`

**Example**: `majlis-rsvp-dev@my-project-123456.iam.gserviceaccount.com`

**How to Find**:
1. Open credentials JSON file downloaded from Google Cloud Console
2. Find `client_email` field
3. Copy the complete email address

**Development Value**: Development service account email

**Production Value**: Production service account email (can be same or different)

**Validation Rules**:
- Must be valid email format
- Must end with `.iam.gserviceaccount.com`
- Non-empty string

---

#### GOOGLE_PRIVATE_KEY

**Description**: PEM-formatted private key for service account authentication

**Type**: Multi-line string with escaped newlines

**Format**: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`

**Example**:
```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCB...\n-----END PRIVATE KEY-----\n"
```

**How to Find**:
1. Open credentials JSON file
2. Find `private_key` field
3. Copy ENTIRE value including quotes and `\n` characters

**CRITICAL FORMAT REQUIREMENTS**:
- Must include quotes around the key
- Must preserve all `\n` characters (these represent newlines)
- Must start with `"-----BEGIN PRIVATE KEY-----\n`
- Must end with `\n-----END PRIVATE KEY-----\n"`
- Do NOT add actual line breaks (keep as single line)
- Do NOT remove any characters

**Development Value**: Private key from development service account

**Production Value**: Private key from production service account

**Validation Rules**:
- Minimum 100 characters
- Must contain `BEGIN PRIVATE KEY`
- Must contain `END PRIVATE KEY`

**Security**: NEVER log, NEVER commit, NEVER share, NEVER expose

---

### Optional Variables

These variables have sensible defaults but should be configured for production.

#### NEXT_PUBLIC_APP_URL

**Description**: Public URL where the application is accessible

**Type**: URL string

**Default**: `http://localhost:3000`

**Development**: `http://localhost:3000`

**Production**: `https://your-domain.com` (MUST update)

**Usage**:
- Generating edit links in RSVP emails/responses
- Canonical URL for SEO
- CORS configuration

**Example**:
```env
# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production
NEXT_PUBLIC_APP_URL=https://rsvp.majlis.com
```

**Note**: Variable is prefixed with `NEXT_PUBLIC_` so it's accessible in browser (not sensitive).

---

#### RSVP_DEADLINE

**Description**: Date and time when RSVP submissions close

**Type**: ISO 8601 datetime string with timezone

**Default**: `2026-01-10T23:59:59+08:00`

**Format**: `YYYY-MM-DDTHH:mm:ss±HH:mm`

**Usage**:
- Form displays countdown
- Submissions rejected after deadline
- Edit still allowed after deadline

**Examples**:
```env
# Malaysia Time (GMT+8)
RSVP_DEADLINE=2026-01-10T23:59:59+08:00

# UTC
RSVP_DEADLINE=2026-01-10T15:59:59+00:00

# Singapore Time (GMT+8)
RSVP_DEADLINE=2026-01-10T23:59:59+08:00
```

**Development**: Can use far future date for testing

**Production**: Set to actual event RSVP deadline

---

#### EDIT_TOKEN_SECRET

**Description**: Secret key for generating and validating edit tokens

**Type**: Random string (minimum 32 characters recommended)

**Default**: Randomly generated if not set (NOT RECOMMENDED for production)

**Security Level**: HIGH - Protects RSVP edit functionality

**How to Generate**:
```bash
# Option 1: Using openssl
openssl rand -hex 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 3: Using online generator
# Visit: https://1password.com/password-generator/
# Settings: 64 characters, letters and numbers
```

**Example**:
```env
EDIT_TOKEN_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**CRITICAL**:
- MUST be the same across all application instances (servers)
- MUST be different between development and production
- MUST be at least 32 characters (64 recommended)
- Change this if you suspect compromise

**Development**: Use test secret

**Production**: Use strong random secret, store securely

---

#### UPSTASH_REDIS_REST_URL

**Description**: REST API URL for Upstash Redis (distributed rate limiting)

**Type**: URL string

**Default**: None (falls back to in-memory rate limiting)

**Required**: No, but recommended for production

**Usage**: Distributed rate limiting across multiple server instances

**Example**:
```env
UPSTASH_REDIS_REST_URL=https://us1-xxxxx.upstash.io
```

**Development**: Optional (in-memory rate limiting is sufficient)

**Production**: Recommended for multi-instance deployments

**How to Get**:
1. Create free account at [Upstash](https://upstash.com)
2. Create Redis database
3. Copy REST URL from dashboard

---

#### UPSTASH_REDIS_REST_TOKEN

**Description**: Authentication token for Upstash Redis

**Type**: String token

**Default**: None

**Required**: Yes, if `UPSTASH_REDIS_REST_URL` is set

**Usage**: Authenticate Redis API requests

**Example**:
```env
UPSTASH_REDIS_REST_TOKEN=AYIxASQgNT...
```

**Security**: Keep confidential, rotate if exposed

**How to Get**: From Upstash dashboard (same place as REST URL)

---

## Setting Up Development Environment

Complete step-by-step guide for development environment configuration.

### Prerequisites

- Node.js v18+ installed
- Google Cloud account
- Project cloned locally
- Terminal access

### Step 1: Create Development Google Sheet

Follow the detailed instructions in [Google Sheets Setup Guide](./google-sheets-setup.md) to:

1. Create Google Cloud project
2. Enable Google Sheets API
3. Create service account
4. Download credentials JSON
5. Create Google Sheet named "Majlis RSVP - Development"
6. Share sheet with service account (Editor permission)
7. Copy Sheet ID

### Step 2: Create .env.local File

```bash
cd your-project-folder
cp .env.example .env.local
```

### Step 3: Configure Required Variables

Open `.env.local` in your text editor and set:

```env
# Google Sheets Configuration (REQUIRED)
GOOGLE_SHEET_ID=your_development_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

Extract values from your credentials JSON file:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` = JSON field `client_email`
- `GOOGLE_PRIVATE_KEY` = JSON field `private_key` (copy exactly with quotes and `\n`)

### Step 4: Configure Optional Variables (Recommended)

```env
# Application Configuration (OPTIONAL)
NEXT_PUBLIC_APP_URL=http://localhost:3000
RSVP_DEADLINE=2026-12-31T23:59:59+08:00
EDIT_TOKEN_SECRET=development_secret_min_32_chars_long_random_string
```

Generate `EDIT_TOKEN_SECRET`:
```bash
openssl rand -hex 32
```

### Step 5: Initialize Sheet

```bash
npm run init-sheet
```

Expected output:
```
Sheet initialized successfully!
Headers have been added to the RSVPs sheet.
```

### Step 6: Verify Setup

```bash
# Start development server
npm run dev

# In another terminal, run validation
npm run validate-sheets
```

Expected: Application starts without errors, validation passes all checks.

### Development Environment Complete

You can now:
- Access application at http://localhost:3000
- Submit test RSVPs
- Edit RSVPs via edit links
- Test features safely

All data goes to development sheet only.

---

## Setting Up Production Environment

Production setup uses platform environment variables instead of `.env.local`.

### Prerequisites

- Development environment working
- Deployment platform account (Vercel, Railway, etc.)
- Production domain configured (optional but recommended)

### Step 1: Create Production Google Sheet

**IMPORTANT**: Do NOT use the development sheet for production.

1. Create new Google Sheet
2. Name it: "Majlis RSVP - Production"
3. Rename first tab to: `RSVPs`
4. Share with service account (same or different from dev)
5. Copy production Sheet ID (DIFFERENT from development)

**Option A**: Use same service account as development
- Simpler setup
- Share both sheets with same service account
- Use different Sheet IDs

**Option B**: Use separate service account for production
- Better security isolation
- Create new service account in Google Cloud
- Download separate credentials JSON
- Share only production sheet with production service account

### Step 2: Choose Deployment Platform

Select your deployment platform:
- [Vercel Setup](#vercel)
- [Railway Setup](#railway)
- [Docker/VPS Setup](#dockervps)

### Step 3: Configure Environment Variables

Set the same variables as development, but with production values:

**Required**:
- `GOOGLE_SHEET_ID` - Production Sheet ID (different from dev)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Production service account email
- `GOOGLE_PRIVATE_KEY` - Production private key

**Recommended**:
- `NEXT_PUBLIC_APP_URL` - Production domain (e.g., https://rsvp.majlis.com)
- `EDIT_TOKEN_SECRET` - Production secret (different from dev, 64+ chars)
- `RSVP_DEADLINE` - Actual event deadline
- `UPSTASH_REDIS_REST_URL` - Redis URL for distributed rate limiting
- `UPSTASH_REDIS_REST_TOKEN` - Redis token

### Step 4: Deploy Application

Deploy using your platform's deployment method:
- Git push (Vercel, Railway auto-deploy)
- CLI command
- Manual deployment

### Step 5: Initialize Production Sheet

**Option A**: Run init script in production (if platform supports)

**Option B**: Manually add headers to production sheet:
1. Open production Google Sheet
2. In row 1, add headers:
   - A1: Timestamp
   - B1: Nama
   - C1: Status Kehadiran
   - D1: Bilangan Orang
   - E1: Edit Link

### Step 6: Verify Production Setup

1. Visit production URL
2. Submit test RSVP
3. Verify data appears in production sheet (NOT dev sheet)
4. Check edit link works
5. Verify health check: `https://your-domain.com/api/health/sheets`

### Step 7: Monitor and Maintain

- Monitor application logs
- Check Google Sheets API quota usage
- Review RSVP submissions periodically
- Keep credentials secure

---

## Platform-Specific Configuration

### Vercel

#### Setting Environment Variables via Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. For each variable:
   - Click **Add New**
   - Enter variable name (e.g., `GOOGLE_SHEET_ID`)
   - Enter value
   - Select environment: **Production** (or All if same for all environments)
   - Click **Save**

#### Setting Environment Variables via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Set variables (will prompt for values)
vercel env add GOOGLE_SHEET_ID production
vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL production
vercel env add GOOGLE_PRIVATE_KEY production
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add EDIT_TOKEN_SECRET production
```

#### Deploying

```bash
# Link to project (first time)
vercel link

# Deploy to production
vercel --prod
```

#### Notes
- Environment variables are encrypted at rest
- Changes require redeployment
- Can have different values per environment (Preview, Production)

---

### Railway

#### Setting Environment Variables via Dashboard

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project
3. Navigate to **Variables** tab
4. Click **+ New Variable** for each:
   - Variable name: `GOOGLE_SHEET_ID`
   - Value: your production sheet ID
   - Click **Add**
5. Railway auto-redeploys on variable changes

#### Setting Environment Variables via CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Set variables
railway variables set GOOGLE_SHEET_ID=your_production_sheet_id
railway variables set GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service@account.com
railway variables set GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
railway variables set NEXT_PUBLIC_APP_URL=https://your-domain.com
railway variables set EDIT_TOKEN_SECRET=your_production_secret
```

#### Deploying

```bash
# Deploy
railway up
```

#### Notes
- Automatic deployments from GitHub
- Variables are instantly available (triggers redeploy)
- Supports multiple environments

---

### Docker/VPS

#### Option A: Using .env.production File

**IMPORTANT**: Do NOT commit this file to git.

1. Create `.env.production` on server:
```bash
nano .env.production
```

2. Add all environment variables:
```env
GOOGLE_SHEET_ID=production_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=service@account.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_APP_URL=https://your-domain.com
EDIT_TOKEN_SECRET=production_secret_64_chars_long
RSVP_DEADLINE=2026-01-10T23:59:59+08:00
```

3. Use with Docker Compose:
```yaml
# docker-compose.yml
services:
  app:
    build: .
    env_file:
      - .env.production
    ports:
      - "3000:3000"
```

4. Deploy:
```bash
docker-compose up -d
```

#### Option B: Using Docker Environment Variables

```bash
docker run -d \
  -p 3000:3000 \
  -e GOOGLE_SHEET_ID="production_sheet_id" \
  -e GOOGLE_SERVICE_ACCOUNT_EMAIL="service@account.com" \
  -e GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n" \
  -e NEXT_PUBLIC_APP_URL="https://your-domain.com" \
  -e EDIT_TOKEN_SECRET="production_secret" \
  your-image-name
```

#### Option C: Using systemd Service

Create service file:
```bash
sudo nano /etc/systemd/system/majlis-rsvp.service
```

```ini
[Unit]
Description=Majlis RSVP Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/majlis-rsvp
Environment="NODE_ENV=production"
Environment="GOOGLE_SHEET_ID=production_sheet_id"
Environment="GOOGLE_SERVICE_ACCOUNT_EMAIL=service@account.com"
Environment="GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
Environment="NEXT_PUBLIC_APP_URL=https://your-domain.com"
Environment="EDIT_TOKEN_SECRET=production_secret"
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable majlis-rsvp
sudo systemctl start majlis-rsvp
```

---

## Security Best Practices

### DO ✅

**Credential Management**:
- ✅ Keep `.env.local` in `.gitignore`
- ✅ Use separate credentials for development and production
- ✅ Rotate credentials every 90 days (quarterly)
- ✅ Use strong random secrets (64+ characters for `EDIT_TOKEN_SECRET`)
- ✅ Store production credentials in platform-managed secrets

**Access Control**:
- ✅ Limit service account permissions to specific sheets only
- ✅ Use "Editor" role (not "Owner") for service accounts
- ✅ Review Google Cloud audit logs periodically
- ✅ Restrict production sheet access to essential personnel

**Rate Limiting**:
- ✅ Configure Redis for production rate limiting
- ✅ Monitor Google Sheets API quota usage
- ✅ Set up alerts for quota warnings

**Monitoring**:
- ✅ Monitor application logs for authentication errors
- ✅ Set up uptime monitoring for production
- ✅ Review RSVP submissions for suspicious patterns
- ✅ Use health check endpoint for monitoring

**Development Practices**:
- ✅ Test in development environment first
- ✅ Use different Sheet IDs for dev/prod
- ✅ Verify changes in development before deploying
- ✅ Keep documentation up to date

---

### DON'T ❌

**Credential Security**:
- ❌ Commit `.env.local` to git
- ❌ Share credentials via email, Slack, or messaging
- ❌ Use production credentials in development
- ❌ Log credential values in application code
- ❌ Expose credentials in client-side code
- ❌ Include credentials in screenshots or screen recordings
- ❌ Store credentials in shared documents

**Access Control**:
- ❌ Grant "Owner" role to service accounts
- ❌ Share private keys publicly
- ❌ Use same credentials across environments
- ❌ Give developers direct access to production sheet

**Development Practices**:
- ❌ Test directly in production
- ❌ Use production Sheet ID in development
- ❌ Mix development and production data
- ❌ Skip validation steps

**API Usage**:
- ❌ Make unnecessary API calls
- ❌ Bypass rate limiting
- ❌ Ignore quota warnings
- ❌ Hard-code Sheet IDs in code

---

## Credential Rotation

Regular credential rotation improves security.

### When to Rotate

**Scheduled**:
- Every 90 days (quarterly) as best practice
- When team members leave
- During security audits

**Immediate**:
- Credentials accidentally committed to git
- Credentials shared insecurely (email, chat)
- Credentials exposed in logs or screenshots
- Suspected security breach
- Service account compromise

### Development Credentials Rotation

**Impact**: Low (only affects local development)

**Procedure**:

1. **Create New Key**:
   - Go to Google Cloud Console
   - Navigate to Service Accounts
   - Select your development service account
   - Keys tab → Add Key → Create new key (JSON)
   - Download new credentials JSON

2. **Update Local Configuration**:
   - Open `.env.local`
   - Update `GOOGLE_PRIVATE_KEY` with new key
   - Save file

3. **Test New Credentials**:
   ```bash
   npm run validate-sheets
   npm run dev
   ```

4. **Delete Old Key**:
   - In Google Cloud Console
   - Find old key in service account Keys tab
   - Click on key ID → Delete
   - Confirm deletion

5. **Notify Team**:
   - Inform other developers to rotate their credentials
   - Share setup documentation link

**Downtime**: None (local development only)

---

### Production Credentials Rotation

**Impact**: HIGH (affects live application)

**Procedure** (Zero-Downtime):

1. **Create New Key** (Don't Delete Old Yet):
   - Go to Google Cloud Console
   - Service Accounts → Production service account
   - Keys tab → Add Key → Create new key (JSON)
   - Download new credentials JSON
   - Service account now has TWO valid keys

2. **Update Platform Variables**:
   - Access deployment platform (Vercel/Railway/etc.)
   - Update environment variables:
     - `GOOGLE_PRIVATE_KEY` = new key value
   - Save changes

3. **Trigger Deployment**:
   - Platform auto-redeploys with new credentials
   - Old credentials still valid (fallback)

4. **Verify New Deployment**:
   ```bash
   # Check health endpoint
   curl https://your-domain.com/api/health/sheets

   # Submit test RSVP
   # Verify appears in production sheet
   ```

5. **Monitor for Errors**:
   - Watch application logs for 15-30 minutes
   - Check for authentication errors
   - Verify RSVPs still working

6. **Delete Old Key** (After Verification):
   - In Google Cloud Console
   - Service account Keys tab
   - Identify old key (by creation date)
   - Delete old key
   - Now only new key is valid

7. **Final Verification**:
   - Submit another test RSVP
   - Confirm application still works
   - Check logs for any errors

**Downtime**: Zero if procedure followed correctly

**Rollback Plan**: If new key fails, old key still works until step 6

---

### Emergency Rotation (Credential Compromise)

If credentials are compromised (committed to public repo, leaked, etc.):

**Immediate Actions** (Within 15 minutes):

1. **Revoke Compromised Credentials**:
   - Go to Google Cloud Console IMMEDIATELY
   - Find compromised service account key
   - Delete key (this breaks current application)

2. **Create New Service Account** (Fresh Start):
   - Create entirely new service account
   - Generate new key
   - Share production sheet with new service account (Editor)

3. **Update Production**:
   - Update all environment variables with new credentials
   - Force redeployment
   - Verify application works

4. **Monitor**:
   - Watch audit logs for unauthorized access
   - Review recent RSVP submissions for anomalies
   - Check Google Sheet for unauthorized changes

5. **Post-Incident**:
   - Document what happened
   - Review how credentials were exposed
   - Implement preventive measures
   - Update team training

---

## Troubleshooting

### Environment Variables Not Loading

**Symptom**: Application shows "Missing credentials" error

**Diagnosis**:
```bash
# Check if .env.local exists
ls -la .env.local

# Verify variables are set (development)
npm run dev
# Look for "Environments: .env.local" in output

# Run validation
npm run validate-sheets
```

**Solutions**:
- Ensure `.env.local` is in project root (not in subdirectory)
- Check file permissions: `chmod 600 .env.local`
- Verify no typos in variable names (case-sensitive)
- Restart development server after changing `.env.local`

---

### Production Variables Not Applied

**Symptom**: Production deployment uses wrong credentials or falls back to defaults

**Diagnosis**:
- Check deployment platform variable settings
- Review deployment logs
- Check health endpoint: `curl https://domain.com/api/health/sheets`

**Solutions**:

**Vercel**:
- Verify variables are set for "Production" environment
- Check "Preview" variables aren't overriding
- Redeploy after setting variables

**Railway**:
- Verify variables in Variables tab
- Check for typos in variable names
- Railway auto-redeploys, but can trigger manually

**Docker/VPS**:
- Verify `.env.production` file exists and is readable
- Check systemd service file has correct Environment lines
- Restart service after changes: `sudo systemctl restart majlis-rsvp`

---

### Mixed Environment Data

**Symptom**: Production RSVPs appearing in development sheet or vice versa

**Cause**: Using same `GOOGLE_SHEET_ID` in both environments

**Solution**:
1. Verify you have TWO separate Google Sheets created
2. Check `.env.local` has development Sheet ID
3. Check production platform has production Sheet ID (different value)
4. Verify Sheet IDs are not swapped
5. Submit test RSVP in each environment
6. Confirm each goes to correct sheet

---

### Private Key Format Errors

**Symptom**: Authentication fails with "invalid key" error

**Diagnosis**:
```bash
# Run validation
npm run validate-sheets

# Check error message for specific format issue
```

**Common Issues & Fixes**:

1. **Missing `\n` characters**:
   - ❌ Wrong: `"-----BEGIN PRIVATE KEY-----MIIEvQ...-----END PRIVATE KEY-----"`
   - ✅ Correct: `"-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"`

2. **Missing quotes**:
   - ❌ Wrong: `GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...`
   - ✅ Correct: `GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."`

3. **Actual line breaks added**:
   - ❌ Wrong: Breaking key across multiple lines in .env.local
   - ✅ Correct: Keep as single line with `\n` characters

4. **Platform-specific handling**:
   - Some platforms escape differently
   - Try using the credentials JSON `private_key` value exactly as-is
   - For Vercel: Copy with quotes and `\n`
   - For Railway: Usually works with quotes and `\n`

**Fix**: Re-copy from credentials JSON file carefully, preserving exact format

---

### Different Sheets for Same Environment

**Symptom**: Edit links don't work, or data appears in unexpected sheet

**Cause**: `GOOGLE_SHEET_ID` changed after RSVPs were created

**Explanation**: Edit tokens include Sheet ID. If you change Sheet ID, old edit links won't work.

**Solution**:
- Don't change `GOOGLE_SHEET_ID` after RSVPs are submitted
- If must change: Old RSVPs are inaccessible (data still in old sheet)
- For fresh start: Create new sheet, update Sheet ID, clear old data

---

### Quota Exceeded Despite Rate Limiting

**Symptom**: "Quota exceeded" errors even with rate limiting

**Causes**:
- Multiple application instances sharing quota
- In-memory rate limiting doesn't work across instances
- High traffic exceeding limits

**Solutions**:

**Short-term**:
- Wait for quota to reset (100 requests per 100 seconds)
- Reduce traffic if possible

**Long-term**:
- Configure Redis rate limiting:
  ```env
  UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
  UPSTASH_REDIS_REST_TOKEN=your_token
  ```
- Implement caching for read operations
- Optimize API calls (batch where possible)
- Request quota increase from Google (if eligible)

---

## Additional Resources

### Documentation
- [Google Sheets Setup Guide](./google-sheets-setup.md) - Step-by-step setup instructions
- [Troubleshooting Guide](./troubleshooting.md) - Common issues and solutions
- [Project README](../README.md) - Project overview and quick start

### External Resources
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Railway Variables](https://docs.railway.app/develop/variables)

### Tools
- Validation Script: `npm run validate-sheets`
- Health Check: `/api/health/sheets`
- Sheet Initialization: `npm run init-sheet`

---

**Last Updated**: 2025-11-27
**Version**: 1.0

**Need Help?**

If you encounter issues not covered here:
1. Run validation script: `npm run validate-sheets`
2. Check troubleshooting guide: [docs/troubleshooting.md](./troubleshooting.md)
3. Review application logs
4. Check Google Cloud Console audit logs

---

**Security Reminder**: Never commit credentials to git. Never share credentials insecurely. Rotate credentials regularly.
