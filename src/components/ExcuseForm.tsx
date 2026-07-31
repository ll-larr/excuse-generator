"use client";

import { useEffect, useState } from "react";
import { ExcuseCard } from "@/components/ExcuseCard";
import {
  CHANNELS,
  CHANNEL_DEFAULT,
  CHANNEL_LABELS,
  ERROR_MESSAGES,
  MADNESS_DEFAULT,
  MADNESS_HINTS,
  MADNESS_MAX,
  MADNESS_MIN,
  MAX_SITUATION_LENGTH,
  SITUATION_PRESETS,
  type Channel,
} from "@/lib/config";
import { ExcuseSchema } from "@/lib/excuse/schema";
import type { Excuse } from "@/lib/excuse/schema";

/** Смайлик на бегунке — по уровню безумия. Только оформление. */
const MADNESS_EMOJI: Record<number, string> = {
  1: "😇",
  2: "🙂",
  3: "🤨",
  4: "🤪",
  5: "🤡",
};

/** Реплики на время ожидания: запрос идёт 4–7 секунд. */
const LOADING_CHATTER = [
  "Сверяю версию с реальностью…",
  "Ищу свидетелей, которых не было…",
  "Подгоняю детали под уровень безумия…",
  "Проверяю, звучит ли это вслух…",
];

const pill =
  "cursor-pointer rounded-full border-2 border-line px-3.5 py-2.5 text-sm font-medium shadow-[0_2px_0_var(--line)] transition hover:-translate-y-px hover:shadow-[0_4px_0_var(--line)] active:translate-y-0.5 active:shadow-[0_1px_0_var(--line)]";

