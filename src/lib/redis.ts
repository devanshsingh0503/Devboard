import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCached(key: string) {
  return await redis.get(key);
}

export async function setCache(key: string, value: unknown) {
  // Cache for 24 hours
  await redis.set(key, JSON.stringify(value), { ex: 86400 });
}
