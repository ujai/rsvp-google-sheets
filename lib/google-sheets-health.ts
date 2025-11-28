import { google } from "googleapis";
import { env } from "./env";

/**
 * In-memory cache for health check results
 * TTL: 2 minutes (120000ms)
 */
const healthCheckCache = {
  isHealthy: null as boolean | null,
  timestamp: 0,
  TTL: 120000, // 2 minutes
};

/**
 * Check if Google Sheets API is available and working
 *
 * This function performs a lightweight health check to determine if the
 * Google Sheets API is accessible and the configured sheet is available.
 *
 * Features:
 * - Performs minimal API call (gets sheet metadata only)
 * - Implements 5-second timeout to prevent hanging
 * - In-memory caching with 2-minute TTL to reduce API calls
 * - Catches all error types without throwing
 * - Logs errors server-side with sufficient context
 * - Does not expose sensitive credential information
 *
 * Use cases:
 * - Conditional rendering of RSVP form based on API availability
 * - Health monitoring endpoints
 * - Graceful degradation when API is unavailable
 *
 * @returns Promise<boolean> - true if healthy, false if unhealthy
 *
 * @example
 * ```typescript
 * const isHealthy = await checkGoogleSheetsHealth();
 * if (isHealthy) {
 *   // Render RSVP form
 * } else {
 *   // Show unavailability message
 * }
 * ```
 */
export async function checkGoogleSheetsHealth(): Promise<boolean> {
  try {
    // Check cache first to reduce API calls
    const now = Date.now();
    if (
      healthCheckCache.isHealthy !== null &&
      now - healthCheckCache.timestamp < healthCheckCache.TTL
    ) {
      // Cache hit - return cached result
      return healthCheckCache.isHealthy;
    }

    // Cache miss or expired - perform health check
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({
      version: "v4",
      auth,
      // 5-second timeout for health check
      timeout: 5000,
    });

    // Lightweight check: get sheet metadata only (minimal data transfer)
    await sheets.spreadsheets.get({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      fields: "spreadsheetId", // Request only the sheet ID to minimize response size
    });

    // Success - cache the result
    healthCheckCache.isHealthy = true;
    healthCheckCache.timestamp = now;

    return true;
  } catch (error: any) {
    // Log error server-side with context (but not credentials)
    console.error("[Google Sheets Health Check] API unavailable:", {
      message: error.message,
      code: error.code,
      status: error.status,
      timestamp: new Date().toISOString(),
      // Do NOT log credentials or sensitive data
    });

    // Cache the unhealthy result
    healthCheckCache.isHealthy = false;
    healthCheckCache.timestamp = Date.now();

    // Return false instead of throwing - graceful degradation
    return false;
  }
}

/**
 * Clear the health check cache
 *
 * Useful for testing or when you need to force a fresh health check.
 *
 * @internal For testing purposes
 */
export function clearHealthCheckCache(): void {
  healthCheckCache.isHealthy = null;
  healthCheckCache.timestamp = 0;
}
