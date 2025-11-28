import { NextResponse } from "next/server";
import { google } from "googleapis";
import { env } from "@/lib/env";

/**
 * Google Sheets Health Check API Endpoint
 *
 * GET /api/health/sheets
 *
 * This endpoint provides real-time health status of the Google Sheets API integration
 * for monitoring, diagnostics, and automated health checks.
 *
 * Use cases:
 * - Monitoring dashboards and uptime checks
 * - Automated health monitoring systems
 * - CI/CD deployment verification
 * - Troubleshooting connectivity issues
 * - Production readiness checks
 *
 * Response format (healthy):
 * {
 *   "status": "healthy",
 *   "timestamp": "2025-11-27T10:30:00.000Z",
 *   "sheet": {
 *     "id": "1abc123...",
 *     "title": "Majlis RSVP - Production"
 *   }
 * }
 *
 * Response format (unhealthy):
 * {
 *   "status": "unhealthy",
 *   "timestamp": "2025-11-27T10:30:00.000Z",
 *   "error": {
 *     "code": 403,
 *     "message": "Permission denied",
 *     "type": "authentication"
 *   }
 * }
 *
 * Error types:
 * - authentication: 401/403 errors (invalid credentials or permissions)
 * - not_found: 404 errors (sheet doesn't exist)
 * - quota_exceeded: 429 errors (API quota limits reached)
 * - timeout: Request timed out
 * - unknown: Other errors
 *
 * HTTP status codes:
 * - 200 OK: Google Sheets API is healthy and accessible
 * - 503 Service Unavailable: Google Sheets API is unhealthy
 *
 * Security:
 * - Does not expose sensitive credentials in response
 * - Logs errors server-side only
 * - Consider adding rate limiting in production
 * - Consider adding authentication for production use
 *
 * Performance:
 * - 5-second timeout prevents hanging requests
 * - Lightweight check (gets sheet metadata only)
 * - Minimal data transfer
 */
export async function GET() {
  try {
    // Initialize Google Auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Create Sheets client with 5-second timeout
    const sheets = google.sheets({
      version: "v4",
      auth,
      timeout: 5000, // 5-second timeout for health check
    });

    // Lightweight health check: get sheet metadata only
    const response = await sheets.spreadsheets.get({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      fields: "spreadsheetId,properties.title", // Minimal fields to reduce response size
    });

    // Success - return healthy status
    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        sheet: {
          id: response.data.spreadsheetId,
          title: response.data.properties?.title,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Log error server-side with context (but not credentials)
    console.error("[Health Check] Google Sheets API check failed:", {
      message: error.message,
      code: error.code,
      status: error.status,
      timestamp: new Date().toISOString(),
      // Do NOT log credentials or sensitive data
    });

    // Return unhealthy status with error details
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: {
          code: error.code,
          message: error.message,
          type: getErrorType(error),
        },
      },
      { status: 503 } // Service Unavailable
    );
  }
}

/**
 * Classify error type based on error code and message
 *
 * This helps consumers of the health check endpoint understand
 * the nature of the problem and take appropriate action.
 *
 * @param error - The error object from Google Sheets API
 * @returns Error type classification
 */
function getErrorType(error: any): string {
  if (error.code === 401 || error.code === 403) {
    return "authentication";
  } else if (error.code === 404) {
    return "not_found";
  } else if (error.code === 429) {
    return "quota_exceeded";
  } else if (
    error.code === "ETIMEDOUT" ||
    error.message?.includes("timeout")
  ) {
    return "timeout";
  } else {
    return "unknown";
  }
}
