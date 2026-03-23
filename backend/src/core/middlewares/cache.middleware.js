import redis from '../../config/redis.js';

/**
 * Express middleware to cache GET responses in Redis.
 * Cache key = "cache:{req.originalUrl}" (includes query string)
 * Falls through transparently on any Redis error.
 *
 * @param {number} ttlSeconds – how long to cache the response
 */
export const cache = (ttlSeconds) => async (req, res, next) => {
  const key = `cache:${req.originalUrl}`;

  try {
    const cached = await redis.get(key);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }
  } catch (err) {
    console.error('Cache read failed:', err.message);
    // Never block the request if Redis fails — always fall through
  }

  // Intercept res.json to store the response in cache after it's sent
  const originalJson = res.json.bind(res);
  res.json = async (body) => {
    if (res.statusCode === 200) {
      try {
        await redis.setex(key, ttlSeconds, JSON.stringify(body));
      } catch (err) {
        console.error('Cache write failed:', err.message);
      }
    }
    return originalJson(body);
  };

  next();
};
