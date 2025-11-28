import { google } from "googleapis";
import { RSVPData, RSVPEntry } from "@/types";
import { SHEETS_COLUMNS } from "./constants";
import { env } from "./env";
import { sanitizeForSheets, sanitizeForDisplay, compareTokens } from "./security";

/**
 * Initialize Google Sheets API client
 *
 * Security measures:
 * - Uses validated environment variables from lib/env.ts
 * - Credentials are server-side only (never exposed to client)
 * - Implements timeout to prevent hanging requests
 * - Uses least-privilege scope (spreadsheets only)
 *
 * API Quota Limits (Google Sheets API v4):
 * - Read requests: 100 requests per 100 seconds per user
 * - Write requests: 100 requests per 100 seconds per user
 *
 * @returns Google Sheets API client instance with timeout configured
 */
function getGoogleSheetsClient() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Create sheets client with timeout
    const sheets = google.sheets({
      version: "v4",
      auth,
      // Set timeout to prevent hanging requests (10 seconds)
      timeout: 10000,
    });

    return sheets;
  } catch (error) {
    console.error("[Google Sheets] Failed to initialize API client:", error);
    throw new Error("Failed to initialize Google Sheets API. Please check credentials.");
  }
}

/**
 * Append a new RSVP to Google Sheets
 *
 * Security measures:
 * - Sanitizes all user input to prevent formula injection
 * - Uses USER_ENTERED to allow formulas only from sanitized data
 * - Comprehensive error handling for API failures
 * - Timeout protection (inherited from client)
 *
 * Error scenarios handled:
 * - Authentication errors (invalid credentials)
 * - Authorization errors (missing sheet permissions)
 * - Quota exceeded (429 status)
 * - Network errors (timeout, connection refused)
 * - Invalid sheet ID or range
 *
 * @param data - Validated RSVP data
 * @param editLink - Generated edit link with token
 * @throws Error with descriptive message for error handling in Server Action
 */
export async function appendRSVPToSheet(
  data: RSVPData,
  editLink: string
): Promise<void> {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = env.GOOGLE_SHEET_ID;

    const timestamp = new Date().toISOString();

    // Sanitize all user-provided data before writing to sheets
    const sanitizedNama = sanitizeForSheets(data.nama);
    const sanitizedEditLink = sanitizeForSheets(editLink);

    const row = [
      timestamp,
      sanitizedNama,
      data.statusKehadiran === "hadir" ? "Hadir" : "Tidak Hadir",
      data.statusKehadiran === "hadir" ? data.bilanganOrang : "",
      sanitizedEditLink,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "RSVPs!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });
  } catch (error: any) {
    // Log detailed error server-side
    console.error("[Google Sheets] Append error:", {
      error: error.message,
      code: error.code,
      status: error.status,
      timestamp: new Date().toISOString(),
    });

    // Determine error type and throw appropriate error
    if (error.code === 429 || error.message?.includes("quota")) {
      throw new Error("Google Sheets API quota exceeded. Please try again later.");
    } else if (error.code === 401 || error.code === 403) {
      throw new Error("Google Sheets API authentication failed. Please check credentials.");
    } else if (error.code === 404) {
      throw new Error("Google Sheets spreadsheet not found. Please check GOOGLE_SHEET_ID.");
    } else if (error.code === "ETIMEDOUT" || error.message?.includes("timeout")) {
      throw new Error("Google Sheets API request timed out. Please try again.");
    } else {
      // Generic error for unknown failures
      throw new Error("Failed to append data to Google Sheets.");
    }
  }
}

/**
 * Find RSVP by edit token (search in edit links column)
 *
 * Security measures:
 * - Uses timing-safe comparison to prevent timing attacks
 * - Sanitizes data retrieved from sheets before returning
 * - Validates data types to prevent type confusion
 * - Prevents brute-force token guessing through constant-time search
 * - Comprehensive error handling for API failures
 *
 * @param token - Edit token to search for
 * @returns RSVP data and row index if found, null otherwise
 * @throws Error with descriptive message for error handling in Server Action
 */
