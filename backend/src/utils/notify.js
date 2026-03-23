import redis from '../config/redis.js';

/**
 * Publish a real-time notification to a user via Redis Pub/Sub,
 * and persist it in their Redis notification list (last 50, 7-day TTL).
 *
 * @param {string|number} userId
 * @param {{ type: string, title: string, message: string, link?: string }} notification
 */
export const notify = async (userId, notification) => {
  const payload = JSON.stringify({
    userId,
    data: {
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    },
  });

  try {
    // Real-time push via Pub/Sub
    await redis.publish('notifications', payload);

    // Persist so user sees notifications after reconnect (last 50, 7 days)
    await redis.lpush(`notifications:${userId}`, payload);
    await redis.ltrim(`notifications:${userId}`, 0, 49);
    await redis.expire(`notifications:${userId}`, 604800); // 7 days
  } catch (err) {
    console.error('notify() failed:', err.message);
  }
};

/**
 * Retrieve the last 50 notifications for a user.
 *
 * @param {string|number} userId
 * @returns {Array<object>}
 */
export const getNotifications = async (userId) => {
  try {
    const items = await redis.lrange(`notifications:${userId}`, 0, 49);
    return items.map((i) => JSON.parse(i).data);
  } catch (err) {
    console.error('getNotifications() failed:', err.message);
    return [];
  }
};
