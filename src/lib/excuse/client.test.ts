import { describe, expect, it, vi } from "vitest";
import { ExcuseError, generateExcuse } from "@/lib/excuse/client";
import type { MessagesClient } from "@/lib/excuse/client";
import { MAX_TOKENS, MODEL } from "@/lib/config";

const VALID_OUTPUT = {
  excuse: "Лифт застрял между этажами",
  plausibility: 70,
  risk_note: "Соседи могут не подтвердить",
};

function fakeClient(response: unknown): MessagesClient {
  return {
    messages: { parse: vi.fn().mockResolvedValue(response) },
  } as unknown as MessagesClient;
}

describe("generateExcuse", () => {
  it("возвращает разобранный ответ модели", async () => {
    const client = fakeClient({
      stop_reason: "end_turn",
      parsed_output: VALID_OUTPUT,
    });
    const result = await generateExcuse(
      { situation: "опоздал", madness: 3 },
      client,
    );
    expect(result).toEqual(VALID_OUTPUT);
  });

  it("вызывает модель из конфигурации с нужным лимитом токенов", async () => {
    const client = fakeClient({
      stop_reason: "end_turn",
      parsed_output: VALID_OUTPUT,
    });
    await generateExcuse({ situation: "опоздал", madness: 3 }, client);

    const params = vi.mocked(client.messages.parse).mock.calls[0][0] as {
      model: string;
      max_tokens: number;
      system: string;
    };
    expect(params.model).toBe(MODEL);
    expect(params.max_tokens).toBe(MAX_TOKENS);
    expect(params.system).not.toContain("опоздал");
  });

  it("бросает refusal при stop_reason refusal", async () => {
    const client = fakeClient({ stop_reason: "refusal", parsed_output: null });
    await expect(
      generateExcuse({ situation: "опоздал", madness: 3 }, client),
    ).rejects.toMatchObject({ kind: "refusal" });
  });

  it("бросает unparsable при пустом parsed_output", async () => {
    const client = fakeClient({ stop_reason: "end_turn", parsed_output: null });
    await expect(
      generateExcuse({ situation: "опоздал", madness: 3 }, client),
    ).rejects.toMatchObject({ kind: "unparsable" });
  });

  it("бросает unparsable, если ответ не проходит схему", async () => {
    const client = fakeClient({
      stop_reason: "end_turn",
      parsed_output: { excuse: "текст", plausibility: 999, risk_note: "х" },
    });
    await expect(
      generateExcuse({ situation: "опоздал", madness: 3 }, client),
    ).rejects.toMatchObject({ kind: "unparsable" });
  });

  it("оборачивает сетевую ошибку SDK в upstream", async () => {
    const client = {
      messages: { parse: vi.fn().mockRejectedValue(new Error("ECONNRESET")) },
    } as unknown as MessagesClient;
    await expect(
      generateExcuse({ situation: "опоздал", madness: 3 }, client),
    ).rejects.toMatchObject({ kind: "upstream" });
  });

  it("бросает именно ExcuseError", async () => {
    const client = fakeClient({ stop_reason: "refusal", parsed_output: null });
    await expect(
      generateExcuse({ situation: "опоздал", madness: 3 }, client),
    ).rejects.toBeInstanceOf(ExcuseError);
  });
});
