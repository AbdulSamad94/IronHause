import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const RATE_LIMIT_REQUESTS = 50;
const RATE_LIMIT_WINDOW = '1 h';

function initRateLimiter(): Ratelimit | null {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  if (!redisUrl) return null;
  
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW),
    analytics: true,
  });
}

const ratelimit = initRateLimiter();

/**
 * Validates the rate limit for the incoming request.
 * Returns a NextResponse if the limit is exceeded, null otherwise.
 */
export async function checkRateLimit(request: Request): Promise<NextResponse | null> {
  if (!ratelimit) return null;

  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString()
        }
      }
    );
  }
  return null;
}
