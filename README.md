# Majlis Aqiqah & Kesyukuran - RSVP System

A beautiful, mobile-first RSVP system for **Rahmat Don Zulkarnain**'s Majlis Aqiqah & Kesyukuran celebration. Built with Next.js 15, TypeScript, and Google Sheets as the database.

## 🎉 Event Details

- **Event**: Majlis Aqiqah & Kesyukuran
- **Baby**: Rahmat Don Zulkarnain Bin Dzorif Don Zulkarnain
- **Parents**: Dzorif Don Zulkarnain Bin Azmi & Dr Nur Hidayah Binti Hamidin
- **Date**: Sabtu, 17 Januari 2026
- **Time**: 10.30 am - 2.30 pm
- **Venue**: Ruang Acara Nadi Rafanda, Shah Alam, Selangor

## ✨ Features

- ✅ **Mobile-First Design** - Optimized for smartphone users
- ✅ **Baby Blue Theme** - Elegant baby blue color palette with Islamic elements
- ✅ **Google Sheets Database** - Zero infrastructure cost
- ✅ **Edit Capability** - Guests can edit their RSVPs via unique links
- ✅ **Deadline Management** - Automatic RSVP deadline enforcement
- ✅ **Countdown Timer** - Days until RSVP deadline
- ✅ **Bilingual** - Full Bahasa Malaysia interface
- ✅ **Form Validation** - Client and server-side validation with Zod
- ✅ **Conditional Fields** - Number of people field appears only when attending
- ✅ **Interactive Maps** - Google Maps and Waze integration
- ✅ **Toast Notifications** - User-friendly success/error messages
- ✅ **TypeScript Strict** - Full type safety

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI (Radix UI + Tailwind)
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Database**: Google Sheets API
- **Icons**: Lucide React
- **Toast**: Sonner

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Google Cloud Console** account for Google Sheets API

## 🚀 Getting Started

### Quick Start Guide

For a comprehensive setup guide, see **[docs/google-sheets-setup.md](docs/google-sheets-setup.md)**

For environment configuration and production deployment, see **[docs/environment-configuration.md](docs/environment-configuration.md)**

For troubleshooting common issues, see **[docs/troubleshooting.md](docs/troubleshooting.md)**

### 1. Clone the Repository

```bash
cd /home/ujai/Projek/Rahmat/majlis-rsvp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Google Sheets API

**Note**: For detailed step-by-step instructions with screenshots, see [docs/google-sheets-setup.md](docs/google-sheets-setup.md)

#### a. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

#### b. Create a Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in the details and click "Create"
4. Grant it "Editor" role
5. Click "Done"

#### c. Generate Service Account Key

1. Click on the newly created service account
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select **JSON** format
5. Download the JSON file

#### d. Create a Google Sheet

1. Create a new Google Sheet
2. Name the first sheet/tab **"RSVPs"** (case-sensitive)
3. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
4. Share the sheet with the service account email (from the JSON file)
   - Click "Share" button
   - Paste the service account email: `your-service-account@your-project.iam.gserviceaccount.com`
   - Give it "Editor" permissions

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
# Google Sheets API Configuration
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key from the JSON file here\n-----END PRIVATE KEY-----\n"

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
RSVP_DEADLINE=2026-01-10T23:59:59+08:00

# Security (generate a random string)
EDIT_TOKEN_SECRET=your_random_secret_string_here
```

**Important Notes**:
- The `GOOGLE_PRIVATE_KEY` must include `\n` for line breaks
- The `RSVP_DEADLINE` is in ISO 8601 format with timezone (+08:00 for Malaysia)
- Generate a strong random string for `EDIT_TOKEN_SECRET`

### 5. Initialize Google Sheet Headers

Run this script once to set up the sheet headers:

```bash
npm run init-sheet
```

This will create the following columns in your Google Sheet:
- **Column A**: Timestamp
- **Column B**: Nama
- **Column C**: Status Kehadiran
- **Column D**: Bilangan Orang
- **Column E**: Edit Link

