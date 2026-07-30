"use client";

import { useState } from "react";
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

export function ExcuseForm() {
  const [situation, setSituation] = useState("");
  const [madness, setMadness] = useState(MADNESS_DEFAULT);
  const [channel, setChannel] = useState<Channel>(CHANNEL_DEFAULT);
  const [excuse, setExcuse] = useState<Excuse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (situation.trim().length === 0) {
      setError(ERROR_MESSAGES.invalid_input);
      return;
    }

    setLoading(true);
    setError(null);
    setExcuse(null);

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

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {SITUATION_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setSituation(preset)}
            className="rounded-full border px-3 py-1 text-sm"
          >
            {preset}
          </button>
        ))}
      </div>

      <label htmlFor="situation" className="mt-6 block text-sm">
        Ситуация
      </label>
      <textarea
        id="situation"
        value={situation}
        maxLength={MAX_SITUATION_LENGTH}
        onChange={(event) => setSituation(event.target.value)}
        rows={3}
        className="mt-1 w-full rounded border p-3"
        placeholder="За что нужно оправдаться?"
      />
      <p className="text-right text-xs opacity-60">
        {situation.length} / {MAX_SITUATION_LENGTH}
      </p>

      <fieldset className="mt-4">
        <legend className="text-sm">Как отмазываешься</legend>
        <div className="mt-1 flex gap-2">
          {CHANNELS.map((value) => (
            <label
              key={value}
              className="cursor-pointer rounded-full border px-3 py-1 text-sm"
            >
              <input
                type="radio"
                name="channel"
                value={value}
                checked={channel === value}
                onChange={() => setChannel(value)}
                className="mr-2"
              />
              {CHANNEL_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      <label htmlFor="madness" className="mt-4 block text-sm">
        Уровень безумия: {madness}
      </label>
      <input
        id="madness"
        type="range"
        min={MADNESS_MIN}
        max={MADNESS_MAX}
        value={madness}
        onChange={(event) => setMadness(Number(event.target.value))}
        className="mt-1 w-full"
      />
      <p className="mt-1 text-xs opacity-70">{MADNESS_HINTS[madness]}</p>

      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="mt-6 rounded border px-6 py-3"
      >
        {loading ? "Выдумываю…" : "Придумать"}
      </button>

      {error && (
        <p role="alert" className="mt-4 text-sm">
          {error}
        </p>
      )}
      {excuse && <ExcuseCard excuse={excuse} />}
    </div>
  );
}
