import {
  GLOBAL_DAILY_BUDGET,
  RATE_LIMIT_DAILY,
  RATE_LIMIT_HOURLY,
} from "@/lib/config";
import type { KvStore } from "@/lib/kv";

const HOUR_SECONDS = 60 * 60;
const DAY_SECONDS = 24 * HOUR_SECONDS;

export type LimitResult =
  | { ok: true }
  | {
      ok: false;
      reason: "ip_hourly" | "ip_daily" | "global_daily";
      retryAfterSeconds: number;
    };

function hourBucket(now: Date): string {
  return now.toISOString().slice(0, 13);
}

function dayBucket(now: Date): string {
  return now.toISOString().slice(0, 10);
}

function secondsToNextHour(now: Date): number {
  return HOUR_SECONDS - (now.getUTCMinutes() * 60 + now.getUTCSeconds());
}

function secondsToNextDay(now: Date): number {
  return (
    DAY_SECONDS -
    (now.getUTCHours() * HOUR_SECONDS +
      now.getUTCMinutes() * 60 +
      now.getUTCSeconds())
  );
}

async function bump(
  kv: KvStore,
  key: string,
  ttlSeconds: number,
): Promise<number> {
  const value = await kv.incr(key);
  if (value === 1) {
    await kv.expire(key, ttlSeconds);
  }
  return value;
}

export async function checkLimits(
  kv: KvStore,
  ip: string,
  now: Date = new Date(),
): Promise<LimitResult> {
  const hourly = await bump(
    kv,
    `rl:h:${ip}:${hourBucket(now)}`,
    HOUR_SECONDS,
  );
  if (hourly > RATE_LIMIT_HOURLY) {
    return {
      ok: false,
      reason: "ip_hourly",
      retryAfterSeconds: secondsToNextHour(now),
    };
  }

  const daily = await bump(kv, `rl:d:${ip}:${dayBucket(now)}`, DAY_SECONDS);
  if (daily > RATE_LIMIT_DAILY) {
    return {
      ok: false,
      reason: "ip_daily",
      retryAfterSeconds: secondsToNextDay(now),
    };
  }

  const global = await bump(kv, `budget:${dayBucket(now)}`, DAY_SECONDS);
  if (global > GLOBAL_DAILY_BUDGET) {
    return {
      ok: false,
      reason: "global_daily",
      retryAfterSeconds: secondsToNextDay(now),
    };
  }

  return { ok: true };
}
