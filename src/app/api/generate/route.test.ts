import { beforeEach, describe, expect, it, vi } from "vitest";
import { ERROR_MESSAGES } from "@/lib/config";

const generateExcuseMock = vi.fn();
const checkLimitsMock = vi.fn();

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

vi.mock("@/lib/limits", () => ({ checkLimits: checkLimitsMock }));
vi.mock("@/lib/kv", () => ({ getKv: () => ({ incr: vi.fn(), expire: vi.fn() }) }));

const { POST } = await import("@/app/api/generate/route");
const { ExcuseError } = await import("@/lib/excuse/client");

const VALID_OUTPUT = {
  excuse: "Лифт застрял",
  plausibility: 70,
  risk_note: "Соседи не подтвердят",
};

function post(body: unknown): Request {
  return new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "1.1.1.1" },
    body: JSON.stringify(body),
  });
}

function postWithHeaders(headers: Record<string, string>): Request {
  return new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify({ situation: "опоздал", madness: 3 }),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  checkLimitsMock.mockResolvedValue({ ok: true });
  generateExcuseMock.mockResolvedValue(VALID_OUTPUT);
});

describe("POST /api/generate", () => {
  it("возвращает 200 и отмазку на валидный запрос", async () => {
    const response = await POST(post({ situation: "опоздал", madness: 3 }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(VALID_OUTPUT);
  });

  it("возвращает 400 на невалидный ввод", async () => {
    const response = await POST(post({ situation: "", madness: 3 }));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: ERROR_MESSAGES.invalid_input });
  });

  it("возвращает 400 на битый JSON", async () => {
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{не json",
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("возвращает 429 и Retry-After при рейт-лимите", async () => {
    checkLimitsMock.mockResolvedValue({
      ok: false,
      reason: "ip_hourly",
      retryAfterSeconds: 1800,
    });
    const response = await POST(post({ situation: "опоздал", madness: 3 }));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("1800");
    expect(await response.json()).toEqual({ error: ERROR_MESSAGES.rate_limited });
  });

  it("возвращает 503 при исчерпанном бюджете", async () => {
    checkLimitsMock.mockResolvedValue({
      ok: false,
      reason: "global_daily",
      retryAfterSeconds: 3600,
    });
    const response = await POST(post({ situation: "опоздал", madness: 3 }));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: ERROR_MESSAGES.budget_exhausted,
    });
  });

  it("возвращает 502 при сбое апстрима", async () => {
    generateExcuseMock.mockRejectedValue(new ExcuseError("upstream", "боль"));
    const response = await POST(post({ situation: "опоздал", madness: 3 }));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: ERROR_MESSAGES.upstream });
  });

  it("возвращает 502 при неразбираемом ответе", async () => {
    generateExcuseMock.mockRejectedValue(new ExcuseError("unparsable", "боль"));
    const response = await POST(post({ situation: "опоздал", madness: 3 }));
    expect(response.status).toBe(502);
  });

  it("возвращает 422 при отказе модели", async () => {
    generateExcuseMock.mockRejectedValue(new ExcuseError("refusal", "боль"));
    const response = await POST(post({ situation: "опоздал", madness: 3 }));
    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({ error: ERROR_MESSAGES.refusal });
  });

  it("возвращает 502 на неизвестную ошибку", async () => {
    generateExcuseMock.mockRejectedValue(new Error("что-то другое"));
    const response = await POST(post({ situation: "опоздал", madness: 3 }));
    expect(response.status).toBe(502);
  });

  it("не вызывает модель, когда лимит исчерпан", async () => {
    checkLimitsMock.mockResolvedValue({
      ok: false,
      reason: "ip_daily",
      retryAfterSeconds: 60,
    });
    await POST(post({ situation: "опоздал", madness: 3 }));
    expect(generateExcuseMock).not.toHaveBeenCalled();
  });

  it("возвращает 503, когда хранилище лимитов недоступно", async () => {
    checkLimitsMock.mockRejectedValue(new Error("redis down"));
    const response = await POST(post({ situation: "опоздал", madness: 3 }));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: ERROR_MESSAGES.budget_exhausted,
    });
  });

  it("не вызывает модель, когда хранилище лимитов недоступно", async () => {
    checkLimitsMock.mockRejectedValue(new Error("redis down"));
    await POST(post({ situation: "опоздал", madness: 3 }));
    expect(generateExcuseMock).not.toHaveBeenCalled();
  });

  it("берёт первый адрес из списка x-forwarded-for", async () => {
    await POST(postWithHeaders({ "x-forwarded-for": "1.1.1.1, 2.2.2.2, 3.3.3.3" }));
    expect(checkLimitsMock).toHaveBeenCalledWith(expect.anything(), "1.1.1.1");
  });

  it("падает обратно на x-real-ip, когда x-forwarded-for отсутствует", async () => {
    await POST(postWithHeaders({ "x-real-ip": "9.9.9.9" }));
    expect(checkLimitsMock).toHaveBeenCalledWith(expect.anything(), "9.9.9.9");
  });

  it("использует unknown, когда заголовков с адресом нет", async () => {
    await POST(postWithHeaders({}));
    expect(checkLimitsMock).toHaveBeenCalledWith(expect.anything(), "unknown");
  });
});
