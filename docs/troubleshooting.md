# Troubleshooting Guide

Common issues and solutions for the Majlis RSVP application.

---

## Table of Contents

1. [Environment Configuration Issues](#environment-configuration-issues)
2. [Google Sheets API Errors](#google-sheets-api-errors)
3. [Application Startup Issues](#application-startup-issues)
4. [Runtime Errors](#runtime-errors)
5. [Production Deployment Issues](#production-deployment-issues)
6. [Debugging Tools](#debugging-tools)

---

## Environment Configuration Issues

### Missing Environment Variables

**Symptom**: Application fails to start with error message:
```
CONFIGURATION ERROR: Missing Google Sheets Credentials
```

**Cause**: Required environment variables are not set.

**Solution**:
1. Verify `.env.local` exists in project root directory
2. Check that all three required variables are set:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SHEET_ID`
3. Ensure there are no typos in variable names
4. Verify there are no spaces around the `=` sign
5. Restart development server after making changes

**Verification**:
```bash
# Check if .env.local exists
ls -la .env.local

# Verify variables are loaded (won't show actual values for security)
npm run dev
```

---

### Invalid Private Key Format

**Symptom**: Error message mentions `GOOGLE_PRIVATE_KEY` validation failure.

**Cause**: Private key is not in the correct format.

**Solution**:
1. Open your credentials JSON file
2. Find the `private_key` field
3. Copy the ENTIRE value including the quotes
4. Paste into `.env.local` as:
   ```env
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here...\n-----END PRIVATE KEY-----\n"
   ```
5. Critical points:
   - Keep the quotes around the key
   - Keep all `\n` characters (they represent line breaks)
   - Don't add line breaks (keep it as one line)
   - Don't remove any characters from the key

**Common Mistakes**:
- Removing the `\n` characters
- Removing quotes
- Breaking the key across multiple lines in .env.local
- Adding spaces or line breaks

---

### Invalid Service Account Email

**Symptom**: Error message mentions `GOOGLE_SERVICE_ACCOUNT_EMAIL` validation failure.

**Cause**: Email is not in correct format or is misspelled.

**Solution**:
1. Open your credentials JSON file
2. Find `client_email` field
3. Copy the complete email address
4. Paste into `.env.local`:
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   ```
5. Verify:
   - Format: `service-account-name@project-id.iam.gserviceaccount.com`
   - No spaces before or after
   - No quotes needed

---

### Invalid Sheet ID

**Symptom**: Error message mentions `GOOGLE_SHEET_ID` validation failure.

**Cause**: Sheet ID is incorrect or contains invalid characters.

**Solution**:
1. Open your Google Sheet in browser
2. Look at the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`
3. Copy only the `SHEET_ID` portion (between `/d/` and `/edit`)
4. Paste into `.env.local`:
   ```env
   GOOGLE_SHEET_ID=1abc123def456ghi789jkl012mno345pqr678stu
   ```
5. Verify:
   - Only alphanumeric characters, dashes, and underscores
   - No spaces
   - No quotes needed
   - Typically 40-60 characters long

---

## Google Sheets API Errors

### 403 Permission Denied

**Symptom**: Error message: "Google Sheets API authentication failed" or "Permission denied".

**Cause**: Service account doesn't have access to the Google Sheet.

**Solution**:
1. Open your Google Sheet
2. Click "Share" button
3. Verify service account email is in the list of people with access
4. Verify permission is "Editor" (not "Viewer")
5. If not present, add it:
   - Paste service account email
   - Set to "Editor"
   - Uncheck "Notify people"
   - Click "Share"

**Prevention**: Always share sheets with service account before use.

---

### 404 Sheet Not Found

**Symptom**: Error message: "Google Sheets spreadsheet not found".

**Cause**: Incorrect Sheet ID or sheet was deleted.

**Solution**:
1. Verify Google Sheet exists (open the URL in browser)
2. Verify Sheet ID in `.env.local` matches URL
3. Check you're using the correct Sheet ID:
   - Development: Development sheet ID
   - Production: Production sheet ID
4. Verify sheet wasn't deleted or moved to trash

**Verification**:
```bash
# The Sheet ID in .env.local should match your Google Sheet URL
# URL format: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
```

---

### 401 Authentication Failed

**Symptom**: Error message: "Google Sheets API authentication failed" with 401 code.

**Cause**: Invalid or expired credentials.

**Solution**:
1. Verify private key is copied correctly (see [Invalid Private Key Format](#invalid-private-key-format))
2. Verify service account email is correct
3. Check service account wasn't deleted in Google Cloud Console
4. If credentials are old, generate new key:
   - Go to Google Cloud Console → Service Accounts
   - Select your service account
   - Keys tab → Add Key → Create new key
   - Download JSON and update `.env.local`

---

### 429 Quota Exceeded

**Symptom**: Error message: "Google Sheets API quota exceeded".

**Cause**: Too many API requests in a short time period.

**Solution** (Immediate):
1. Wait a few minutes for quota to reset
2. Reduce request frequency
3. Check for infinite loops in code

**Solution** (Long-term):
1. Implement rate limiting (already done in the app)
2. Use Redis for distributed rate limiting in production:
   ```env
   UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your_token
   ```
3. Cache read operations where appropriate

**Quota Limits**:
- Read requests: 100 per 100 seconds per user
- Write requests: 100 per 100 seconds per user

---

### "RSVPs" Sheet/Tab Not Found

**Symptom**: Error indicates the "RSVPs" sheet or tab is missing.

**Cause**: Sheet tab is not named exactly "RSVPs" (case-sensitive).

**Solution**:
1. Open your Google Sheet
2. Look at the tabs at the bottom
3. Find the tab (might be named "Sheet1")
4. Right-click → Rename
5. Enter exactly: `RSVPs` (capital R, capital SVPS)
6. Press Enter
7. Run sheet initialization: `npm run init-sheet`

**Critical**: The name must be exactly `RSVPs` - case-sensitive, no spaces.

---

## Application Startup Issues

### Application Won't Start

**Symptom**: `npm run dev` fails immediately or hangs.

**Diagnostic Steps**:
1. Check Node.js version: `node --version` (should be 18+)
2. Verify dependencies installed: `npm install`
3. Check for port conflicts: `lsof -i :3000` (on Linux/Mac)
4. Review error messages carefully
5. Check `.env.local` exists and is valid

**Common Solutions**:
- Update Node.js: `nvm install 18` or download from nodejs.org
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`
- Use different port: `PORT=3001 npm run dev`
- Fix environment variables (see above)

---

### TypeScript Compilation Errors

**Symptom**: Errors about types or TypeScript during build.

**Solution**:
1. Verify TypeScript is installed: `npm install --save-dev typescript`
2. Check `tsconfig.json` exists
3. Run type checking: `npm run build`
4. Fix any type errors reported

---

## Runtime Errors

### RSVP Submission Fails

**Symptom**: Form submission returns an error or hangs.

**Diagnostic Steps**:
1. Check browser console for errors (F12 → Console tab)
2. Check server logs in terminal
3. Verify Google Sheets API is accessible
4. Check network connectivity

**Common Causes**:
- API quota exceeded (wait and retry)
- Sheet permissions changed (re-share with service account)
- Network timeout (check internet connection)
- Invalid form data (check validation rules)

**Solution**: Run validation script to diagnose:
```bash
npm run validate-sheets
```

---

### Edit Link Not Working

**Symptom**: Clicking edit link shows error or wrong data.

**Causes & Solutions**:

1. **Wrong Environment**:
   - Edit link from dev sheet won't work in production
   - Edit link from prod sheet won't work in dev
   - Solution: Use link in same environment where RSVP was created

2. **Invalid Token**:
   - Token expired or corrupted
   - Solution: Submit new RSVP, use new edit link

3. **Sheet ID Mismatch**:
   - GOOGLE_SHEET_ID changed after RSVP created
   - Solution: Use correct Sheet ID for environment

---

## Production Deployment Issues

### Environment Variables Not Working in Production

**Symptom**: Production deployment fails with missing credentials error.

**Solution**:
1. Verify environment variables are set in deployment platform:
   - **Vercel**: Project Settings → Environment Variables
   - **Railway**: Variables tab
   - **Other**: Check platform-specific settings
2. Verify variable names match exactly (case-sensitive)
3. Verify private key format is correct (with `\n` preserved)
4. Redeploy after setting variables

**Common Platforms**:

**Vercel**:
```bash
# Set via CLI
vercel env add GOOGLE_SHEET_ID
vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL
vercel env add GOOGLE_PRIVATE_KEY

# Or use web dashboard: vercel.com → Project → Settings → Environment Variables
```

**Railway**:
```bash
# Set in Railway dashboard Variables tab
# Or use railway CLI
railway variables set GOOGLE_SHEET_ID=your_sheet_id
```

---

### Production and Development Data Mixed

**Symptom**: Production RSVPs appearing in dev sheet or vice versa.

**Cause**: Using same Sheet ID in both environments.

**Solution**:
1. Create two separate Google Sheets:
   - Development: "Majlis RSVP - Development"
   - Production: "Majlis RSVP - Production"
2. Use different Sheet IDs:
   - `.env.local` (dev): Development Sheet ID
   - Deployment platform (prod): Production Sheet ID
3. Verify each environment writes to correct sheet

**Verification**: Submit test RSVP in dev and prod, check they go to different sheets.

---

### CORS Errors in Production

**Symptom**: Browser console shows CORS errors.

**Cause**: Usually not an issue with this setup (API routes are same-origin).

**Solution**:
1. Verify `NEXT_PUBLIC_APP_URL` is set to production domain
2. Check deployment platform CORS settings
3. Ensure API routes are deployed correctly

---

## Debugging Tools

### Validation Script

Run comprehensive credential validation:

```bash
npm run validate-sheets
```

This will:
- Check environment variables are loaded
- Test Google Sheets API authentication
- Verify sheet access permissions
- Test read/write operations
- Provide specific error messages

**When to use**: Any time you suspect configuration issues.

---

### Health Check Endpoint

Check if Google Sheets API is working:

```bash
# Development
curl http://localhost:3000/api/health/sheets

# Production
curl https://your-domain.com/api/health/sheets
```

**Healthy Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-27T10:30:00.000Z",
  "sheet": {
    "id": "your-sheet-id",
    "title": "Majlis RSVP - Development"
  }
}
```

**Unhealthy Response**:
```json
{
  "status": "unhealthy",
  "timestamp": "2025-11-27T10:30:00.000Z",
  "error": {
    "code": 403,
    "message": "Permission denied",
    "type": "authentication"
  }
}
```

**When to use**: Monitor API health, diagnose runtime issues.

---

### Manual Sheet Inspection

1. Open your Google Sheet in browser
2. Check recent entries
3. Verify headers are correct:
   - Column A: Timestamp
   - Column B: Nama
   - Column C: Status Kehadiran
   - Column D: Bilangan Orang
   - Column E: Edit Link
4. Check permissions (Share button → verify service account is Editor)

---

### Server Logs

Development server logs show detailed error messages:

```bash
npm run dev
```

Watch the terminal for:
- Configuration errors
- API errors
- Authentication failures
- Network issues

Production logs (platform-specific):
- **Vercel**: Dashboard → Deployments → View Logs
- **Railway**: Dashboard → Deployments → Logs tab
- **Other**: Check platform documentation

---

## Getting More Help

### Resources

- **Setup Guide**: [docs/google-sheets-setup.md](./google-sheets-setup.md)
- **Environment Config**: [docs/environment-configuration.md](./environment-configuration.md)
- **Google Sheets API**: https://developers.google.com/sheets/api
- **Next.js Environment Variables**: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

### Reporting Issues

If you encounter an issue not covered here:

1. Run validation script: `npm run validate-sheets`
2. Collect error messages and logs
3. Document steps to reproduce
4. Update this troubleshooting guide with solution once resolved

---

**Last Updated**: 2025-11-27
