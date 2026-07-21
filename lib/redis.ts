import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var __degenWarriorSiteRedis: Redis | undefined;
}

export const redis = global.__degenWarriorSiteRedis ?? new Redis(process.env.REDIS_URL || "redis://localhost:6379");

if (process.env.NODE_ENV !== "production") {
  global.__degenWarriorSiteRedis = redis;
}
