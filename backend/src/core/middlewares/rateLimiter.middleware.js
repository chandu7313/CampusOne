import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from '../../config/redis.js';

// ── Login rate limiter (strict) ─────────────────────────────────────
// 5 attempts per 15 minutes per IP; block for 15 minutes on breach
export const loginRateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rl:login',
  points: 5,
  duration: 900,      // 15 minutes
  blockDuration: 900, // also block for 15 minutes after hitting limit
});

// ── General API rate limiter ─────────────────────────────────────────
// 100 requests per minute per IP
export const apiRateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rl:api',
  points: 100,
  duration: 60,       // 1 minute
});

// ── Middleware factory ────────────────────────────────────────────────
/**
 * Returns an Express middleware that enforces the given limiter.
 * Returns 429 with Retry-After header when the limit is exceeded.
 *
 * @param {RateLimiterRedis} limiter
 */
export const rateLimitMiddleware = (limiter) => async (req, res, next) => {
  try {
    await limiter.consume(req.ip);
    next();
  } catch (rej) {
    const retryAfter = Math.ceil(rej.msBeforeNext / 1000);
    res.set('Retry-After', retryAfter);
    return res.status(429).json({
      success: false,
      message: `Too many requests. Try again in ${retryAfter} seconds.`,
      retryAfter,
    });
  }
};
