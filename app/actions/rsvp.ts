"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { rsvpSchema, editRsvpSchema, editTokenSchema } from "@/lib/validations";
import {
  appendRSVPToSheet,
  findRSVPByToken,
  updateRSVPInSheet,
} from "@/lib/google-sheets";
import {
  generateEditToken,
  generateEditLink,
  isDeadlinePassed,
  retryWithBackoff,
} from "@/lib/helpers";
import { logSecurityEvent, validateToken } from "@/lib/security";
import { rateLimitSubmit, rateLimitEdit, rateLimitView, formatResetTime } from "@/lib/rate-limit";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { ServerActionResponse, RSVPData, EditRSVPData } from "@/types";

/**
 * Server Action: Submit new RSVP
 *
 * Security measures:
 * - Validates all inputs with Zod schema
 * - Sanitizes data before storage
 * - Implements retry logic for API resilience
 * - Logs security events
 * - Returns generic error messages to prevent information disclosure
 *
 * @param formData - Unvalidated form data from client
 * @returns Server action response with success status and message
 */
export async function submitRSVP(
  formData: unknown
): Promise<ServerActionResponse<{ editLink: string }>> {
  try {
    // Check deadline first
    if (isDeadlinePassed()) {
      return {
        success: false,
        message: ERROR_MESSAGES.DEADLINE_PASSED,
      };
    }

    // Rate limiting: 3 submissions per 5 minutes per IP address
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const rateLimitResult = await rateLimitSubmit.limit(ip);

    if (!rateLimitResult.success) {
      // Log rate limit violation
      logSecurityEvent("rate_limit_exceeded", {
        action: "submitRSVP",
        ip: ip.split(",")[0], // Log only first IP for privacy
        resetIn: formatResetTime(rateLimitResult.reset),
      });

      return {
        success: false,
        message: `Terlalu banyak percubaan. Sila cuba lagi dalam ${formatResetTime(rateLimitResult.reset)}.`,
      };
    }

    // Validate form data with Zod schema
    const validation = rsvpSchema.safeParse(formData);

    if (!validation.success) {
      // Log validation failure (for security monitoring)
      logSecurityEvent("validation_failed", {
        action: "submitRSVP",
        errorCount: validation.error.issues?.length || 0,
      });

      const errors = validation.error.flatten().fieldErrors;
      return {
        success: false,
        message: "Sila betulkan maklumat yang diberikan.",
        errors: {
          nama: errors.nama?.[0] || "",
          statusKehadiran: errors.statusKehadiran?.[0] || "",
          bilanganOrang: errors.bilanganOrang?.[0] || "",
        },
      };
    }

    const data = validation.data;

    // Data is already validated and trimmed by Zod schema
    // Additional sanitization for Google Sheets happens in google-sheets.ts
    const sanitizedData: RSVPData = {
      nama: data.nama, // Already trimmed by Zod
      statusKehadiran: data.statusKehadiran,
      bilanganOrang: data.statusKehadiran === "hadir" ? data.bilanganOrang : undefined,
    };

    // Generate edit token and link
    const editToken = generateEditToken();
    const editLink = generateEditLink(editToken);

    // Append to Google Sheets with retry logic
    await retryWithBackoff(
      async () => await appendRSVPToSheet(sanitizedData, editLink),
      3,
      1000
    );

    // Revalidate homepage
    revalidatePath("/");

    return {
      success: true,
      message: sanitizedData.statusKehadiran === "hadir"
        ? "Terima kasih! RSVP anda telah berjaya dihantar. Kami tunggu kehadiran anda!"
        : "Terima kasih atas maklum balas anda.",
      data: { editLink },
    };
  } catch (error) {
    // Log detailed error server-side only (never send to client)
    console.error("[submitRSVP] Server error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    // Log security event for API errors
    if (error instanceof Error) {
      logSecurityEvent("api_error", {
        action: "submitRSVP",
        error: error.message,
      });
    }

    // Return generic error message to client (no information disclosure)
    // Different message for Google Sheets API errors vs unknown errors
    if (error instanceof Error && error.message.toLowerCase().includes("google")) {
      return {
        success: false,
        message: ERROR_MESSAGES.GOOGLE_SHEETS_ERROR,
      };
    }

    return {
      success: false,
      message: ERROR_MESSAGES.UNKNOWN_ERROR,
    };
  }
}

/**
 * Server Action: Update existing RSVP
 *
 * Security measures:
 * - Validates edit token format before processing
 * - Validates all inputs with Zod schema
 * - Ensures only authorized updates (token matches RSVP)
 * - Prevents mass assignment (only allows updating specific fields)
 * - Sanitizes data before storage
 * - Logs security events
 * - Returns generic error messages
 *
 * @param token - Edit token for authorization
 * @param formData - Unvalidated form data from client
 * @returns Server action response with success status
 */
export async function updateRSVP(
  token: string,
  formData: unknown
): Promise<ServerActionResponse> {
  try {
    // Check deadline first
    if (isDeadlinePassed()) {
      return {
        success: false,
        message: ERROR_MESSAGES.DEADLINE_PASSED,
      };
    }

    // Validate token format first (security check)
    const validatedToken = validateToken(token);
    if (!validatedToken) {
      logSecurityEvent("invalid_token", {
        action: "updateRSVP",
        reason: "invalid_format",
      });

      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_EDIT_TOKEN,
      };
    }

    // Rate limiting: 5 edits per minute per token
    const rateLimitResult = await rateLimitEdit.limit(validatedToken);

    if (!rateLimitResult.success) {
      // Log rate limit violation
      logSecurityEvent("rate_limit_exceeded", {
        action: "updateRSVP",
        token: validatedToken,
        resetIn: formatResetTime(rateLimitResult.reset),
      });

      return {
        success: false,
        message: `Terlalu banyak percubaan. Sila cuba lagi dalam ${formatResetTime(rateLimitResult.reset)}.`,
      };
    }

    // Additional Zod validation for token
    const tokenValidation = editTokenSchema.safeParse(validatedToken);
    if (!tokenValidation.success) {
      logSecurityEvent("invalid_token", {
        action: "updateRSVP",
        reason: "schema_validation_failed",
      });

      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_EDIT_TOKEN,
      };
    }

    // Fetch existing RSVP (authorization check - token must match)
    const existing = await retryWithBackoff(
      async () => await findRSVPByToken(validatedToken),
      3,
      1000
    );

    if (!existing) {
      // Log potential brute force attempt
      logSecurityEvent("invalid_token", {
        action: "updateRSVP",
        reason: "token_not_found",
      });

      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_EDIT_TOKEN,
      };
    }

    // Only allow editing if status was "Hadir"
    if (existing.data.statusKehadiran !== "hadir") {
      return {
        success: false,
        message: "Hanya RSVP dengan status 'Hadir' boleh dikemaskini.",
      };
    }

    // Validate form data with edit schema (only allows specific fields)
    const validation = editRsvpSchema.safeParse(formData);

    if (!validation.success) {
      logSecurityEvent("validation_failed", {
        action: "updateRSVP",
        errorCount: validation.error.issues?.length || 0,
      });

      const errors = validation.error.flatten().fieldErrors;
      return {
        success: false,
        message: "Sila betulkan maklumat yang diberikan.",
        errors: {
          nama: errors.nama?.[0] || "",
          bilanganOrang: errors.bilanganOrang?.[0] || "",
        },
      };
    }

    const data = validation.data;

    // Data is already validated and trimmed by Zod schema
    // Additional sanitization for Google Sheets happens in google-sheets.ts
    const sanitizedNama = data.nama;

    // Update in Google Sheets with retry logic
    // Only updates specific columns (prevents mass assignment)
    await retryWithBackoff(
      async () => await updateRSVPInSheet(
        existing.rowIndex,
        sanitizedNama,
        data.bilanganOrang
      ),
      3,
      1000
    );

    // Revalidate edit page
    revalidatePath(`/edit/${validatedToken}`);

    return {
      success: true,
      message: "RSVP anda telah berjaya dikemaskini!",
    };
  } catch (error) {
    // Log detailed error server-side only (never send to client)
    console.error("[updateRSVP] Server error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    // Log security event for API errors
    if (error instanceof Error) {
      logSecurityEvent("api_error", {
        action: "updateRSVP",
        error: error.message,
      });
    }

    // Return generic error message to client (no information disclosure)
    if (error instanceof Error && error.message.toLowerCase().includes("google")) {
      return {
        success: false,
        message: ERROR_MESSAGES.GOOGLE_SHEETS_ERROR,
      };
    }

    return {
      success: false,
      message: ERROR_MESSAGES.UNKNOWN_ERROR,
    };
  }
}

