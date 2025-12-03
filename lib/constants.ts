import { EventDetails } from "@/types";
import { env } from "./env";

/**
 * Event Details - Majlis Aqiqah & Kesyukuran
 */
export const EVENT_DETAILS: EventDetails = {
  title: "Majlis Aqiqah & Kesyukuran",
  babyName: "Rahmat Don Zulkarnain",
  father: "Dzorif Don Zulkarnain Bin Azmi",
  mother: "Dr Nur Hidayah Binti Hamidin",
  date: "Sabtu, 17.1.2026",
  time: "10.30 am - 2.30 pm",
  venue: "Ruang Acara Nadi Rafanda",
  address: "No. 1 Jalan Meteor P U16/P, Elmina East, 40160 Shah Alam, Selangor",
  coordinates: {
    lat: 3.1636814,
    lng: 101.527262,
  },
  mapUrl:
    "https://www.google.com/maps/place/Ruang+Acara+Nadi+Rafanda/@3.1636868,101.5246871,17z/data=!3m1!4b1!4m6!3m5!1s0x31cc4f007d9ebd47:0xeb6f2a0648d0ebf5!8m2!3d3.1636814!4d101.527262!16s%2Fg%2F11wx6twjkq?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D",
  wazeUrl:
    "https://www.waze.com/en/live-map/directions/my/selangor/shah-alam/ruang-acara-nadi-rafanda?navigate=yes&place=ChIJR72efQBPzDER9evQSAYqb-s",
};

/**
 * Event Date - ISO 8601 format for countdown
 * 17 January 2026, 10:30 AM Malaysia Time (GMT+8)
 */
export const EVENT_DATE = "2026-01-17T10:30:00+08:00";

/**
 * RSVP Deadline
 * Configured via validated environment variable with default fallback
 * Lazy-loaded to avoid accessing env during module evaluation
 */
let _rsvpDeadline: Date | null = null;
export const getRsvpDeadline = () => {
  if (!_rsvpDeadline) {
    _rsvpDeadline = new Date(env.RSVP_DEADLINE);
  }
  return _rsvpDeadline;
};

/**
 * App URL
 * Automatically detects correct URL based on environment:
 * - Development: http://localhost:3000
 * - Vercel Preview: https://{VERCEL_URL}
 * - Vercel Production: https://{VERCEL_PROJECT_PRODUCTION_URL}
 * - Custom: Uses NEXT_PUBLIC_APP_URL if explicitly set
 *
 * Lazy-loaded to avoid accessing env during module evaluation
 */
let _appUrl: string | null = null;
export const getAppUrl = () => {
  if (!_appUrl) {
    // Check if we're in Vercel environment (server-side variables)
    const vercelEnv = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV;
    const vercelUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
    const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;

    // Priority: Custom URL > Vercel Production > Vercel Preview > Default
    if (env.NEXT_PUBLIC_APP_URL && env.NEXT_PUBLIC_APP_URL !== 'http://localhost:3000') {
      // Use custom URL if explicitly set and not the default
      _appUrl = env.NEXT_PUBLIC_APP_URL;
    } else if (vercelEnv === 'production' && vercelProductionUrl) {
      // Use production URL in production
      _appUrl = `https://${vercelProductionUrl}`;
    } else if (vercelEnv === 'preview' && vercelUrl) {
      // Use preview URL in preview deployments
      _appUrl = `https://${vercelUrl}`;
    } else if (vercelUrl) {
      // Fallback to VERCEL_URL if available
      _appUrl = `https://${vercelUrl}`;
    } else {
      // Fallback to localhost for development
      _appUrl = env.NEXT_PUBLIC_APP_URL;
    }
  }
  return _appUrl;
};

/**
 * Google Sheets Column Configuration
 */
export const SHEETS_COLUMNS = {
  TIMESTAMP: 0, // Column A
  NAMA: 1, // Column B
  STATUS_KEHADIRAN: 2, // Column C
  BILANGAN_ORANG: 3, // Column D
  EDIT_LINK: 4, // Column E
} as const;

/**
 * Error Messages in Bahasa Malaysia
 */
export const ERROR_MESSAGES = {
  GOOGLE_SHEETS_ERROR: "Perkhidmatan sedang sibuk. Sila cuba sebentar lagi.",
  INVALID_EDIT_TOKEN: "Pautan edit tidak sah atau telah tamat tempoh.",
  DEADLINE_PASSED: "RSVP telah ditutup. Sila hubungi penganjur untuk sebarang pertanyaan.",
  NETWORK_ERROR: "Tiada sambungan internet. Sila periksa sambungan anda.",
  UNKNOWN_ERROR: "Ralat tidak dijangka berlaku. Sila cuba lagi.",
} as const;

/**
 * Success Messages in Bahasa Malaysia
 */
export const SUCCESS_MESSAGES = {
  RSVP_SUBMITTED: "Terima kasih atas pengesahan kehadiran anda!",
  RSVP_UPDATED: "RSVP anda telah dikemaskini.",
} as const;
