import crypto from "crypto";
import { getAppUrl, getRsvpDeadline } from "./constants";

/**
 * Generate a cryptographically secure unique edit token
 *
 * Security Requirements (OWASP, NIST):
 * - Uses Node.js crypto.randomBytes() for cryptographic randomness
 * - Generates 32 bytes (256 bits) of entropy
 * - Converted to hexadecimal (64 characters)
 * - Tokens are unpredictable and resistant to brute force attacks
 *
 * Note: Previous implementation used nanoid(16) which only provided
 * 16 characters (~95 bits entropy). This implementation provides
 * 256 bits of entropy, exceeding NIST recommendations (128 bits minimum).
 *
 * @returns Cryptographically secure random token (64 hex characters)
 *
 * @example
 * const token = generateEditToken()
 * // Returns: "a3f5b8c2d1e9f7a4b6c8d2e5f1a7b3c9d4e8f2a5b7c9d1e3f5a8b2c4d6e8f1a3"
 */
export function generateEditToken(): string {
  // Generate 32 bytes (256 bits) of cryptographically secure random data
  // This provides significantly more entropy than the previous nanoid(16)
  return crypto.randomBytes(32).toString("hex"); // 64 hex characters
}

/**
 * Generate edit URL from token
 */
export function generateEditLink(token: string): string {
  return `${getAppUrl()}/edit/${token}`;
}

/**
 * Check if RSVP deadline has passed
 */
export function isDeadlinePassed(): boolean {
  return new Date() > getRsvpDeadline();
}

/**
 * Calculate days remaining until deadline
 */
export function getDaysUntilDeadline(): number {
  const now = new Date();
  const diffTime = getRsvpDeadline().getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Format date in Malaysian format (DD.MM.YYYY)
 */
export function formatDateMY(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}
