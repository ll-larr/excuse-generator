import { describe, expect, it } from "vitest";
import { createMemoryKv } from "@/lib/kv";

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
