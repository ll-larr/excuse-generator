import { describe, expect, it } from "vitest";
import { createMemoryKv } from "@/lib/kv";
import type { KvStore } from "@/lib/kv";
import { checkLimits } from "@/lib/limits";
import {
  GLOBAL_DAILY_BUDGET,
  RATE_LIMIT_DAILY,
  RATE_LIMIT_HOURLY,
} from "@/lib/config";

const NOW = new Date("2026-07-30T12:30:00Z");

function trackingKv(): {
  kv: KvStore;
  incrCalls: string[];
  expireCalls: string[];
} {
  const counters = new Map<string, number>();
  const incrCalls: string[] = [];
  const expireCalls: string[] = [];
  return {
    kv: {
      async incr(key) {
        incrCalls.push(key);
        const next = (counters.get(key) ?? 0) + 1;
        counters.set(key, next);
        return next;
      },
      async expire(key) {
        expireCalls.push(key);
        return 1;
      },
    },
    incrCalls,
    expireCalls,
  };
}

describe("checkLimits", () => {
  it("пропускает первый запрос", async () => {
    const kv = createMemoryKv();
    expect(await checkLimits(kv, "1.1.1.1", NOW)).toEqual({ ok: true });
  });

  it("пропускает ровно RATE_LIMIT_HOURLY запросов", async () => {
    const kv = createMemoryKv();
    for (let i = 0; i < RATE_LIMIT_HOURLY; i++) {
      expect(await checkLimits(kv, "1.1.1.1", NOW)).toEqual({ ok: true });
    }
  });

  it("режет запрос сверх часового лимита", async () => {
    const kv = createMemoryKv();
    for (let i = 0; i < RATE_LIMIT_HOURLY; i++) {
      await checkLimits(kv, "1.1.1.1", NOW);
    }
    const result = await checkLimits(kv, "1.1.1.1", NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("ip_hourly");
  });

  it("не смешивает разные IP", async () => {
    const kv = createMemoryKv();
    for (let i = 0; i < RATE_LIMIT_HOURLY; i++) {
      await checkLimits(kv, "1.1.1.1", NOW);
    }
    expect(await checkLimits(kv, "2.2.2.2", NOW)).toEqual({ ok: true });
  });

  it("сбрасывает часовой счётчик в следующем часу", async () => {
    const kv = createMemoryKv();
    for (let i = 0; i < RATE_LIMIT_HOURLY; i++) {
      await checkLimits(kv, "1.1.1.1", NOW);
    }
    const nextHour = new Date("2026-07-30T13:00:00Z");
    expect(await checkLimits(kv, "1.1.1.1", nextHour)).toEqual({ ok: true });
  });

  it("режет по суточному лимиту IP, растянутому по часам", async () => {
    const kv = createMemoryKv();
    let hour = 0;
    for (let i = 0; i < RATE_LIMIT_DAILY; i++) {
      if (i > 0 && i % RATE_LIMIT_HOURLY === 0) hour++;
      const at = new Date(`2026-07-30T${String(hour).padStart(2, "0")}:00:00Z`);
      const result = await checkLimits(kv, "1.1.1.1", at);
      expect(result).toEqual({ ok: true });
    }
    const at = new Date("2026-07-30T20:00:00Z");
    const result = await checkLimits(kv, "1.1.1.1", at);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("ip_daily");
  });

  it("режет по глобальному дневному бюджету", async () => {
    const kv = createMemoryKv();
    for (let i = 0; i < GLOBAL_DAILY_BUDGET; i++) {
      await checkLimits(kv, `10.0.${Math.floor(i / 250)}.${i % 250}`, NOW);
    }
    const result = await checkLimits(kv, "9.9.9.9", NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("global_daily");
  });

  it("отдаёт положительный retryAfterSeconds при отказе", async () => {
    const kv = createMemoryKv();
    for (let i = 0; i < RATE_LIMIT_HOURLY; i++) {
      await checkLimits(kv, "1.1.1.1", NOW);
    }
    const result = await checkLimits(kv, "1.1.1.1", NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("ставит TTL ровно один раз на ключ, при первом инкременте", async () => {
    const { kv, expireCalls } = trackingKv();
    await checkLimits(kv, "1.1.1.1", NOW);
    await checkLimits(kv, "1.1.1.1", NOW);
    await checkLimits(kv, "1.1.1.1", NOW);

    expect(expireCalls).toHaveLength(3);
    expect(expireCalls.filter((key) => key.startsWith("rl:h:"))).toHaveLength(1);
    expect(expireCalls.filter((key) => key.startsWith("rl:d:"))).toHaveLength(1);
    expect(expireCalls.filter((key) => key.startsWith("budget:"))).toHaveLength(1);
  });

  it("не тратит глобальный бюджет на запрос, отклонённый часовым лимитом IP", async () => {
    const { kv, incrCalls } = trackingKv();
    for (let i = 0; i < RATE_LIMIT_HOURLY; i++) {
      await checkLimits(kv, "1.1.1.1", NOW);
    }
    const budgetBefore = incrCalls.filter((key) =>
      key.startsWith("budget:"),
    ).length;

    const result = await checkLimits(kv, "1.1.1.1", NOW);

    const budgetAfter = incrCalls.filter((key) =>
      key.startsWith("budget:"),
    ).length;
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("ip_hourly");
    expect(budgetAfter).toBe(budgetBefore);
  });

  it("не тратит глобальный бюджет на запрос, отклонённый суточным лимитом IP", async () => {
    const { kv, incrCalls } = trackingKv();
    let hour = 0;
    for (let i = 0; i < RATE_LIMIT_DAILY; i++) {
      if (i > 0 && i % RATE_LIMIT_HOURLY === 0) hour++;
      const at = new Date(`2026-07-30T${String(hour).padStart(2, "0")}:00:00Z`);
      await checkLimits(kv, "1.1.1.1", at);
    }
    const budgetBefore = incrCalls.filter((key) =>
      key.startsWith("budget:"),
    ).length;

    const result = await checkLimits(
      kv,
      "1.1.1.1",
      new Date("2026-07-30T20:00:00Z"),
    );

    const budgetAfter = incrCalls.filter((key) =>
      key.startsWith("budget:"),
    ).length;
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("ip_daily");
    expect(budgetAfter).toBe(budgetBefore);
  });
});
