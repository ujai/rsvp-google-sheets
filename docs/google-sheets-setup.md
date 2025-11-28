# Google Sheets Setup Guide

Complete step-by-step instructions for setting up Google Sheets integration with the Majlis RSVP application.

**Time Required**: 20-30 minutes
**Difficulty**: Beginner-friendly (no prior Google Cloud experience required)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Create Google Cloud Project](#step-1-create-google-cloud-project)
3. [Step 2: Enable Google Sheets API](#step-2-enable-google-sheets-api)
4. [Step 3: Create Service Account](#step-3-create-service-account)
5. [Step 4: Generate Service Account Key](#step-4-generate-service-account-key)
6. [Step 5: Create Development Google Sheet](#step-5-create-development-google-sheet)
7. [Step 6: Share Sheet with Service Account](#step-6-share-sheet-with-service-account)
8. [Step 7: Configure Environment Variables](#step-7-configure-environment-variables)
9. [Step 8: Initialize Sheet Headers](#step-8-initialize-sheet-headers)
10. [Step 9: Verify Setup](#step-9-verify-setup)
11. [Production Setup](#production-setup)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- A Google account (personal or organization)
- Access to [Google Cloud Console](https://console.cloud.google.com)
- Node.js v18+ installed on your computer
- Terminal/command line access
- This project cloned to your local machine

---

## Step 1: Create Google Cloud Project

A Google Cloud Project is a container for all Google Cloud resources you'll use.

### 1.1. Navigate to Google Cloud Console

Open [Google Cloud Console](https://console.cloud.google.com) in your web browser and sign in with your Google account.

### 1.2. Create New Project

1. Click the **project selector** dropdown at the top of the page (next to "Google Cloud")
2. In the dialog that opens, click **"New Project"** button in the top-right corner
3. Enter project details:
   - **Project name**: `majlis-rsvp-dev` (or your preferred name)
   - **Organization**: Leave as default (No organization) unless you have one
   - **Location**: Leave as default or select your organization
4. Click **"Create"** button
5. Wait 30-60 seconds for project creation to complete

### 1.3. Select Your Project

Once created, make sure your new project is selected in the project selector dropdown.

[Screenshot: Project creation dialog showing project name field and Create button]

---

## Step 2: Enable Google Sheets API

The Google Sheets API allows your application to read and write data to Google Sheets.

### 2.1. Open API Library

1. In the left sidebar, click **"APIs & Services"** (you may need to click the hamburger menu ☰ first)
2. Click **"Library"** from the submenu

### 2.2. Search for Google Sheets API

1. In the search box at the top, type: `Google Sheets API`
2. Click on **"Google Sheets API"** from the search results

### 2.3. Enable the API

1. Click the **"Enable"** button
2. Wait 5-10 seconds for the API to be enabled
3. You'll be redirected to the API details page

[Screenshot: Google Sheets API page with Enable button]

---

## Step 3: Create Service Account

A service account is a special type of Google account that applications use to access Google APIs.

### 3.1. Navigate to Credentials

1. In the left sidebar, click **"Credentials"** (under APIs & Services)
2. Click the **"Create Credentials"** button at the top
3. Select **"Service Account"** from the dropdown

### 3.2. Enter Service Account Details

**Service account details** page:
- **Service account name**: `majlis-rsvp-service-account`
- **Service account ID**: (auto-generated from name, e.g., `majlis-rsvp-service-account`)
- **Service account description**: `Service account for RSVP Google Sheets access`

Click **"Create and Continue"**

### 3.3. Grant Access (Optional - Skip)

On the **"Grant this service account access to project"** page:
- This step is optional for our use case
- Click **"Continue"** to skip

### 3.4. Grant User Access (Optional - Skip)

On the **"Grant users access to this service account"** page:
- This step is optional
- Click **"Done"**

You'll be redirected to the Credentials page showing your new service account.

[Screenshot: Service account creation form with filled fields]

---

## Step 4: Generate Service Account Key

The service account key is a JSON file containing credentials your application will use.

### 4.1. Open Service Account Details

1. On the Credentials page, find the **"Service Accounts"** section
2. Click on the email address of the service account you just created
   - Format: `majlis-rsvp-service-account@your-project-id.iam.gserviceaccount.com`

### 4.2. Navigate to Keys Tab

1. Click the **"Keys"** tab at the top of the page
2. Click **"Add Key"** dropdown button
3. Select **"Create new key"**

### 4.3. Create and Download Key

1. A dialog will appear asking for key type
2. Select **"JSON"** format (should be selected by default)
3. Click **"Create"** button
4. A JSON file will automatically download to your computer
   - Filename format: `your-project-id-xxxxx.json`
5. **IMPORTANT**: Save this file securely - it contains sensitive credentials

**Security Warning**: This JSON file contains your private key. Never commit it to version control, share it publicly, or include it in screenshots.

[Screenshot: Create private key dialog showing JSON option selected]

---

## Step 5: Create Development Google Sheet

Now create the Google Sheet that will store your RSVP data.

### 5.1. Create New Spreadsheet

1. Open [Google Sheets](https://sheets.google.com) in a new tab
2. Click **"+ Blank"** to create a new blank spreadsheet
   - Or click **"Blank spreadsheet"** if shown

### 5.2. Rename the Spreadsheet

1. Click on "Untitled spreadsheet" at the top-left
2. Enter name: `Majlis RSVP - Development`
3. Press Enter to save

### 5.3. Rename the First Tab

1. At the bottom of the sheet, find the tab labeled "Sheet1"
2. Right-click on it and select **"Rename"**
3. Enter the name: `RSVPs` (case-sensitive - must be exactly this)
4. Press Enter to save

**IMPORTANT**: The tab MUST be named exactly `RSVPs` for the application to work.

### 5.4. Copy the Sheet ID

1. Look at the URL in your browser address bar
2. The format is: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit#gid=0`
3. Copy the SHEET_ID_HERE portion (between `/d/` and `/edit`)
   - This is a long string like: `1abc123def456ghi789jkl012mno345pqr678stu`
4. Save this Sheet ID - you'll need it in Step 7

[Screenshot: Google Sheet with RSVPs tab highlighted and URL showing Sheet ID]

---

## Step 6: Share Sheet with Service Account

The service account needs permission to access your Google Sheet.

### 6.1. Open the Credentials JSON File

1. Open the JSON file you downloaded in Step 4 with a text editor
2. Find the line with `"client_email":`
3. Copy the email address (format: `xxxxx@xxxxx.iam.gserviceaccount.com`)

Example:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "majlis-rsvp-service-account@your-project.iam.gserviceaccount.com",
  ...
}
```

### 6.2. Share the Google Sheet

1. In your Google Sheet, click the **"Share"** button (top-right corner)
2. In the "Add people and groups" field, paste the service account email
3. Change permission level to **"Editor"** (click the dropdown that says "Viewer")
4. **IMPORTANT**: Uncheck **"Notify people"** (service accounts don't need notifications)
5. Click **"Share"** or **"Send"** button

The service account now has access to read and write data to this sheet.

[Screenshot: Share dialog with service account email and Editor permission]

---

## Step 7: Configure Environment Variables

Now configure your application with the Google Sheets credentials.

### 7.1. Copy Environment Template

In your terminal, navigate to the project root and run:

```bash
cd /home/ujai/Projek/Rahmat/majlis-rsvp
cp .env.example .env.local
```

This creates a `.env.local` file from the template.

### 7.2. Open .env.local for Editing

Open `.env.local` in your text editor:

```bash
# Using nano
nano .env.local

# Or using VS Code
code .env.local

# Or any text editor you prefer
```

### 7.3. Configure Google Sheets Variables

You need to extract three values from your credentials JSON file and Sheet:

#### GOOGLE_SHEET_ID

Paste the Sheet ID you copied in Step 5.4:

```env
GOOGLE_SHEET_ID=1abc123def456ghi789jkl012mno345pqr678stu
```

#### GOOGLE_SERVICE_ACCOUNT_EMAIL

From the JSON file, copy the `client_email` value:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=majlis-rsvp-service-account@your-project.iam.gserviceaccount.com
```

#### GOOGLE_PRIVATE_KEY

From the JSON file, copy the `private_key` value. **IMPORTANT**:

1. Copy the ENTIRE value including quotes
2. Keep the `\n` characters (these represent line breaks)
3. The value should start with `"-----BEGIN PRIVATE KEY-----\n`
4. The value should end with `\n-----END PRIVATE KEY-----\n"`

Example:

```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7...\n-----END PRIVATE KEY-----\n"
```

**Common Mistakes to Avoid**:
- Don't remove the `\n` characters
- Don't remove the quotes around the key
- Don't add spaces around the `=` sign
- Make sure to copy the complete key

### 7.4. Configure Optional Variables (Recommended)

#### EDIT_TOKEN_SECRET

Generate a random secret for edit token encryption:

```bash
# Option 1: Using openssl
openssl rand -hex 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it:

```env
EDIT_TOKEN_SECRET=your_generated_random_string_here
```

#### NEXT_PUBLIC_APP_URL

For development, use:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, you'll change this to your actual domain.

### 7.5. Save .env.local

Save and close the file.

**Verify**: Your `.env.local` should now have at minimum these three variables set:
- `GOOGLE_SHEET_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`

---

## Step 8: Initialize Sheet Headers

The application needs to set up the correct headers in your Google Sheet.

### 8.1. Run Initialization Script

In your terminal, run:

```bash
npm run init-sheet
```

### 8.2. Verify Success

You should see output like:

```
Sheet initialized successfully!
Headers have been added to the RSVPs sheet.
```

### 8.3. Check Your Google Sheet

1. Go back to your Google Sheet in the browser
2. Refresh the page
3. You should see headers in row 1:
   - Column A: `Timestamp`
   - Column B: `Nama`
   - Column C: `Status Kehadiran`
   - Column D: `Bilangan Orang`
   - Column E: `Edit Link`

If you see these headers, initialization was successful!

[Screenshot: Google Sheet showing the five header columns in row 1]

---

## Step 9: Verify Setup

Test that everything is working correctly.

### 9.1. Start Development Server

Run the development server:

```bash
npm run dev
```

### 9.2. Check for Errors

The application should start without any errors. You should see:

```
> next dev
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Starting...
✓ Ready in XXXms
```

If you see the configuration error message instead, review Steps 7 and 8.

### 9.3. Access the Application

1. Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)
2. You should see the Majlis RSVP homepage
3. The page should load without errors

### 9.4. Submit Test RSVP

1. Fill out the RSVP form with test data:
   - **Nama**: `Test User`
   - **Status Kehadiran**: Select any option
   - **Bilangan Orang**: Enter a number
2. Click submit
3. You should see a success message with an edit link

### 9.5. Verify Data in Google Sheet

1. Go back to your Google Sheet
2. Refresh the page
3. You should see a new row with your test RSVP data
4. The timestamp, name, attendance status, number of people, and edit link should all be present

### 9.6. Test Edit Functionality

1. Click the edit link from the success message (or copy it from the Google Sheet)
2. You should be able to load the edit page
3. Try updating the RSVP
4. Verify the changes appear in the Google Sheet

**Success!** If all these steps work, your development environment is fully configured.

---

## Production Setup

When you're ready to deploy to production, you'll need a separate Google Sheet and configuration to ensure complete isolation from development.

### Why Separate Production Sheet?

**Critical Reasons**:

- **Data Isolation**: Test RSVPs and real RSVPs are completely separate
- **Safety**: Development mistakes and testing don't affect live event data
- **Security**: Separate credentials reduce the impact if development credentials are exposed
- **Testing**: Developers can test freely without any risk to production data

**Important**: NEVER use your development Google Sheet for production. Always create a separate production sheet.

---

### Production Setup Overview

Production environment configuration differs from development:

| Aspect | Development | Production |
|--------|-------------|------------|
| **Config File** | `.env.local` (local file) | Platform environment variables |
| **Sheet Name** | "Majlis RSVP - Development" | "Majlis RSVP - Production" |
| **Sheet ID** | Development Sheet ID | Production Sheet ID (DIFFERENT) |
| **Service Account** | Dev service account | Prod service account (can be same or different) |
| **Credentials Location** | Local file (not committed) | Deployment platform settings |
| **App URL** | http://localhost:3000 | Your production domain |

---

### Step-by-Step Production Setup

#### Step 1: Create Production Google Sheet

Follow the same process as development, but with production naming:

1. Open [Google Sheets](https://sheets.google.com)
2. Create new blank spreadsheet
3. **Name it**: `Majlis RSVP - Production` (different from dev sheet)
4. Rename first tab to: `RSVPs` (exact name, case-sensitive)
5. Copy the Sheet ID from URL:
   - URL: `https://docs.google.com/spreadsheets/d/[PRODUCTION_SHEET_ID]/edit`
   - Copy the `PRODUCTION_SHEET_ID` portion
   - **IMPORTANT**: This should be DIFFERENT from your development Sheet ID
6. Save this production Sheet ID - you'll need it in Step 3

**Verification**: You should now have TWO separate Google Sheets:
- "Majlis RSVP - Development" (for local development)
- "Majlis RSVP - Production" (for live deployment)

---

#### Step 2: Share Production Sheet with Service Account

**Option A: Use Same Service Account** (Simpler)

If you want to use the same service account for both environments:

1. Open your production Google Sheet
2. Click **"Share"** button
3. Paste the same service account email you used for development
4. Set permission to **"Editor"**
5. Uncheck **"Notify people"**
6. Click **"Share"**

**Pros**: Simpler setup, one set of credentials
**Cons**: If dev credentials compromised, production also affected

**Option B: Create Separate Production Service Account** (More Secure)

For better security isolation:

1. Go back to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **"APIs & Services"** → **"Credentials"**
3. Create a new service account:
   - Name: `majlis-rsvp-production`
   - Description: `Production service account for RSVP system`
4. Download credentials JSON (keep secure)
5. Share production Google Sheet with this new service account email
6. Set permission to **"Editor"**

**Pros**: Better security isolation, separate credentials
**Cons**: More credentials to manage

---

#### Step 3: Configure Production Environment Variables

**CRITICAL**: DO NOT use `.env.local` for production. Configure variables in your deployment platform instead.

##### Required Production Variables

Set these in your deployment platform (see platform-specific instructions below):

```
GOOGLE_SHEET_ID=your_production_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour production key\n-----END PRIVATE KEY-----\n"
```

**Important Notes**:
- Use PRODUCTION Sheet ID (different from development)
- Use production service account credentials
- Private key format same as development (with quotes and `\n`)

##### Recommended Production Variables

```
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
EDIT_TOKEN_SECRET=production_secret_64_characters_long_random_string
RSVP_DEADLINE=2026-01-10T23:59:59+08:00
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

**Security Notes**:
- `EDIT_TOKEN_SECRET` should be DIFFERENT from development (generate new random secret)
- Never copy `.env.local` to production
- Production credentials should never be in any file committed to git

---

#### Step 4: Platform-Specific Configuration

Choose your deployment platform:

##### Vercel

1. Push your code to GitHub/GitLab
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Before deploying, click **"Environment Variables"**
4. Add each variable:
   - Name: `GOOGLE_SHEET_ID`
   - Value: Your production Sheet ID
   - Environment: **Production** (or All)
   - Click **"Add"**
5. Repeat for all required and optional variables
6. Click **"Deploy"**

**Alternative - Vercel CLI**:
```bash
vercel env add GOOGLE_SHEET_ID production
# Will prompt for value - paste production Sheet ID

vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL production
# Paste service account email

vercel env add GOOGLE_PRIVATE_KEY production
# Paste private key with quotes and \n

vercel --prod  # Deploy to production
```

##### Railway

1. Create new project from GitHub repository
2. Click **"Variables"** tab
3. Add each variable:
   - Click **"+ New Variable"**
   - Name: `GOOGLE_SHEET_ID`
   - Value: Production Sheet ID
   - Click **"Add"**
4. Repeat for all variables
5. Railway auto-deploys when variables are saved

**Alternative - Railway CLI**:
```bash
railway login
railway link
railway variables set GOOGLE_SHEET_ID=production_sheet_id
railway variables set GOOGLE_SERVICE_ACCOUNT_EMAIL=service@account.com
railway variables set GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
railway up  # Deploy
```

##### Docker / VPS

Create `.env.production` file on your server (NOT in git):

```bash
# On your server
nano .env.production
```

Add all variables:
```env
GOOGLE_SHEET_ID=production_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=service@account.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_APP_URL=https://your-domain.com
EDIT_TOKEN_SECRET=production_secret_64_chars
RSVP_DEADLINE=2026-01-10T23:59:59+08:00
```

Deploy with Docker Compose:
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

```bash
docker-compose up -d
```

**Security**: Ensure `.env.production` has restricted permissions:
```bash
chmod 600 .env.production
```

---

#### Step 5: Initialize Production Sheet

After deploying, initialize the sheet headers.

**Option A: Manual Initialization** (Recommended for production)

1. Open your production Google Sheet
2. In row 1, add these headers manually:
   - A1: `Timestamp`
   - B1: `Nama`
   - C1: `Status Kehadiran`
   - D1: `Bilangan Orang`
   - E1: `Edit Link`
3. Save the sheet

**Option B: Run Init Script** (If platform supports)

Some platforms allow running scripts:

```bash
# Vercel - using serverless function or build step
# Railway - can run in container
npm run init-sheet
```

---

#### Step 6: Verify Production Setup

Critical verification steps:

1. **Access Production URL**:
   - Open `https://your-production-domain.com`
   - Verify homepage loads without errors

2. **Check Health Endpoint**:
   ```bash
   curl https://your-production-domain.com/api/health/sheets
   ```
   Expected response:
   ```json
   {
     "status": "healthy",
     "timestamp": "2025-11-27T...",
     "sheet": {
       "id": "production_sheet_id",
       "title": "Majlis RSVP - Production"
     }
   }
   ```

3. **Submit Test RSVP**:
   - Fill out the RSVP form on production site
   - Use test data (e.g., Name: "Test Production User")
   - Submit form

4. **Verify Data in Production Sheet**:
   - Open production Google Sheet
   - Verify new row appears with test RSVP data
   - **CRITICAL**: Check your development sheet - it should have NO new entry
   - This confirms production writes to production sheet only

5. **Test Edit Functionality**:
   - Click the edit link from the success message
   - Update the test RSVP
   - Verify changes appear in production sheet
   - Delete or mark test RSVP clearly

6. **Monitor Application Logs**:
   - Check deployment platform logs
   - Look for any errors or warnings
   - Verify no authentication failures

**Success Criteria**:
- ✅ Application loads on production URL
- ✅ Health check returns "healthy"
- ✅ Test RSVP appears in production sheet (NOT dev sheet)
- ✅ Edit links work correctly
- ✅ No errors in logs

---

### Production Security Checklist

Before going live, verify:

- [ ] Production Sheet ID is different from development
- [ ] `.env.local` is NOT used in production
- [ ] Production credentials configured in platform (not in files)
- [ ] Production `EDIT_TOKEN_SECRET` is different from development
- [ ] Production `EDIT_TOKEN_SECRET` is at least 64 characters
- [ ] `NEXT_PUBLIC_APP_URL` is set to actual production domain
- [ ] Production Google Sheet is NOT publicly accessible
- [ ] Service account has Editor permission (not Owner)
- [ ] Rate limiting configured (Redis for production)
- [ ] Application logs don't expose credentials
- [ ] Test RSVP submitted and verified
- [ ] Development and production data are completely separate

---

### Common Production Issues

#### Issue: Production RSVPs appearing in development sheet

**Cause**: Using development Sheet ID in production

**Fix**:
1. Verify production environment variable `GOOGLE_SHEET_ID` is set
2. Ensure it's the PRODUCTION Sheet ID (not dev)
3. Redeploy application
4. Clear any caches

---

#### Issue: "Missing credentials" error in production

**Cause**: Environment variables not set in deployment platform

**Fix**:
1. Go to platform environment variables settings
2. Verify all three required variables are set:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
3. Check for typos in variable names (case-sensitive)
4. Redeploy after setting variables

---

#### Issue: Private key format errors in production

**Cause**: Platform escaping `\n` differently

**Fix**:
- Ensure private key is in quotes
- Preserve all `\n` characters
- Some platforms: paste exact value from JSON file
- Vercel/Railway: Usually works with quotes and `\n`
- Test with health endpoint after each attempt

---

### Post-Deployment Monitoring

After production deployment:

**Immediate** (First 24 hours):
- Monitor application logs every few hours
- Check Google Sheets API quota usage
- Verify RSVPs are being recorded correctly
- Test edit links from real submissions
- Watch for authentication errors

**Ongoing**:
- Review RSVP submissions daily
- Monitor health check endpoint
- Check for unusual patterns or errors
- Backup production sheet periodically
- Review Google Cloud audit logs monthly

---

### Production vs Development: Quick Reference

| Task | Development | Production |
|------|-------------|------------|
| **Create Sheet** | "Majlis RSVP - Development" | "Majlis RSVP - Production" |
| **Config Location** | `.env.local` file | Platform environment variables |
| **Set Variables** | Edit `.env.local` locally | Use platform UI/CLI |
| **Test Changes** | Freely test anything | Test in dev first, then deploy |
| **View Data** | Open dev Google Sheet | Open prod Google Sheet (limited access) |
| **Reset Data** | Can clear anytime | Never clear without backup |
| **Credentials** | Can rotate casually | Follow zero-downtime rotation |

---

### Next: Comprehensive Environment Guide

For detailed information about:
- Complete variable reference with all options
- Security best practices (DO/DON'T lists)
- Credential rotation procedures
- Troubleshooting environment issues
- Platform-specific deployment guides

See: [Environment Configuration Guide](./environment-configuration.md)

---

## Troubleshooting

### Issue: "Configuration Error: Missing Google Sheets Credentials"

**Cause**: Environment variables are not set correctly.

**Solution**:
1. Verify `.env.local` exists in project root
2. Check all three required variables are set (no typos in variable names)
3. Make sure there are no spaces around `=` signs
4. Restart the development server after changing `.env.local`

### Issue: "Permission denied" or 403 error

**Cause**: Service account doesn't have access to the Google Sheet.

**Solution**:
1. Verify you shared the sheet with the service account email (Step 6)
2. Verify permission is set to "Editor", not "Viewer"
3. Double-check the service account email matches exactly

### Issue: "Sheet not found" or 404 error

**Cause**: Incorrect Sheet ID or sheet doesn't exist.

**Solution**:
1. Verify `GOOGLE_SHEET_ID` in `.env.local` matches the Sheet ID from your Google Sheet URL
2. Verify the Google Sheet exists and is not deleted
3. Make sure you copied the complete Sheet ID (no extra characters)

### Issue: "Invalid credentials" or authentication error

**Cause**: Private key is malformed or incorrect.

**Solution**:
1. Verify `GOOGLE_PRIVATE_KEY` includes the quotes
2. Verify all `\n` characters are preserved
3. Verify the key starts with `"-----BEGIN PRIVATE KEY-----\n`
4. Verify the key ends with `\n-----END PRIVATE KEY-----\n"`
5. Try re-copying from the JSON file carefully

### Issue: "RSVPs sheet not found"

**Cause**: The sheet tab is not named exactly "RSVPs".

**Solution**:
1. Go to your Google Sheet
2. Rename the tab to exactly: `RSVPs` (case-sensitive)
3. Run `npm run init-sheet` again

### Issue: init-sheet script fails

**Cause**: Various configuration issues.

**Solution**:
1. Verify all Steps 1-7 completed correctly
2. Check service account has Editor permission
3. Verify Sheet ID is correct
4. Check credentials are valid
5. Try running with verbose logging: `NODE_ENV=development npm run init-sheet`

### Still Having Issues?

See the comprehensive troubleshooting guide: [docs/troubleshooting.md](./troubleshooting.md)

Or run the validation helper script:

```bash
npm run validate-sheets
```

This will diagnose your configuration and tell you exactly what's wrong.

---

## Next Steps

After completing this setup:

1. Start developing your application with `npm run dev`
2. Review the environment configuration guide: [docs/environment-configuration.md](./environment-configuration.md)
3. Learn about troubleshooting: [docs/troubleshooting.md](./troubleshooting.md)
4. When ready for production, set up your production environment

---

## Security Reminders

- Never commit `.env.local` to git (it's in `.gitignore`)
- Never share your credentials JSON file
- Never include credentials in screenshots or screen recordings
- Use separate credentials for development and production
- Rotate credentials if you suspect they've been compromised

---

**Setup Complete!** You're now ready to use the Majlis RSVP application.

If you found any steps unclear or encountered issues not covered here, please update this documentation to help future developers.
