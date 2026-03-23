import redis from '../config/redis.js';

/**
 * Invalidate one or more cache key patterns.
 * Patterns support Redis glob syntax: e.g. "/api/v1/timetables*"
 *
 * @param {...string} patterns
 */
export const invalidateCache = async (...patterns) => {
  for (const pattern of patterns) {
    try {
      const keys = await redis.keys(`cache:${pattern}`);
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(`🗑️  Invalidated ${keys.length} cache key(s): ${pattern}`);
      }
    } catch (err) {
      console.error(`Cache invalidation failed for pattern "${pattern}":`, err.message);
    }
  }
};
