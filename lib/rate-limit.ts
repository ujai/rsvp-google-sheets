/**
 * Rate Limiting Infrastructure
 *
 * Implements rate limiting to prevent abuse and protect against:
 * - Brute force attacks on edit tokens
 * - Denial of Service (DoS) through rapid submissions
 * - Automated bot submissions
 * - Resource exhaustion
 *
 * Uses Upstash Redis for distributed rate limiting across serverless functions.
 * Falls back to in-memory rate limiting for development if Upstash is not configured.
 *
 * Security References:
 * - OWASP API Security Top 10: API4:2023 - Unrestricted Resource Consumption
 * - OWASP API Security Top 10: API6:2023 - Unrestricted Access to Sensitive Business Flows
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate Limiting Configuration
 *
 * These limits are designed to balance security with user experience:
 * - Strict enough to prevent abuse
 * - Lenient enough for legitimate users
 */
const RATE_LIMITS = {
  // RSVP Submission: 3 submissions per 5 minutes per IP address
  // Prevents spam submissions while allowing legitimate corrections
  SUBMIT_WINDOW: 5 * 60 * 1000, // 5 minutes in milliseconds
  SUBMIT_MAX: 3, // Maximum 3 submissions

  // RSVP Edit: 5 edits per minute per token
  // Allows multiple quick edits while preventing abuse
  EDIT_WINDOW: 60 * 1000, // 1 minute in milliseconds
  EDIT_MAX: 5, // Maximum 5 edits

  // RSVP View/Fetch: 10 views per minute per token
  // Generous limit for viewing edit page
  VIEW_WINDOW: 60 * 1000, // 1 minute in milliseconds
  VIEW_MAX: 10, // Maximum 10 views
} as const;

/**
 * Initialize Redis client for rate limiting
 *
 * Uses Upstash Redis REST API for serverless compatibility.
 * Environment variables required:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */
function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn(
      "[Rate Limit] Upstash credentials not configured. Rate limiting will be in-memory only."
    );
    console.warn(
      "[Rate Limit] For production, configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN"
    );
    return null;
  }

  try {
    return new Redis({
      url,
      token,
    });
  } catch (error) {
    console.error("[Rate Limit] Failed to initialize Redis:", error);
    return null;
  }
}

/**
 * In-memory rate limiter for development/fallback
 *
 * This is a simple implementation that stores rate limit data in memory.
 * Limitations:
 * - Not shared across multiple serverless functions
 * - Resets when function cold-starts
 * - Not suitable for production (use Upstash instead)
 */
class InMemoryRateLimiter {
  private cache: Map<string, { count: number; resetAt: number }> = new Map();

  async limit(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const now = Date.now();
    const entry = this.cache.get(identifier);

    // Clean up expired entries
    if (entry && now >= entry.resetAt) {
      this.cache.delete(identifier);
    }

    const current = this.cache.get(identifier);

    if (!current) {
      // First request in window
      this.cache.set(identifier, {
        count: 1,
        resetAt: now + windowMs,
      });

      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - 1,
        reset: now + windowMs,
      };
    }

    // Increment count
    current.count++;

    if (current.count > maxRequests) {
      // Rate limit exceeded
      return {
        success: false,
        limit: maxRequests,
        remaining: 0,
        reset: current.resetAt,
      };
    }

    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - current.count,
      reset: current.resetAt,
    };
  }
}

// Initialize in-memory fallback
const inMemoryLimiter = new InMemoryRateLimiter();

// Initialize Redis client
const redis = getRedisClient();

/**
 * Create rate limiter with fallback
 *
 * @param maxRequests - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @param prefix - Prefix for Redis keys (for isolation)
 * @returns Rate limiter instance
 */
function createRateLimiter(
  maxRequests: number,
  windowMs: number,
  prefix: string
): {
  limit: (
    identifier: string
  ) => Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }>;
} {
  if (redis) {
    // Use Upstash Redis for distributed rate limiting
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxRequests, `${windowMs} ms`),
      prefix: `rsvp_${prefix}`,
      analytics: true, // Enable analytics in Upstash dashboard
    });

    return {
      limit: async (identifier: string) => {
        const result = await limiter.limit(identifier);
        return {
          success: result.success,
          limit: result.limit,
          remaining: result.remaining,
          reset: result.reset,
        };
      },
    };
  } else {
    // Fall back to in-memory rate limiting for development
    console.warn(`[Rate Limit] Using in-memory limiter for: ${prefix}`);
    return {
      limit: async (identifier: string) => {
        return inMemoryLimiter.limit(identifier, maxRequests, windowMs);
      },
    };
  }
}

/**
 * Rate Limiter: RSVP Submission
 *
 * Limits new RSVP submissions to prevent spam and abuse.
 * Applied per IP address.
 *
 * Configuration:
 * - 3 submissions per 5 minutes per IP
 * - Sliding window algorithm
 *
 * Usage:
 * ```typescript
 * const ip = headers().get('x-forwarded-for') || 'unknown'
 * const { success, reset } = await rateLimitSubmit.limit(ip)
 * if (!success) {
 *   return { error: `Rate limit exceeded. Try again at ${new Date(reset)}` }
 * }
 * ```
 */
export const rateLimitSubmit = createRateLimiter(
  RATE_LIMITS.SUBMIT_MAX,
  RATE_LIMITS.SUBMIT_WINDOW,
  "submit"
);

/**
 * Rate Limiter: RSVP Edit
 *
 * Limits edit operations to prevent abuse of edit functionality.
 * Applied per edit token.
 *
 * Configuration:
 * - 5 edits per minute per token
 * - Sliding window algorithm
 *
 * Usage:
 * ```typescript
 * const { success, reset } = await rateLimitEdit.limit(token)
 * if (!success) {
 *   return { error: 'Too many edit attempts' }
 * }
 * ```
 */
export const rateLimitEdit = createRateLimiter(
  RATE_LIMITS.EDIT_MAX,
  RATE_LIMITS.EDIT_WINDOW,
  "edit"
);

/**
 * Rate Limiter: RSVP View
 *
 * Limits view/fetch operations for edit pages.
 * Applied per edit token.
 *
 * Configuration:
 * - 10 views per minute per token
 * - Sliding window algorithm
 *
 * Usage:
 * ```typescript
 * const { success } = await rateLimitView.limit(token)
 * if (!success) {
 *   return { error: 'Too many requests' }
 * }
 * ```
 */
export const rateLimitView = createRateLimiter(
  RATE_LIMITS.VIEW_MAX,
  RATE_LIMITS.VIEW_WINDOW,
  "view"
);

/**
 * Format rate limit reset time for user display
 *
 * @param resetTimestamp - Reset timestamp in milliseconds
 * @returns Human-readable time until reset
 *
 * @example
 * formatResetTime(Date.now() + 60000) // "1 minute"
 * formatResetTime(Date.now() + 300000) // "5 minutes"
 */
export function formatResetTime(resetTimestamp: number): string {
  const now = Date.now();
  const diffMs = resetTimestamp - now;

  if (diffMs <= 0) {
    return "now";
  }

  const diffSeconds = Math.ceil(diffMs / 1000);
  const diffMinutes = Math.ceil(diffMs / 60000);

  if (diffSeconds < 60) {
    return `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""}`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""}`;
  } else {
    const diffHours = Math.ceil(diffMs / 3600000);
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
  }
}
