import { Redis } from "@upstash/redis";

export interface KvStore {
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<unknown>;
}

/**
 * Счётчики в памяти процесса. Для тестов и локального запуска без Redis.
 * На Vercel непригодно: у каждой функции своя память, лимиты не сойдутся.
 */
export function createMemoryKv(): KvStore {
  const counters = new Map<string, number>();
  return {
    async incr(key) {
      const next = (counters.get(key) ?? 0) + 1;
      counters.set(key, next);
      return next;
    },
    async expire() {
      return 1;
    },
  };
}

let cached: KvStore | null = null;

export function getKv(): KvStore {
  if (cached) return cached;

  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Upstash Redis не настроен: лимиты не работают, вызовы модели запрещены",
      );
    }
    console.warn(
      "Upstash Redis не настроен — лимиты работают в памяти процесса и на Vercel не действуют",
    );
    cached = createMemoryKv();
    return cached;
  }

  const redis = new Redis({ url, token });
  cached = {
    incr: (key) => redis.incr(key),
    expire: (key, seconds) => redis.expire(key, seconds),
  };
  return cached;
}

export function resetKvCacheForTests(): void {
  cached = null;
}
