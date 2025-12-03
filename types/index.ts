/**
 * Core type definitions for the RSVP application
 */

export type AttendanceStatus = "hadir" | "tidak_hadir";

export interface RSVPData {
  nama: string;
  statusKehadiran: AttendanceStatus;
  bilanganOrang?: number;
}

export interface RSVPEntry extends RSVPData {
  timestamp: string;
  editLink: string;
}

export interface EditRSVPData {
  nama: string;
  bilanganOrang: number;
}

export interface ServerActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}

export interface EventDetails {
  title: string;
  babyName: string;
  father: string;
  mother: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapUrl: string;
  wazeUrl: string;
}