### 6. Validate Your Setup

Before starting the development server, verify your Google Sheets configuration:

```bash
npm run validate-sheets
```

This will perform a comprehensive check of:
- Environment variables
- Google Sheets API authentication
- Sheet access permissions
- Read/write capabilities

If all checks pass, you're ready to proceed!

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Health Check Endpoint

Monitor Google Sheets API health status:

```bash
curl http://localhost:3000/api/health/sheets
```

Returns JSON with status: "healthy" or "unhealthy"

## 📦 Available Scripts

```bash
npm run dev             # Run development server
npm run build           # Build for production
npm start               # Run production server
npm run lint            # Run ESLint
npm test                # Run unit tests
npm run test:ui         # Run tests with UI
npm run init-sheet      # Initialize Google Sheet headers (run once)
npm run validate-sheets # Validate Google Sheets credentials and connection
```

## 🏗️ Project Structure

```
majlis-rsvp/
├── app/
│   ├── actions/
│   │   └── rsvp.ts                 # Server Actions for RSVP operations
│   ├── api/
│   │   └── health/
│   │       └── sheets/
│   │           └── route.ts        # Google Sheets health check endpoint
│   ├── edit/
│   │   └── [token]/
│   │       ├── page.tsx            # Edit RSVP page
│   │       ├── success/
│   │       │   └── page.tsx        # Edit success page
│   │       └── not-found.tsx       # Invalid token page
│   ├── layout.tsx                  # Root layout with metadata
│   ├── page.tsx                    # Homepage with graceful degradation
│   └── globals.css                 # Global styles with Tailwind v4 theme
├── components/
│   ├── client/
│   │   ├── confirmation.tsx        # RSVP confirmation component
│   │   ├── deadline-countdown.tsx  # Countdown timer
│   │   ├── edit-rsvp-form.tsx      # Edit RSVP form
│   │   ├── rsvp-form.tsx           # Main RSVP form
│   │   └── rsvp-section.tsx        # RSVP section wrapper
│   ├── server/
│   │   ├── event-details.tsx       # Event information card
│   │   ├── hero-section.tsx        # Hero section with image
│   │   └── rsvp-unavailable-message.tsx  # API unavailable message
│   ├── error-boundary.tsx          # React error boundary
│   └── ui/                         # Shadcn UI components
├── lib/
│   ├── constants.ts                # Event details, error messages
│   ├── env.ts                      # Environment validation with Zod
│   ├── google-sheets.ts            # Google Sheets API functions
│   ├── google-sheets-health.ts     # Health check utilities
│   ├── helpers.ts                  # Utility functions
│   ├── utils.ts                    # cn() utility for Shadcn
│   └── validations.ts              # Zod validation schemas
├── types/
│   └── index.ts                    # TypeScript type definitions
├── scripts/
│   ├── init-sheet.ts               # Google Sheet initialization script
│   └── validate-credentials.ts     # Credentials validation script
├── docs/
│   ├── google-sheets-setup.md      # Comprehensive setup guide
│   ├── environment-configuration.md # Environment config guide
│   ├── troubleshooting.md          # Troubleshooting guide
│   └── testing/                    # Manual testing guides
├── public/
│   └── images/
│       └── hero-teddy-bear.jpeg    # Hero image
├── .env.local.example              # Example environment variables
├── .env.local                      # Your environment variables (gitignored)
├── components.json                 # Shadcn UI configuration
├── package.json                    # Dependencies and scripts
├── vitest.config.ts                # Test configuration
└── README.md                       # This file
```

## 🎨 Color Palette

The application uses a baby blue theme extracted from the hero image:

- **Primary (Baby Blue)**: `#A4C8E1`
- **Light Blue**: `#C8DCEA`
- **Dark Blue**: `#8FA8B8`
- **Gold (Islamic accent)**: `#D4AF37`
- **Cream (Background)**: `#FAF9F6`

## 📝 Form Behavior