export function ExcuseForm() {
  const [situation, setSituation] = useState("");
  const [madness, setMadness] = useState(MADNESS_DEFAULT);
  const [channel, setChannel] = useState<Channel>(CHANNEL_DEFAULT);
  const [excuse, setExcuse] = useState<Excuse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatter, setChatter] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(
      () => setChatter((n) => (n + 1) % LOADING_CHATTER.length),
      1300,
    );
    return () => clearInterval(id);
  }, [loading]);

  async function submit() {
    if (situation.trim().length === 0) {
      setError(ERROR_MESSAGES.invalid_input);
      return;
    }

    setLoading(true);
    setError(null);
    setExcuse(null);
    setChatter(0);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ situation: situation.trim(), madness, channel }),
      });
      const body = await response.json();

      if (!response.ok) {
        setError(body.error ?? ERROR_MESSAGES.upstream);
        return;
      }

      const parsed = ExcuseSchema.safeParse(body);
      if (!parsed.success) {
        setError(ERROR_MESSAGES.upstream);
        return;
      }
      setExcuse(parsed.data);
    } catch {
      setError(ERROR_MESSAGES.upstream);
    } finally {
      setLoading(false);
    }
  }

  const ratio = (madness - MADNESS_MIN) / (MADNESS_MAX - MADNESS_MIN);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
      {/* ── Форма ─────────────────────────────────────────────── */}
      <div className="rounded-[22px] border-[3px] border-line bg-paper p-5 shadow-[0_6px_0_var(--line)] sm:p-7 lg:shadow-[9px_9px_0_var(--line)]">
        <div className="flex flex-wrap gap-2">
          {SITUATION_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setSituation(preset)}
              className={`${pill} ${situation === preset ? "bg-accent text-[#141210]" : "bg-background"}`}
            >
              {preset}
            </button>
          ))}
        </div>

        <label htmlFor="situation" className="mt-6 block text-sm font-semibold">
          Ситуация
        </label>
        <textarea
          id="situation"
          value={situation}
          maxLength={MAX_SITUATION_LENGTH}
          onChange={(event) => setSituation(event.target.value)}
          rows={3}
          className="mt-2 w-full resize-y rounded-2xl border-2 border-line bg-background p-3.5 text-base/relaxed shadow-[inset_0_2px_0_rgba(20,18,16,0.12)] placeholder:opacity-45"
          placeholder="За что нужно оправдаться?"
        />
        <p className="mt-1.5 text-right font-mono text-xs opacity-55">
          {situation.length} / {MAX_SITUATION_LENGTH}
        </p>

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:gap-7">
          <fieldset className="m-0 border-0 p-0 sm:w-[230px] sm:shrink-0">
            <legend className="p-0 text-sm font-semibold">Как отмазываешься</legend>
            <div className="mt-2.5 flex gap-2.5">
              {CHANNELS.map((value) => (
                <label
                  key={value}
                  className={`${pill} flex items-center gap-2 ${channel === value ? "bg-accent text-[#141210] shadow-[0_4px_0_var(--line)]" : "bg-background"}`}
                >
                  <input
                    type="radio"
                    name="channel"
                    value={value}
                    checked={channel === value}
                    onChange={() => setChannel(value)}
                    className="m-0 size-4 accent-[var(--line)]"
                  />
                  {CHANNEL_LABELS[value]}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="min-w-0 flex-1">
            <label htmlFor="madness" className="block text-sm font-semibold">
              Уровень безумия: {madness}
            </label>
            <div className="relative pt-11">
              <span
                aria-hidden="true"
                className="absolute top-0 grid h-10 w-11 -translate-x-1/2 place-items-center rounded-xl border-2 border-line bg-paper text-[22px]/none shadow-[0_3px_0_var(--line)] transition-[left] duration-100"
                style={{ left: `calc(${ratio * 100}% + ${(0.5 - ratio) * 34}px)` }}
              >
                {MADNESS_EMOJI[madness]}
              </span>
              <input
                id="madness"
                type="range"
                min={MADNESS_MIN}
                max={MADNESS_MAX}
                value={madness}
                onChange={(event) => setMadness(Number(event.target.value))}
                className="madness"
              />
              <div className="flex justify-between px-1 font-mono text-[11px] opacity-40">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
            </div>
            <p className="mt-3 min-h-10 text-sm/relaxed opacity-75">
              {MADNESS_HINTS[madness]}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full rounded-2xl border-[3px] border-line bg-accent px-6 py-4 text-[17px] font-bold text-[#141210] shadow-[0_5px_0_var(--line)] transition hover:-translate-y-0.5 hover:shadow-[0_7px_0_var(--line)] active:translate-y-0.5 active:shadow-[0_2px_0_var(--line)] disabled:cursor-progress disabled:opacity-70 sm:w-auto sm:px-10"
        >
          {loading ? "Выдумываю…" : "Придумать"}
        </button>

        {loading && (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-line bg-background p-3.5">
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="anim-wobble inline-block text-[22px]">
                {MADNESS_EMOJI[madness]}
              </span>
              <span className="text-sm font-medium">{LOADING_CHATTER[chatter]}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--line)_14%,transparent)]">
              <div className="anim-bar h-full w-2/5 rounded-full bg-line" />
            </div>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="anim-pop mt-4 flex items-start gap-2.5 rounded-2xl border-2 border-line bg-alarm px-3.5 py-3 text-sm/relaxed font-medium text-[#141210] shadow-[0_4px_0_var(--line)]"
          >
            <span aria-hidden="true">💀</span>
            {error}
          </p>
        )}

      </div>

      {/* ── Рельс результата: на десктопе справа и липкий, на узких — под формой ── */}
      <aside className="lg:sticky lg:top-8">
        {excuse ? (
          <ExcuseCard excuse={excuse} madness={madness} channel={channel} />
        ) : (
          <div className="hidden rounded-[18px] border-2 border-dashed border-[color-mix(in_oklab,var(--line)_45%,transparent)] px-5 py-8 text-center lg:block">
            <div aria-hidden="true" className="text-[26px]/none">
              🤷
            </div>
            <p className="mt-2.5 text-sm font-medium opacity-60">
              Здесь появится отмазка
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
