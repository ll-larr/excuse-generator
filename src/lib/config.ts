export const MODEL = "claude-sonnet-5";
export const MAX_TOKENS = 600;
export const EFFORT = "low" as const;

/**
 * "disabled" — размышление выключено: быстрее и дешевле, вся квота max_tokens
 * уходит на ответ. При переключении на "adaptive" поднять MAX_TOKENS до 2000,
 * иначе размышление съест лимит и JSON обрежется.
 */
export const THINKING_MODE: "disabled" | "adaptive" = "disabled";

export const MAX_SITUATION_LENGTH = 200;
export const MADNESS_MIN = 1;
export const MADNESS_MAX = 5;
export const MADNESS_DEFAULT = 3;

export const RATE_LIMIT_HOURLY = 10;
export const RATE_LIMIT_DAILY = 40;
export const GLOBAL_DAILY_BUDGET = 1000;

export const SITUATION_PRESETS = [
  "опоздал на работу",
  "не сделал домашку",
  "забыл про день рождения",
  "не пришёл на встречу",
  "не ответил на сообщения",
  "не сдал отчёт вовремя",
] as const;

export type ErrorKey =
  | "invalid_input"
  | "rate_limited"
  | "budget_exhausted"
  | "upstream"
  | "refusal";

export const ERROR_MESSAGES: Record<ErrorKey, string> = {
  invalid_input: "Опиши ситуацию, до 200 символов",
  rate_limited: "Слишком много отмазок. Отдышись.",
  budget_exhausted: "На сегодня отмазки кончились",
  upstream: "Не выдумывается. Попробуй ещё раз",
  refusal: "Такое придумать не могу",
};
