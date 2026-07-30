import { beforeEach, describe, expect, it, vi } from "vitest";
import { RATE_LIMIT_HOURLY } from "@/lib/config";

const generateExcuseMock = vi.fn();

vi.mock("@/lib/excuse/client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/excuse/client")>(
    "@/lib/excuse/client",
  );
  return {
    ...actual,
    getAnthropicClient: () => ({ messages: { parse: vi.fn() } }),
    generateExcuse: generateExcuseMock,
  };
});

const { POST } = await import("@/app/api/generate/route");

const VALID_OUTPUT = {
  excuse: "Лифт застрял",
  plausibility: 70,
  risk_note: "Соседи не подтвердят",
};

function post(ip: string): Request {
  return new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({ situation: "опоздал на работу", madness: 3 }),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  generateExcuseMock.mockResolvedValue(VALID_OUTPUT);
});

describe("POST /api/generate со сквозными лимитами", () => {
  it("пропускает первые RATE_LIMIT_HOURLY запросов и режет следующий", async () => {
    const ip = `10.1.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}`;

    for (let i = 0; i < RATE_LIMIT_HOURLY; i++) {
      const response = await POST(post(ip));
      expect(response.status).toBe(200);
    }

    const blocked = await POST(post(ip));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).not.toBeNull();
    expect(generateExcuseMock).toHaveBeenCalledTimes(RATE_LIMIT_HOURLY);
  });
});
