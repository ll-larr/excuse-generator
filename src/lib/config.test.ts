import { describe, expect, it } from "vitest";
import {
  CHANNELS,
  CHANNEL_DEFAULT,
  CHANNEL_LABELS,
  LOADING_CHATTER,
  MADNESS_EMOJI,
  MADNESS_HINTS,
  MADNESS_MAX,
  MADNESS_MIN,
  PLAUSIBILITY_RANGES,
} from "@/lib/config";

const LEVELS = [1, 2, 3, 4, 5];

describe("константы уровней", () => {
  it("описывает каждый уровень шкалы", () => {
    for (const level of LEVELS) {
      expect(MADNESS_HINTS[level]).toBeTruthy();
    }
    expect(Object.keys(MADNESS_HINTS)).toHaveLength(
      MADNESS_MAX - MADNESS_MIN + 1,
    );
  });

  it("даёт каждому уровню коридор правдоподобности", () => {
    for (const level of LEVELS) {
      const [min, max] = PLAUSIBILITY_RANGES[level];
      expect(min).toBeLessThan(max);
      expect(min).toBeGreaterThanOrEqual(0);
      expect(max).toBeLessThanOrEqual(100);
    }
  });

  it("даёт каждому уровню смайлик", () => {
    for (const level of LEVELS) {
      expect(MADNESS_EMOJI[level]).toBeTruthy();
    }
    expect(Object.keys(MADNESS_EMOJI)).toHaveLength(
      MADNESS_MAX - MADNESS_MIN + 1,
    );
  });

  it("коридоры идут вниз и не пересекаются", () => {
    for (const level of [2, 3, 4, 5]) {
      const [previousMin] = PLAUSIBILITY_RANGES[level - 1];
      const [, currentMax] = PLAUSIBILITY_RANGES[level];
      expect(currentMax).toBeLessThan(previousMin);
    }
  });
});

describe("константы каналов", () => {
  it("знает два канала и подпись к каждому", () => {
    expect(CHANNELS).toEqual(["sms", "live"]);
    for (const channel of CHANNELS) {
      expect(CHANNEL_LABELS[channel]).toBeTruthy();
    }
  });

  it("по умолчанию отмазка идёт в смс", () => {
    expect(CHANNEL_DEFAULT).toBe("sms");
  });
});

describe("реплики ожидания", () => {
  it("есть и все непустые", () => {
    expect(LOADING_CHATTER.length).toBeGreaterThan(1);
    for (const line of LOADING_CHATTER) {
      expect(line.trim()).toBeTruthy();
    }
  });
});
