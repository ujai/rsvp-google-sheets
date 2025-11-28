import { z } from 'zod'

/**
 * Environment Variable Validation Schema
 *
 * This module validates all required environment variables at application startup
 * to prevent runtime errors from missing or invalid configuration.
 *
 * Why Google Sheets is MANDATORY:
 * - The application's core functionality depends on storing RSVPs in Google Sheets
 * - Without Google Sheets, users cannot submit or edit RSVPs
 * - Making it optional would require implementing an alternative database
 * - Strict validation ensures configuration issues are caught at startup, not runtime
 *
 * Dual Environment Setup:
 * - Development: Uses .env.local file (not committed to git)
 * - Production: Uses platform environment variables (Vercel, Railway, etc.)
 * - Each environment should have its own Google Sheet with separate credentials
 * - This ensures development testing doesn't affect production data
 *
 * Security notes:
 * - This file should only be imported in server-side code
 * - Never import this in client components ('use client')
 * - Environment variables are validated once at startup
 * - Credentials never exposed to client-side code
 */

const envSchema = z.object({
  // Google Sheets API Configuration
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z
    .string()
    .email('GOOGLE_SERVICE_ACCOUNT_EMAIL must be a valid email address')
    .min(1, 'GOOGLE_SERVICE_ACCOUNT_EMAIL is required'),

  GOOGLE_PRIVATE_KEY: z
    .string()
    .min(100, 'GOOGLE_PRIVATE_KEY must be at least 100 characters (valid private key)')
    .refine(
      (val) => val.includes('BEGIN PRIVATE KEY') && val.includes('END PRIVATE KEY'),
      'GOOGLE_PRIVATE_KEY must be a valid PEM-formatted private key'
    ),

  GOOGLE_SHEET_ID: z
    .string()
    .min(40, 'GOOGLE_SHEET_ID must be at least 40 characters')
    .max(100, 'GOOGLE_SHEET_ID is too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'GOOGLE_SHEET_ID contains invalid characters'),

  // Node Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Optional Configuration - these have defaults in the application
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL')
    .default('http://localhost:3000'),

  RSVP_DEADLINE: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      'RSVP_DEADLINE must be a valid datetime string'
    )
    .default('2026-01-10T23:59:59+08:00'),

  EDIT_TOKEN_SECRET: z
    .string()
    .default(''), // Optional, can be empty (will use crypto.randomBytes in helpers)

  // Rate Limiting (Optional - Upstash Redis)
  // If not configured, falls back to in-memory rate limiting (development only)
  UPSTASH_REDIS_REST_URL: z
    .string()
    .url('UPSTASH_REDIS_REST_URL must be a valid URL')
    .optional(),

  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(10, 'UPSTASH_REDIS_REST_TOKEN must be at least 10 characters')
    .optional(),
})

/**
 * Parse and validate environment variables with enhanced error messaging
 *
 * This function wraps the Zod schema validation to provide clear, actionable
 * error messages when required Google Sheets credentials are missing or invalid.
 *
 * Error Handling Strategy:
 * - Catches ZodError during validation
 * - Displays formatted error message with specific missing/invalid variables (server-side only)
 * - Provides 3-step resolution path to guide developers
 * - References documentation for detailed setup instructions
 * - Re-throws error to maintain strict validation (application should not start)
 *
 * Why Fail Fast:
 * - Prevents confusing runtime errors during operation
 * - Makes configuration issues immediately obvious
 * - Provides clear guidance for resolution at startup
 * - Better than failing when user tries to submit first RSVP
 *
 * Dual Environment Setup:
 * - Development: Use .env.local (not committed to git)
 * - Production: Configure environment variables in deployment platform
 * - Each environment should have its own Google Sheet with separate credentials
 * - Never use production credentials in development or vice versa
 *
 * @throws {ZodError} When validation fails (after displaying helpful error message)
 */
function validateEnvironment() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Only display error messages on server-side during runtime (not build time)
      if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
        // Display clear, formatted error message
        console.error('\n' + '='.repeat(70))
        console.error('CONFIGURATION ERROR: Missing Google Sheets Credentials')
        console.error('='.repeat(70))
        console.error('\nThe application requires Google Sheets environment variables.\n')

        console.error('Missing or invalid variables:')
        error.issues.forEach(issue => {
          const field = issue.path.join('.')
          console.error(`  \u274C ${field}: ${issue.message}`)
        })

        console.error('\n' + '-'.repeat(70))
        console.error('Resolution Steps:')
        console.error('-'.repeat(70))
        console.error('1. Copy .env.example to .env.local:')
        console.error('   $ cp .env.example .env.local\n')
        console.error('2. Follow the Google Sheets setup guide:')
        console.error('   docs/google-sheets-setup.md\n')
        console.error('3. Configure your credentials in .env.local\n')
        console.error('For troubleshooting, see: docs/troubleshooting.md')
        console.error('='.repeat(70) + '\n')
      }
    }
    // Re-throw to maintain strict validation (application should not start)
    throw error
  }
}

// Lazy-load environment variables to avoid build-time validation issues in Next.js 15+
let _env: z.infer<typeof envSchema> | null = null

/**
 * Validated environment variables
 *
 * This object contains all validated environment variables.
 * Access environment variables through this object instead of process.env directly.
 *
 * Uses lazy loading to ensure validation happens at runtime, not build time.
 * This is necessary for Next.js 15+ with Turbopack where process.env may not
 * be fully populated during the module evaluation phase.
 *
 * @example
 * import { env } from '@/lib/env'
 * const sheetId = env.GOOGLE_SHEET_ID // Type-safe and validated
 */
export const env = new Proxy({} as z.infer<typeof envSchema>, {
  get(_target, prop) {
    if (!_env) {
      _env = validateEnvironment()
    }
    return _env[prop as keyof typeof _env]
  },
})

/**
 * Type definition for environment variables
 * Useful for type checking in other parts of the application
 */
export type Env = z.infer<typeof envSchema>
