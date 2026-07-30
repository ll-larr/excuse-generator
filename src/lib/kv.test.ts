import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMemoryKv, getKv, resetKvCacheForTests } from "@/lib/kv";

describe("createMemoryKv", () => {
  it("возвращает 1 при первом инкременте", async () => {
    const kv = createMemoryKv();
    expect(await kv.incr("ключ")).toBe(1);
  });

  it("наращивает счётчик при повторных вызовах", async () => {
    const kv = createMemoryKv();
    await kv.incr("ключ");
    await kv.incr("ключ");
    expect(await kv.incr("ключ")).toBe(3);
  });

  it("считает разные ключи независимо", async () => {
    const kv = createMemoryKv();
    await kv.incr("а");
    await kv.incr("а");
    expect(await kv.incr("б")).toBe(1);
  });

  it("не падает на expire", async () => {
    const kv = createMemoryKv();
    await kv.incr("ключ");
    await expect(kv.expire("ключ", 60)).resolves.not.toThrow();
  });
});

describe("getKv", () => {
  const savedEnv = { ...process.env };

  beforeEach(() => {
    resetKvCacheForTests();
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  afterEach(() => {
    process.env = { ...savedEnv };
    resetKvCacheForTests();
    vi.unstubAllEnvs();
  });

  it("на продакшене без переменных Upstash бросает, а не отдаёт счётчики в памяти", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => getKv()).toThrow(/Upstash Redis не настроен/);
  });

  it("вне продакшена без переменных откатывается в память", () => {
    vi.stubEnv("NODE_ENV", "test");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const kv = getKv();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
    expect(typeof kv.incr).toBe("function");
  });

  it("кэширует хранилище между вызовами", () => {
    vi.stubEnv("NODE_ENV", "test");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(getKv()).toBe(getKv());
    warn.mockRestore();
  });
});