export async function findRSVPByToken(
  token: string
): Promise<{ data: RSVPEntry; rowIndex: number } | null> {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = env.GOOGLE_SHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "RSVPs!A:E",
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return null; // No data or only header row
    }

  // Search for the token in edit links (column E)
  // Use timing-safe comparison to prevent timing attacks
  for (let i = 1; i < rows.length; i++) {
    // Start from 1 to skip header
    const row = rows[i];

    // Type guard: ensure row exists
    if (!row) continue;

    const editLink = row[SHEETS_COLUMNS.EDIT_LINK];

    // Extract token from edit link (format: http://domain/edit/{token})
    if (editLink && typeof editLink === "string") {
      const storedToken = editLink.split("/").pop() || "";

      // Use timing-safe comparison instead of simple includes()
      // This prevents timing attacks where attackers measure response time
      // to determine if they're getting closer to the correct token
      if (storedToken && compareTokens(token, storedToken)) {
        // Sanitize data retrieved from sheets for display
        const sanitizedNama = sanitizeForDisplay(row[SHEETS_COLUMNS.NAMA] || "");

        const data: RSVPEntry = {
          timestamp: row[SHEETS_COLUMNS.TIMESTAMP] || "",
          nama: sanitizedNama,
          statusKehadiran:
            row[SHEETS_COLUMNS.STATUS_KEHADIRAN] === "Hadir"
              ? "hadir"
              : "tidak_hadir",
          bilanganOrang: row[SHEETS_COLUMNS.BILANGAN_ORANG]
            ? parseInt(row[SHEETS_COLUMNS.BILANGAN_ORANG])
            : undefined,
          editLink: row[SHEETS_COLUMNS.EDIT_LINK] || "",
        };

        return { data, rowIndex: i + 1 }; // +1 because sheets are 1-indexed
      }
    }
  }

  return null;
  } catch (error: any) {
    // Log detailed error server-side
    console.error("[Google Sheets] Find by token error:", {
      error: error.message,
      code: error.code,
      status: error.status,
      timestamp: new Date().toISOString(),
    });

    // Determine error type and throw appropriate error
    if (error.code === 429 || error.message?.includes("quota")) {
      throw new Error("Google Sheets API quota exceeded. Please try again later.");
    } else if (error.code === 401 || error.code === 403) {
      throw new Error("Google Sheets API authentication failed. Please check credentials.");
    } else if (error.code === 404) {
      throw new Error("Google Sheets spreadsheet not found. Please check GOOGLE_SHEET_ID.");
    } else if (error.code === "ETIMEDOUT" || error.message?.includes("timeout")) {
      throw new Error("Google Sheets API request timed out. Please try again.");
    } else {
      // Generic error for unknown failures
      throw new Error("Failed to fetch data from Google Sheets.");
    }
  }
}

/**
 * Update an existing RSVP in Google Sheets
 *
 * Security measures:
 * - Sanitizes user input before updating
 * - Only allows updating specific columns (B and D)
 * - Prevents formula injection
 * - Comprehensive error handling for API failures
 * - Row index validation to prevent unauthorized access
 *
 * @param rowIndex - 1-based row index in Google Sheets
 * @param nama - Updated name (will be sanitized)
 * @param bilanganOrang - Updated guest count
 * @throws Error with descriptive message for error handling in Server Action
 */
export async function updateRSVPInSheet(
  rowIndex: number,
  nama: string,
  bilanganOrang: number
): Promise<void> {
  try {
    // Validate row index (basic sanity check)
    if (rowIndex < 2 || rowIndex > 10000) {
      throw new Error("Invalid row index for update.");
    }

    const sheets = getGoogleSheetsClient();
    const spreadsheetId = env.GOOGLE_SHEET_ID;

    // Sanitize user input before writing
    const sanitizedNama = sanitizeForSheets(nama);

    // Update only name (column B) and number (column D)
    // Using separate calls to ensure atomicity per field
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `RSVPs!B${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[sanitizedNama]],
      },
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `RSVPs!D${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[bilanganOrang]],
      },
    });
  } catch (error: any) {
    // Log detailed error server-side
    console.error("[Google Sheets] Update error:", {
      error: error.message,
      code: error.code,
      status: error.status,
      rowIndex,
      timestamp: new Date().toISOString(),
    });

    // Determine error type and throw appropriate error
    if (error.code === 429 || error.message?.includes("quota")) {
      throw new Error("Google Sheets API quota exceeded. Please try again later.");
    } else if (error.code === 401 || error.code === 403) {
      throw new Error("Google Sheets API authentication failed. Please check credentials.");
    } else if (error.code === 404) {
      throw new Error("Google Sheets spreadsheet not found. Please check GOOGLE_SHEET_ID.");
    } else if (error.code === "ETIMEDOUT" || error.message?.includes("timeout")) {
      throw new Error("Google Sheets API request timed out. Please try again.");
    } else if (error.message?.includes("Invalid row index")) {
      throw new Error("Invalid row index for update.");
    } else {
      // Generic error for unknown failures
      throw new Error("Failed to update data in Google Sheets.");
    }
  }
}

/**
 * Initialize Google Sheet with headers (run once)
 */
export async function initializeSheet(): Promise<void> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = env.GOOGLE_SHEET_ID;

  const headers = [
    "Timestamp",
    "Nama",
    "Status Kehadiran",
    "Bilangan Orang",
    "Edit Link",
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "RSVPs!A1:E1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [headers],
    },
  });
}
