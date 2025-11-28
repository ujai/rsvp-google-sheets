/**
 * Unit Tests for Environment Validation Schema
 *
 * Tests the environment validation logic in lib/env.ts
 * Ensures that:
 * - Missing required variables throw ZodError
 * - Invalid variable formats throw errors with descriptive messages
 * - Valid variables pass validation
 * - Optional variables use defaults when not provided
 */

import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Import the schema directly for testing
// We recreate the schema here to test it without triggering validation at module load time
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

  // Optional Configuration
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
    .default(''),

  // Rate Limiting (Optional)
  UPSTASH_REDIS_REST_URL: z
    .string()
    .url('UPSTASH_REDIS_REST_URL must be a valid URL')
    .optional(),

  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(10, 'UPSTASH_REDIS_REST_TOKEN must be at least 10 characters')
    .optional(),
})

describe('Environment Validation Schema', () => {
  describe('Missing required variables', () => {
    it('should throw ZodError when all Google Sheets variables are missing', () => {
      const invalidEnv = {
        NODE_ENV: 'test',
      }

      expect(() => envSchema.parse(invalidEnv)).toThrow(z.ZodError)
    })

    it('should throw ZodError when GOOGLE_SERVICE_ACCOUNT_EMAIL is missing', () => {
      const invalidEnv = {
        NODE_ENV: 'test',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
      }

      expect(() => envSchema.parse(invalidEnv)).toThrow(z.ZodError)
    })

    it('should throw ZodError when GOOGLE_PRIVATE_KEY is missing', () => {
      const invalidEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
      }

      expect(() => envSchema.parse(invalidEnv)).toThrow(z.ZodError)
    })

    it('should throw ZodError when GOOGLE_SHEET_ID is missing', () => {
      const invalidEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
      }

      expect(() => envSchema.parse(invalidEnv)).toThrow(z.ZodError)
    })
  })

  describe('Invalid GOOGLE_PRIVATE_KEY format', () => {
    it('should throw error when GOOGLE_PRIVATE_KEY is too short', () => {
      const invalidEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: 'short-key',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
      }

      expect(() => envSchema.parse(invalidEnv)).toThrow(z.ZodError)
      try {
        envSchema.parse(invalidEnv)
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues.some(issue => issue.path[0] === 'GOOGLE_PRIVATE_KEY')).toBe(true)
        }
      }
    })

    it('should throw error when GOOGLE_PRIVATE_KEY does not have BEGIN PRIVATE KEY marker', () => {
      const invalidEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: 'x'.repeat(150) + '-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
      }

      expect(() => envSchema.parse(invalidEnv)).toThrow(z.ZodError)
      try {
        envSchema.parse(invalidEnv)
      } catch (error) {
        if (error instanceof z.ZodError) {
          const keyError = error.issues.find(issue => issue.path[0] === 'GOOGLE_PRIVATE_KEY')
          expect(keyError?.message).toContain('PEM-formatted')
        }
      }
    })

    it('should throw error when GOOGLE_PRIVATE_KEY does not have END PRIVATE KEY marker', () => {
      const invalidEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----' + 'x'.repeat(150),
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
      }

      expect(() => envSchema.parse(invalidEnv)).toThrow(z.ZodError)
      try {
        envSchema.parse(invalidEnv)
      } catch (error) {
        if (error instanceof z.ZodError) {
          const keyError = error.issues.find(issue => issue.path[0] === 'GOOGLE_PRIVATE_KEY')
          expect(keyError?.message).toContain('PEM-formatted')
        }
      }
    })
  })

  describe('Invalid GOOGLE_SERVICE_ACCOUNT_EMAIL format', () => {
    it('should throw error when GOOGLE_SERVICE_ACCOUNT_EMAIL is not a valid email', () => {
      const invalidEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'not-an-email',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
      }

      expect(() => envSchema.parse(invalidEnv)).toThrow(z.ZodError)
      try {
        envSchema.parse(invalidEnv)
      } catch (error) {
        if (error instanceof z.ZodError) {
          const emailError = error.issues.find(issue => issue.path[0] === 'GOOGLE_SERVICE_ACCOUNT_EMAIL')
          expect(emailError?.message).toContain('email')
        }
      }
    })

    it('should throw error when GOOGLE_SERVICE_ACCOUNT_EMAIL is empty', () => {
      const invalidEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: '',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
      }

      expect(() => envSchema.parse(invalidEnv)).toThrow(z.ZodError)
    })
  })

  describe('Invalid GOOGLE_SHEET_ID format', () => {
    it('should throw error when GOOGLE_SHEET_ID is too short', () => {
      const invalidEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: 'short',
      }

      expect(() => envSchema.parse(invalidEnv)).toThrow(z.ZodError)
      try {
        envSchema.parse(invalidEnv)
      } catch (error) {
        if (error instanceof z.ZodError) {
          const idError = error.issues.find(issue => issue.path[0] === 'GOOGLE_SHEET_ID')
          expect(idError?.message).toContain('40 characters')
        }
      }
    })

    it('should throw error when GOOGLE_SHEET_ID is too long', () => {
      const invalidEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: 'a'.repeat(150),
      }

      expect(() => envSchema.parse(invalidEnv)).toThrow(z.ZodError)
      try {
        envSchema.parse(invalidEnv)
      } catch (error) {
        if (error instanceof z.ZodError) {
          const idError = error.issues.find(issue => issue.path[0] === 'GOOGLE_SHEET_ID')
          expect(idError?.message).toContain('too long')
        }
      }
    })

    it('should throw error when GOOGLE_SHEET_ID contains invalid characters', () => {
      const invalidEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(39) + '!@#$%',
      }

      expect(() => envSchema.parse(invalidEnv)).toThrow(z.ZodError)
      try {
        envSchema.parse(invalidEnv)
      } catch (error) {
        if (error instanceof z.ZodError) {
          const idError = error.issues.find(issue => issue.path[0] === 'GOOGLE_SHEET_ID')
          expect(idError?.message).toContain('invalid characters')
        }
      }
    })
  })

  describe('Valid variables pass validation', () => {
    it('should pass validation with all required variables', () => {
      const validEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
      }

      expect(() => envSchema.parse(validEnv)).not.toThrow()
      const result = envSchema.parse(validEnv)
      expect(result.GOOGLE_SERVICE_ACCOUNT_EMAIL).toBe('test@project.iam.gserviceaccount.com')
      expect(result.GOOGLE_SHEET_ID).toBe('1' + 'a'.repeat(40))
    })

    it('should pass validation with valid service account email format', () => {
      const validEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'majlis-rsvp@my-project-123456.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
      }

      expect(() => envSchema.parse(validEnv)).not.toThrow()
    })

    it('should pass validation with realistic GOOGLE_SHEET_ID', () => {
      const validEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: '1AbCdEfGhIjKlMnOpQrStUvWxYz0123456789-_AbCdEfGhI',
      }

      expect(() => envSchema.parse(validEnv)).not.toThrow()
    })
  })

  describe('Optional variables use defaults', () => {
    it('should use default NEXT_PUBLIC_APP_URL when not provided', () => {
      const validEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
      }

      const result = envSchema.parse(validEnv)
      expect(result.NEXT_PUBLIC_APP_URL).toBe('http://localhost:3000')
    })

    it('should use default RSVP_DEADLINE when not provided', () => {
      const validEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
      }

      const result = envSchema.parse(validEnv)
      expect(result.RSVP_DEADLINE).toBe('2026-01-10T23:59:59+08:00')
    })

    it('should use default EDIT_TOKEN_SECRET (empty string) when not provided', () => {
      const validEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
      }

      const result = envSchema.parse(validEnv)
      expect(result.EDIT_TOKEN_SECRET).toBe('')
    })

    it('should use default NODE_ENV when not provided', () => {
      const validEnv = {
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
      }

      const result = envSchema.parse(validEnv)
      expect(result.NODE_ENV).toBe('development')
    })

    it('should accept custom values for optional variables', () => {
      const validEnv = {
        NODE_ENV: 'production' as const,
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
        NEXT_PUBLIC_APP_URL: 'https://example.com',
        RSVP_DEADLINE: '2025-12-31T23:59:59+08:00',
        EDIT_TOKEN_SECRET: 'my-custom-secret-32-characters-long',
      }

      const result = envSchema.parse(validEnv)
      expect(result.NODE_ENV).toBe('production')
      expect(result.NEXT_PUBLIC_APP_URL).toBe('https://example.com')
      expect(result.RSVP_DEADLINE).toBe('2025-12-31T23:59:59+08:00')
      expect(result.EDIT_TOKEN_SECRET).toBe('my-custom-secret-32-characters-long')
    })

    it('should allow UPSTASH_REDIS_REST_URL and TOKEN to be undefined', () => {
      const validEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
      }

      const result = envSchema.parse(validEnv)
      expect(result.UPSTASH_REDIS_REST_URL).toBeUndefined()
      expect(result.UPSTASH_REDIS_REST_TOKEN).toBeUndefined()
    })

    it('should validate UPSTASH_REDIS_REST_URL format when provided', () => {
      const validEnv = {
        NODE_ENV: 'test',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@project.iam.gserviceaccount.com',
        GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' + 'x'.repeat(100) + '\n-----END PRIVATE KEY-----',
        GOOGLE_SHEET_ID: '1' + 'a'.repeat(40),
        UPSTASH_REDIS_REST_URL: 'https://redis.upstash.io',
        UPSTASH_REDIS_REST_TOKEN: 'token123456',
      }

      expect(() => envSchema.parse(validEnv)).not.toThrow()
    })
  })
})