### RSVP Form
1. **Name Field**: Required, 2-100 characters
2. **Attendance Status**: Checkbox selection (mutually exclusive)
   - Hadir (Attending)
   - Tidak Hadir (Not Attending)
   - Only one can be selected at a time
   - No default selection
3. **Number of People**:
   - Only appears when "Hadir" is selected
   - Minimum 1 person
   - Includes the submitter

### Edit RSVP
- Only RSVPs with "Hadir" status can be edited
- Can update: Name and Number of People
- Cannot change: Attendance Status
- Edit link is valid until RSVP deadline

## 🔒 Security Features

- ✅ Input sanitization for XSS prevention
- ✅ Server-side validation with Zod
- ✅ Unique edit tokens (16 characters, URL-safe)
- ✅ Edit token validation
- ✅ Deadline enforcement on server-side
- ✅ Rate limiting via Google Sheets API quotas
- ✅ TypeScript strict mode for type safety

## 🚀 Deployment

For detailed production deployment instructions, see **[docs/environment-configuration.md](docs/environment-configuration.md)**

### Production Setup Overview

**Important**: Use separate Google Sheets for development and production!

1. **Create Production Google Sheet**
   - Name it "Majlis RSVP - Production" (different from dev)
   - Copy the Sheet ID
   - Share with service account (Editor permission)

2. **Deploy to Vercel (Recommended)**
   - Push your code to GitHub
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Add all environment variables from `.env.local` with PRODUCTION values
   - Update `NEXT_PUBLIC_APP_URL` to your production URL
   - Deploy!

3. **Verify Production Setup**
   - Check health endpoint: `https://your-domain.com/api/health/sheets`
   - Submit test RSVP
   - Verify data appears in production sheet only

**Important**:
- Never use development credentials in production
- Never commit production credentials to git
- Always use separate Google Sheets for dev and prod
- See [docs/environment-configuration.md](docs/environment-configuration.md) for detailed platform-specific guides

## 📊 Google Sheets Data Format

Each RSVP submission creates a new row with the following columns:

| Column | Name | Example |
|--------|------|---------|
| A | Timestamp | 2026-01-05T10:30:00.000Z |
| B | Nama | Ahmad Bin Abdullah |
| C | Status Kehadiran | Hadir / Tidak Hadir |
| D | Bilangan Orang | 4 |
| E | Edit Link | https://yourdomain.com/edit/abc123... |

## 🐛 Troubleshooting

For comprehensive troubleshooting, see **[docs/troubleshooting.md](docs/troubleshooting.md)**

### Quick Diagnostics

If you encounter issues, run the validation script first:

```bash
npm run validate-sheets
```

This will diagnose:
- Missing or invalid environment variables
- Google Sheets API authentication issues
- Permission problems
- Sheet configuration issues

### Common Issues

**Error**: "Missing Google Sheets Credentials"
- **Solution**: Copy `.env.local.example` to `.env.local` and configure all required variables
- **See**: [docs/google-sheets-setup.md](docs/google-sheets-setup.md)

**Error**: "The caller does not have permission"
- **Solution**: Share the Google Sheet with the service account email (Editor permission)
- **See**: [docs/troubleshooting.md#permission-denied-403](docs/troubleshooting.md)

**Error**: "Unable to parse range: RSVPs!A:E"
- **Solution**: Ensure the sheet tab is named exactly "RSVPs" (case-sensitive)
- **Fix**: Run `npm run init-sheet` to initialize the sheet

**Error**: "Invalid grant"
- **Solution**: Check `GOOGLE_PRIVATE_KEY` is properly formatted with `\n` for line breaks
- **See**: [docs/troubleshooting.md#invalid-credentials](docs/troubleshooting.md)

### Build Errors

**Error**: "Module not found"
- **Solution**: Run `npm install` to ensure all dependencies are installed

**Error**: Tailwind CSS not working
- **Solution**: Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Safari (latest)
- ✅ Firefox (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🙏 Credits

Built with ❤️ for the celebration of **Rahmat Don Zulkarnain**

## 📄 License

This project is created for personal use for the Aqiqah & Kesyukuran celebration.
