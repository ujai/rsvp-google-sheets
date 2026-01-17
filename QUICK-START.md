# Quick Start Guide

Get your RSVP system up and running in 15 minutes!

## 🚀 Prerequisites Checklist

- [ ] Node.js v18+ installed
- [ ] Google account
- [ ] Text editor (VS Code recommended)

## 📝 Step-by-Step Setup

### 1. Install Dependencies (2 min)

```bash
cd your-project-folder
npm install
```

### 2. Set Up Google Sheets (5 min)

#### A. Create Google Cloud Project
1. Go to: https://console.cloud.google.com/
2. Click "New Project"
3. Name it: "Majlis RSVP"
4. Click "Create"

#### B. Enable Google Sheets API
1. Search: "Google Sheets API" in the search bar
2. Click "Enable"

#### C. Create Service Account
1. Go to: "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Name: "rsvp-service"
4. Role: "Editor"
5. Click "Done"

#### D. Download Service Account Key
1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON"
5. Download the file (keep it safe!)

#### E. Create Google Sheet
1. Create new Google Sheet: https://sheets.google.com
2. Rename first tab to: **"RSVPs"** (exactly like this)
3. Copy the Sheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/[THIS_IS_THE_SHEET_ID]/edit
   ```
4. Click "Share" button
5. Paste the service account email from the JSON file
   (looks like: `rsvp-service@project-name.iam.gserviceaccount.com`)
6. Give it "Editor" permissions
7. Click "Send"

### 3. Configure Environment (3 min)

Copy the example file:
```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```env
# From the Google Sheet URL
GOOGLE_SHEET_ID=your_sheet_id_here

# From the downloaded JSON file
GOOGLE_SERVICE_ACCOUNT_EMAIL=rsvp-service@project-name.iam.gserviceaccount.com

# From the JSON file, copy the entire "private_key" value
# Keep the quotes and \n characters exactly as they are
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"

# Leave as is for development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# RSVP deadline: January 10, 2026, 11:59 PM Malaysia time
RSVP_DEADLINE=2026-01-10T23:59:59+08:00

# Generate a random string (any random text is fine)
EDIT_TOKEN_SECRET=put_any_random_text_here_like_thisRandom123Secret
```

**Tips**:
- The `GOOGLE_PRIVATE_KEY` should be copied exactly from the JSON file
- Keep the `\n` characters - they're important!
- Don't remove the quotes around the private key

### 4. Initialize Google Sheet (1 min)

Run this command to add headers to your sheet:

```bash
npm run init-sheet
```

You should see:
```
✅ Google Sheet initialized successfully!
```

Go check your Google Sheet - you should now see headers in row 1:
- Column A: Timestamp
- Column B: Nama
- Column C: Status Kehadiran
- Column D: Bilangan Orang
- Column E: Edit Link

### 5. Run Development Server (1 min)

```bash
npm run dev
```

Open in browser: http://localhost:3000

### 6. Test the RSVP System (3 min)

1. Fill in the form:
   - Name: "Test User"
   - Click "Hadir" checkbox
   - Number of people: 2

2. Click "Hantar RSVP"

3. You should see:
   - ✅ Success message
   - Confirmation page with edit link
   - Your submission in Google Sheets

4. Click the edit link to test editing

5. Update the number of people

6. Click "Kemaskini RSVP"

## ✅ Verification Checklist

- [ ] Development server runs without errors
- [ ] Homepage loads with hero image
- [ ] Form appears below event details
- [ ] Can submit RSVP successfully
- [ ] Data appears in Google Sheet
- [ ] Can edit RSVP via edit link
- [ ] Updated data reflects in Google Sheet

## 🎨 Customization (Optional)

### Change Event Date
Edit `lib/constants.ts`:
```typescript
date: "Sabtu, 17.1.2026",
time: "10.30 am - 2.30 pm",
```

### Change RSVP Deadline
Edit `.env.local`:
```env
RSVP_DEADLINE=2026-01-10T23:59:59+08:00
```

### Change Colors
Edit `app/globals.css`:
```css
--baby-blue: #A4C8E1;  /* Change this color */
```

## 🚀 Deploy to Production

### Deploy to Vercel (Recommended)

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/majlis-rsvp.git
git push -u origin main
```

2. Go to: https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - Copy all values from `.env.local`
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel domain
6. Click "Deploy"

Your RSVP system will be live in ~2 minutes!

## 🆘 Troubleshooting

### "The caller does not have permission"
**Solution**: Share the Google Sheet with the service account email

### "Unable to parse range: RSVPs!A:E"
**Solution**: Make sure the sheet tab is named exactly "RSVPs"

### "Module not found" errors
**Solution**: Run `npm install` again

### Forms not working
**Solution**: Check browser console for errors, verify `.env.local` is configured

### Need Help?
Check the full documentation: `README.md`

## 🎉 You're Done!

Your RSVP system is ready to receive guests!

**Share this URL with your guests**:
- Development: http://localhost:3000
- Production: https://your-vercel-domain.vercel.app

**Monitor RSVPs in real-time**:
Open your Google Sheet to see submissions as they come in!
