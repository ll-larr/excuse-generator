import { describe, expect, it } from "vitest";
import { projectName } from "@/lib/smoke";

describe("тестовый конвейер", () => {
  it("резолвит алиас @/ и запускает тесты", () => {
    expect(projectName()).toBe("генератор отмазок");
  });
});
