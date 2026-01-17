# RSVP System with Google Sheets Backend

A production-grade event RSVP web app using Google Sheets as a free database. Built for real-world use - originally deployed for a family celebration that handled 100+ RSVPs.

## Why Google Sheets?

Most RSVP systems require a database, which means paying for hosting or managing infrastructure. This project proves you can build a fully-functional, production-ready web app with:

- **$0 infrastructure cost** - Google Sheets is free
- **Real-time data** - See RSVPs instantly in your spreadsheet
- **No database management** - No migrations, backups, or scaling concerns
- **Built-in collaboration** - Share the sheet with others to manage RSVPs together

## Features

- Mobile-first responsive design
- Guest can edit their RSVP via unique link
- RSVP deadline with countdown timer
- Server-side validation with Zod
- Google Maps and Waze integration
- Bilingual support (Bahasa Malaysia)

## Tech Stack

- **Next.js 16** (App Router, Server Actions)
- **TypeScript** (Strict mode)
- **Tailwind CSS v4** + Shadcn/UI
- **Google Sheets API** as database
- **Vercel** for deployment

## Quick Start

**Prerequisites**: Node.js 18+, Google account

```bash
# 1. Clone and install
git clone https://github.com/ujai/rsvp-google-sheets.git
cd rsvp-google-sheets
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your Google credentials

# 3. Initialize sheet headers
npm run init-sheet

# 4. Run
npm run dev
```

See [QUICK-START.md](QUICK-START.md) for detailed setup (takes ~15 minutes).

## Documentation

| Guide | Description |
|-------|-------------|
| [QUICK-START.md](QUICK-START.md) | Step-by-step setup guide |
| [docs/google-sheets-setup.md](docs/google-sheets-setup.md) | Google Cloud & Sheets API setup |
| [docs/environment-configuration.md](docs/environment-configuration.md) | Environment variables reference |
| [docs/troubleshooting.md](docs/troubleshooting.md) | Common issues and solutions |

## Customization

The app is designed to be customized for your event. Key files:

- `lib/constants.ts` - Event details (name, date, venue, etc.)
- `app/globals.css` - Color theme (baby blue by default)
- `.env.local` - RSVP deadline and configuration
- `public/images/` - Hero image

## How It Works

```
[Guest] -> [Next.js App] -> [Google Sheets API] -> [Your Spreadsheet]
                                                          |
                                                    [You monitor RSVPs]
```

Each RSVP creates a row with: Timestamp, Name, Attendance Status, Party Size, Edit Link.

## Scripts

```bash
npm run dev              # Development server
npm run build            # Production build
npm run init-sheet       # Initialize sheet headers
npm run validate-sheets  # Verify Google Sheets connection
```

## License

MIT - Feel free to use this for your own events.
