import { z } from "zod";

/**
 * Security-Enhanced Validation Schemas
 *
 * These schemas provide comprehensive input validation to prevent:
 * - XSS attacks (script injection)
 * - Formula injection in Google Sheets
 * - Buffer overflow attacks (length limits)
 * - Invalid character injection
 * - Type confusion attacks
 */

/**
 * Name validation with security controls
 *
 * Rules:
 * - Length: 1-100 characters (prevents buffer overflow)
 * - Characters: Letters, spaces, hyphens, apostrophes only (prevents injection)
 * - Trimmed and normalized (prevents whitespace exploitation)
 * - Unicode support for Malaysian names
 */
const nameSchema = z
  .string({
    message: "Nama mestilah teks.",
  })
  .min(1, "Nama diperlukan.")
  .max(100, "Nama terlalu panjang (maksimum 100 aksara).")
  .trim()
  .regex(
    /^[a-zA-Z\u00C0-\u017F\s'\-\.]+$/,
    "Nama hanya boleh mengandungi huruf, ruang, apostrof ('), tanda sempang (-) dan noktah (.)"
  );

/**
 * Attendance status validation
 *
 * Strict enum to prevent injection attacks
 */
const statusKehadiranSchema = z.enum(["hadir", "tidak_hadir"], {
  message: "Sila pilih status kehadiran.",
});

/**
 * Guest count validation with security controls
 *
 * Rules:
 * - Type: Integer only (prevents type confusion)
 * - Range: 1-10 (prevents abuse, reasonable limit)
 * - Required when attending
 */
const bilanganOrangSchema = z
  .number({
    message: "Bilangan mestilah nombor.",
  })
  .int({ message: "Bilangan mestilah nombor bulat." })
  .min(1, { message: "Bilangan minimum adalah 1 orang." })
  .max(10, { message: "Bilangan maksimum adalah 10 orang." });

/**
 * RSVP Form Validation Schema
 *
 * Main schema for new RSVP submissions
 * Validates all required fields with security controls
 */
export const rsvpSchema = z
  .object({
    nama: nameSchema,
    statusKehadiran: statusKehadiranSchema,
    bilanganOrang: bilanganOrangSchema.optional(),
  })
  .refine(
    (data) => {
      // If "hadir", bilanganOrang must be provided and valid
      if (data.statusKehadiran === "hadir") {
        return data.bilanganOrang !== undefined && data.bilanganOrang > 0;
      }
      return true;
    },
    {
      message: "Sila nyatakan bilangan orang yang akan hadir.",
      path: ["bilanganOrang"],
    }
  );

/**
 * Edit RSVP Validation Schema
 *
 * Used for editing existing RSVPs
 * Only allows updating specific fields (name and guest count)
 * Excludes system fields (id, token, timestamp, status) to prevent mass assignment
 */
export const editRsvpSchema = z.object({
  nama: nameSchema,
  bilanganOrang: bilanganOrangSchema,
});

/**
 * Edit Token Validation Schema
 *
 * Validates edit tokens to ensure they meet security requirements
 * Tokens are 64 characters (32 bytes of cryptographic randomness in hexadecimal)
 *
 * Security requirements:
 * - Exactly 64 characters (256 bits of entropy)
 * - Hexadecimal format only ([0-9a-f]+)
 * - Generated using crypto.randomBytes(32)
 */
export const editTokenSchema = z
  .string({
    message: "Token tidak sah.",
  })
  .length(64, "Token tidak sah.")
  .regex(/^[a-f0-9]+$/, "Token tidak sah.");

/**
 * Type inference from Zod schemas
 */
export type RSVPFormData = z.infer<typeof rsvpSchema>;
export type EditRSVPFormData = z.infer<typeof editRsvpSchema>;
export type EditToken = z.infer<typeof editTokenSchema>;
