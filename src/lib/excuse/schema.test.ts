import { describe, expect, it } from "vitest";
import { ExcuseSchema, GenerateRequestSchema } from "@/lib/excuse/schema";

describe("GenerateRequestSchema", () => {
  it("принимает валидный запрос", () => {
    const result = GenerateRequestSchema.safeParse({
      situation: "опоздал на работу",
      madness: 3,
    });
    expect(result.success).toBe(true);
  });

  it("отклоняет пустую ситуацию", () => {
    const result = GenerateRequestSchema.safeParse({ situation: "", madness: 3 });
    expect(result.success).toBe(false);
  });

  it("отклоняет ситуацию из одних пробелов", () => {
    const result = GenerateRequestSchema.safeParse({ situation: "     ", madness: 3 });
    expect(result.success).toBe(false);
  });

  it("принимает ровно 200 символов", () => {
    const result = GenerateRequestSchema.safeParse({
      situation: "я".repeat(200),
      madness: 3,
    });
    expect(result.success).toBe(true);
  });

  it("отклоняет 201 символ", () => {
    const result = GenerateRequestSchema.safeParse({
      situation: "я".repeat(201),
      madness: 3,
    });
    expect(result.success).toBe(false);
  });

  it("обрезает пробелы по краям", () => {
    const result = GenerateRequestSchema.parse({
      situation: "  проспал  ",
      madness: 1,
    });
    expect(result.situation).toBe("проспал");
  });

  it.each([0, 6, 2.5])("отклоняет madness = %s", (madness) => {
    const result = GenerateRequestSchema.safeParse({ situation: "проспал", madness });
    expect(result.success).toBe(false);
  });

  it.each([1, 5])("принимает граничный madness = %s", (madness) => {
    const result = GenerateRequestSchema.safeParse({ situation: "проспал", madness });
    expect(result.success).toBe(true);
  });
});

describe("ExcuseSchema", () => {
  it("принимает валидный ответ модели", () => {
    const result = ExcuseSchema.safeParse({
      excuse: "Меня задержал лифт",
      plausibility: 75,
      risk_note: "Начальник может проверить камеры",
    });
    expect(result.success).toBe(true);
  });

  it.each([-1, 101])("отклоняет plausibility = %s", (plausibility) => {
    const result = ExcuseSchema.safeParse({
      excuse: "текст",
      plausibility,
      risk_note: "заметка",
    });
    expect(result.success).toBe(false);
  });
});
