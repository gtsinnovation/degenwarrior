import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "./redis";

// Public waitlist endpoint is the only unauthenticated write path on this
// site, so it's the only thing that needs rate limiting today. Keyed by IP.
export const waitlistLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl:waitlist",
  points: 5, // 5 submissions
  duration: 60 * 10, // per 10 minutes per IP
});

export async function checkWaitlistRateLimit(ip: string): Promise<boolean> {
  try {
    await waitlistLimiter.consume(ip);
    return true;
  } catch {
    return false;
  }
}
