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
  mapUrl:
    "https://www.google.com/maps/place/Ruang+Acara+Nadi+Rafanda/@3.1636868,101.5246871,17z/data=!3m1!4b1!4m6!3m5!1s0x31cc4f007d9ebd47:0xeb6f2a0648d0ebf5!8m2!3d3.1636814!4d101.527262!16s%2Fg%2F11wx6twjkq?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D",
};

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
 * Uses NEXT_PUBLIC prefix as it's exposed to browser
 * Configured via validated environment variable with default fallback
 * Lazy-loaded to avoid accessing env during module evaluation
 */
let _appUrl: string | null = null;
export const getAppUrl = () => {
  if (!_appUrl) {
    _appUrl = env.NEXT_PUBLIC_APP_URL;
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