/**
 * Server Action: Fetch RSVP data for editing
 *
 * Security measures:
 * - Validates token format before processing
 * - Ensures only authorized access (token matches RSVP)
 * - Sanitizes data before returning to client
 * - Logs security events
 * - Returns generic error messages
 *
 * @param token - Edit token for authorization
 * @returns Server action response with RSVP data or error
 */
export async function fetchRSVPForEdit(
  token: string
): Promise<ServerActionResponse<EditRSVPData>> {
  try {
    // Check deadline first
    if (isDeadlinePassed()) {
      return {
        success: false,
        message: ERROR_MESSAGES.DEADLINE_PASSED,
      };
    }

    // Validate token format first (security check)
    const validatedToken = validateToken(token);
    if (!validatedToken) {
      logSecurityEvent("invalid_token", {
        action: "fetchRSVPForEdit",
        reason: "invalid_format",
      });

      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_EDIT_TOKEN,
      };
    }

    // Rate limiting: 10 views per minute per token
    const rateLimitResult = await rateLimitView.limit(validatedToken);

    if (!rateLimitResult.success) {
      // Log rate limit violation
      logSecurityEvent("rate_limit_exceeded", {
        action: "fetchRSVPForEdit",
        token: validatedToken,
        resetIn: formatResetTime(rateLimitResult.reset),
      });

      return {
        success: false,
        message: `Terlalu banyak percubaan. Sila cuba lagi dalam ${formatResetTime(rateLimitResult.reset)}.`,
      };
    }

    // Additional Zod validation for token
    const tokenValidation = editTokenSchema.safeParse(validatedToken);
    if (!tokenValidation.success) {
      logSecurityEvent("invalid_token", {
        action: "fetchRSVPForEdit",
        reason: "schema_validation_failed",
      });

      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_EDIT_TOKEN,
      };
    }

    // Fetch existing RSVP (authorization check - token must match)
    const existing = await retryWithBackoff(
      async () => await findRSVPByToken(validatedToken),
      3,
      1000
    );

    if (!existing) {
      // Log potential brute force attempt
      logSecurityEvent("invalid_token", {
        action: "fetchRSVPForEdit",
        reason: "token_not_found",
      });

      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_EDIT_TOKEN,
      };
    }

    // Only allow editing if status was "Hadir"
    if (existing.data.statusKehadiran !== "hadir") {
      return {
        success: false,
        message: "Hanya RSVP dengan status 'Hadir' boleh dikemaskini.",
      };
    }

    // Data is already sanitized by findRSVPByToken in google-sheets.ts
    return {
      success: true,
      data: {
        nama: existing.data.nama,
        bilanganOrang: existing.data.bilanganOrang || 1,
      },
    };
  } catch (error) {
    // Log detailed error server-side only (never send to client)
    console.error("[fetchRSVPForEdit] Server error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    // Log security event for API errors
    if (error instanceof Error) {
      logSecurityEvent("api_error", {
        action: "fetchRSVPForEdit",
        error: error.message,
      });
    }

    // Return generic error message to client (no information disclosure)
    if (error instanceof Error && error.message.toLowerCase().includes("google")) {
      return {
        success: false,
        message: ERROR_MESSAGES.GOOGLE_SHEETS_ERROR,
      };
    }

    return {
      success: false,
      message: ERROR_MESSAGES.UNKNOWN_ERROR,
    };
  }
}
